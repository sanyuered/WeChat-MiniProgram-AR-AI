const cameraBusiness = require('../../utils/cameraBusiness.js')
const mobilenet = require('../../utils/mobilenet.js');
// 画布id
const canvasId = 'canvas1';
// 画面录制的帧数
const fps = 5;
// 画布组件
var canvas1;
// webgl画面录制器
var recorder;
// 是否在运行画面录制
var isRecording = false;

Page({
  currentClassName: '',
  mobilenetModel: null,
  data: {
    menuButtonTop: 32,
    menuButtonHeight: 33,
    result: '',
  },
  async onReady() {
    console.log('onReady')
    // 获取小程序右上角胶囊按钮的坐标，用作自定义导航栏。
    const menuButton = wx.getMenuButtonBoundingClientRect()
    this.setData({
      // 胶囊按钮与手机屏幕顶端的间距
      menuButtonTop: menuButton.top,
      // 胶囊按钮的高度
      menuButtonHeight: menuButton.height,
    })

    // 加载AI模型
    await this.initMobilenet()

    // 获取画布组件
    wx.createSelectorQuery()
      .select('#' + canvasId)
      .node()
      .exec(res => {
        // 画布组件
        canvas1 = res[0].node
        // 启动AR会话
        cameraBusiness.initEnvironment(canvas1)
        // 加载3D模型
        const message = 'Tap on the screen.';
        cameraBusiness.loadTextModel(message, function (model, animations) {
          // 创建AR的坐标系
          cameraBusiness.initWorldTrack(model)
        })
        // webgl画面录制器
        recorder = wx.createMediaRecorder(canvas1, {
          fps: fps,
        })
      })
  },
  onUnload() {
    console.log('onUnload')
    // 将对象回收
    cameraBusiness.dispose()
    this.mobilenetModel = null
    isRecording = false
    recorder = null
    canvas1 = null
  },
  async initMobilenet() {
    // Load the model.
    this.mobilenetModel = await mobilenet.load({
      version: 2,
      alpha: 0.5,
    });
    this.setData({ result: 'model loaded.' });
    console.log('initMobilenet', 'model loaded');
  },
  async executeMobilenet(img) {
    if (!this.mobilenetModel) {
      return
    }
    // 检测图像前清空
    this.currentClassName = ''
    // Classify the image.
    const predictions = await this.mobilenetModel.classify(img);
    // 保存图像检测结果
    this.currentClassName = predictions[0].className.split(',')[0]
    this.setData({ result: this.currentClassName });
    console.log('executeMobilenet', predictions);
  },
  async recordWebGL() {
    if (isRecording) {
      return
    }
    isRecording = true

    // 开始录制
    await recorder.start()
    // 录制 1s 的视频
    var frames = fps
    while (frames--) {
      await recorder.requestFrame()
    }
    // 停止录制
    const { tempFilePath } = await recorder.stop()
    // 视频解码器
    var decorder = wx.createVideoDecoder()
    await decorder.start({
      // 视频文件
      source: tempFilePath,
      // 解码模式。0：按 pts 解码；1：以最快速度解码
      mode: 1,
      // 不需要音频轨道
      abortAudio: true,
    })
    // 从视频获取一帧画面
    var frameData = decorder.getFrameData()
    // frameData有时候会为空，再获取一次。
    if (frameData == null) {
      frameData = decorder.getFrameData()
    }
    console.log('frameData', frameData)
    await decorder.stop()

    if (frameData) {
      const img = {
        data: new Uint8Array(frameData.data),
        width: frameData.width,
        height: frameData.height,
      }
      await this.executeMobilenet(img)
    }

    isRecording = false
  },
  async bindtouchend_callback(event) {
    console.log('bindtouchend_callback')
    // 截屏并用深度学习检测画面中的物体
    await this.recordWebGL()
    // 创建文字模型
    const message = this.currentClassName
    if (message !== '') {
      const model = cameraBusiness.createText(message)
      // 在手指点击屏幕的位置放置文字模型 
      cameraBusiness.addModelByHitTest(event, false, true, model)
    }
  },
  // 后退按钮的点击事件
  backBtn_callback() {
    wx.navigateBack()
  },
});
