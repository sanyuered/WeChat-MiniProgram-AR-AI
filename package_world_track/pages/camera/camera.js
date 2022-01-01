const cameraBusiness = require('../../utils/cameraBusiness.js')
// 画布id
const canvasId = 'canvas1';
// 机器人模型，带动画。
const robotUrl = 'https://m.sanyue.red/demo/gltf/robot.glb';

Page({
  data: {
    menuButtonTop:32,
    menuButtonHeight:33,
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
        const canvas = res[0].node
        // 启动AR会话
        cameraBusiness.initEnvironment(canvas)
        // 加载3D模型
        cameraBusiness.loadModel(robotUrl, function (model, animations) {
          // 创建AR的坐标系
          cameraBusiness.initWorldTrack(model)
          // 加载3D模型的动画
          cameraBusiness.createAnimation(model, animations, 'Dance')
        })

      })
  },
  onUnload() {
    console.log('onUnload')
    // 将对象回收
    cameraBusiness.dispose()
  },
  bindtouchend_callback(event) {
    console.log('bindtouchend_callback')
    // 在手指点击的位置放置3D模型 
    cameraBusiness.addModelByHitTest(event, false, false)
  },
  scanQRCode() {
    // 扫描3D模型地址的二维码，地址形如xxx.gltf或xxx.glb。
    wx.scanCode({
      success(res) {
        console.log('scanCode', res);
        // 二维码包含的地址
        var modelUrl = res.result;
        // 更新3D模型地址
        cameraBusiness.updateModel(modelUrl);
      }
    });
  },
  // 后退按钮的点击事件
  backBtn_callback() {
    wx.navigateBack()
  },
});
