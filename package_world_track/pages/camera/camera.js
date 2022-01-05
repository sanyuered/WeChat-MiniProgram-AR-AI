const cameraBusiness = require('../../utils/cameraBusiness.js')
// 画布id
const canvasId = 'canvas1';
// 机器人模型，带动画。
const robotUrl = 'https://m.sanyue.red/demo/gltf/robot.glb';
// webgl画面录制器的帧数
const recorderFPS = 30
// webgl画面录制器的最长录制时间（单位：秒）
const recorderMaxTime = 5
// 画布组件
var canvas1;
// webgl画面录制器
var recorder;
// 是否在录制webgl画面
var isRecording = false

Page({
  data: {
    menuButtonTop: 32,
    menuButtonHeight: 33,
    recorderText: 'Start Recorder',
  },
  onReady() {
    console.log('onReady')

    // 获取小程序右上角胶囊按钮的坐标，用作自定义导航栏。
    const menuButton = wx.getMenuButtonBoundingClientRect()

    this.setData({
      // 胶囊按钮与手机屏幕顶端的间距
      menuButtonTop: menuButton.top,
      // 胶囊按钮的高度
      menuButtonHeight: menuButton.height,
    })

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
        cameraBusiness.loadModel(robotUrl, function (model, animations) {
          // 创建AR的坐标系
          cameraBusiness.initWorldTrack(model)
          // 加载3D模型的动画
          cameraBusiness.createAnimation(model, animations, 'Dance')
        })
        // webgl画面录制器
        recorder = wx.createMediaRecorder(canvas1, {
          fps: recorderFPS,
        })

      })


  },
  onUnload() {
    console.log('onUnload')
    // 将对象回收
    cameraBusiness.dispose()
    if (recorder) {
      recorder.destroy()
      recorder = null
    }
    isRecording = false
  },
  bindtouchend_callback(event) {
    console.log('bindtouchend_callback')
    // 在手指点击的位置放置3D模型 
    cameraBusiness.addModelByHitTest(event, false, false)
  },
  async startRecord() {
    this.setData({
      recorderText: 'Stop Recorder'
    })

    // 开始录制
    await recorder.start()
    // 录制 5s 的视频
    let frames = recorderFPS * recorderMaxTime
    // 逐帧绘制
    while (frames--) {
      // 中途停止录制
      if (!isRecording) {
        break
      }
      await recorder.requestFrame()
    }
    if (isRecording) {
      // 到达最长录制时间后，停止录制。
      await this.stopRecord();
    }
  },
  async stopRecord() {
    this.setData({
      recorderText: 'Start Recorder'
    })

    // 停止录制，生成视频的地址
    const { tempFilePath } = await recorder.stop()
    // 保存视频到手机相册
    wx.saveVideoToPhotosAlbum({
      filePath: tempFilePath,
      success(res) {
        console.log('wx.saveVideoToPhotosAlbum', res.errMsg)
        if (res.errMsg === 'saveVideoToPhotosAlbum:ok') {
          var message = '视频已保存到相册';
          wx.showToast({
            title: message,
            icon: 'none'
          });
        }
      }
    })
  },
  // 画面录制按钮
  async btnRecord_click() {
    if (isRecording) {
      isRecording = false
      await this.stopRecord()
    } else {
      isRecording = true
      await this.startRecord()
    }
  },
  // 后退按钮的点击事件
  backBtn_callback() {
    wx.navigateBack()
  },
});
