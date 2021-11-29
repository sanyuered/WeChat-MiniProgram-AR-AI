var isInitOk = false;

function initFaceDetect() {
  wx.initFaceDetect({
    success: function () {
      isInitOk = true;
      console.log('initFaceDetect', 'ok')
    },
    fail: function (err) {
      console.log('initFaceDetect', err)
    },
  })
}

function faceDetect(frame, callback) {
  if (!isInitOk) {
    return
  }
  var start = new Date();
  wx.faceDetect({
    frameBuffer: frame.data,
    width: frame.width,
    height: frame.height,
    // 是否返回当前图像的人脸（106 个点）
    enablePoint: true,
    // 是否返回当前图像的人脸的置信度（可表示遮挡情况）
    enableConf: false,
    // 是否返回当前图像的人脸角度信息
    enableAngle: true,
    // 是否返回多张人脸的信息
    enableMultiFace: false,
    success: function (res) {
      var end = new Date() - start;
      console.log('detect', end, 'ms');

      if (callback) {
        callback(res)
      }
    },
    fail: function (err) {
      console.log('faceDetect', err)
    },
  })
}

function stopFaceDetect() {
  wx.stopFaceDetect({
    success: function () {
    },
    fail: function (err) {
      console.log('stopFaceDetect', err)
    },
  })
}

module.exports = { initFaceDetect, faceDetect, stopFaceDetect }
