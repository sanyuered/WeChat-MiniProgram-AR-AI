const cameraBusiness = require('../../utils/cameraBusiness.js')
// 画布id
const canvasId = 'canvas1';
// 光标模型
const reticleUrl = 'https://m.sanyue.red/demo/gltf/reticle.glb';

Page({
  data: {
    measureResult: 0,
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
        cameraBusiness.loadModel(reticleUrl, function (model) {
          cameraBusiness.setReticle(model)
        })
      })
  },
  onUnload() {
    console.log('onUnload')
    // 将对象回收
    cameraBusiness.dispose()
  },
  bindtouchend_callback(event) {
    var _that = this;
    console.log('bindtouchend_callback')
    // 根据点击光标的位置，绘制线条。
    cameraBusiness.setRuler(function (distance) {
      _that.setData({ 
        measureResult: distance,
      })
    })
  },
  // 后退按钮的点击事件
  backBtn_callback() {
    wx.navigateBack()
  },
});
