const { createScopedThreejs } = require('threejs-miniprogram');
const { registerGLTFLoader } = require('../../utils/gltf-loader.js');
// the scale of the 3d model
const initScale = 0.27;
// index of the track points of the face
const trackPointA = {
    // index of a landmark
    id: 78,
    // X coordinate
    x: 176, // the width of the face image is 375
    y: 206,
};
const trackPointB = {
    // index of a landmark
    id: 79,
    // X coordinate
    x: 196, // the width of the face image is 375
    y: 206,
};
// for assets/sunglass.glb model
const glassPitchOffset = 0.15;

var camera, scene, renderer;
var canvas;
var THREE;
var mainModel, requestId;
var canvasWidth, canvasHeight;

function initThree(canvasId, modelUrl) {
    wx.createSelectorQuery()
        .select('#' + canvasId)
        .node()
        .exec((res) => {
            canvas = res[0].node;
            THREE = createScopedThreejs(canvas);

            initScene();
            loadModel(modelUrl);
        });
}

function initScene() {
    camera = new THREE.OrthographicCamera(1, 1, 1, 1, -1000, 1000);
    // set the camera
    setSize();
    scene = new THREE.Scene();
    // ambient light
    scene.add(new THREE.AmbientLight(0xffffff));
    // direction light
    var directionallight = new THREE.DirectionalLight(0xffffff, 1);
    directionallight.position.set(0, 0, 1000);
    scene.add(directionallight);

    // init render
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    const devicePixelRatio = wx.getSystemInfoSync().pixelRatio;
    console.log('device pixel ratio', devicePixelRatio);
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(canvas.width, canvas.height);

    animate();
}

function loadModel(modelUrl) {
    registerGLTFLoader(THREE);
    var loader = new THREE.GLTFLoader();
    wx.showLoading({
        title: 'Loading 3D...',
    });
    loader.load(modelUrl,
        function (gltf) {
            console.log('loadModel', 'success');
            var model = gltf.scene;
            model.scale.setScalar(initScale);
            // save model
            mainModel = model;
            scene.add(model);
            wx.hideLoading();
        },
        null,
        function (error) {
            console.log('loadModel', error);
            wx.hideLoading();
            wx.showToast({
                title: 'Loading model failed.',
                icon: 'none',
                duration: 3000,
            });
        });
}

function updateModel(modelUrl) {
    var loader = new THREE.GLTFLoader();
    // loading
    wx.showLoading({
        title: 'Loading 3D...',
    });
    loader.load(modelUrl,
        function (gltf) {
            console.log('updateModel', 'success');
            var model = gltf.scene;
            model.scale.setScalar(initScale);
            // remove old model
            scene.remove(mainModel);
            // save new model
            mainModel = model;
            // add new model
            scene.add(model);
            wx.hideLoading();
        },
        null,
        function (error) {
            console.log('updateModel', error);
            wx.hideLoading();
            wx.showToast({
                title: 'Loading model failed.',
                icon: 'none',
                duration: 3000,
            });
        });

    wx.hideLoading();
}

function setSize() {
    if (!camera) {
        return;
    }
    const w = canvasWidth;
    const h = canvasHeight;
    camera.left = -0.5 * w;
    camera.right = 0.5 * w;
    camera.top = 0.5 * h;
    camera.bottom = -0.5 * h;
    camera.updateProjectionMatrix();
}

function setModel(prediction,
    _canvasWidth,
    _canvasHeight) {

    if (!mainModel) {
        console.log('setModel', '3d model is not loaded.');
        return;
    }

    if (_canvasWidth !== canvasWidth) {
        canvasWidth = _canvasWidth;
        canvasHeight = _canvasHeight;
        setSize();
    }

    const result = calcPose(prediction);
    console.log('calcPose', result);

    // position
    mainModel.position.copy(result.position);
    // rotation
    mainModel.rotation.copy(result.rotation);
    // scale
    mainModel.scale.setScalar(initScale * result.scale);
}

function calcPose(prediction) {
    var a = prediction.pointArray[trackPointA.id];
    var b = prediction.pointArray[trackPointB.id];

    // position
    var center_x = (a.x + b.x) / 2;
    var center_y = (a.y + b.y) / 2;
    var center = {
        x: center_x - canvasWidth / 2,
        y: canvasHeight / 2 - center_y,
    };
    var position = new THREE.Vector3(center.x,
        center.y,
        0)

    // rotation
    var angleArray = prediction.angleArray
    var rotation = new THREE.Euler(-angleArray.pitch + glassPitchOffset,
        -angleArray.yaw,
        -angleArray.roll,
        'XYZ')

    // origin distince
    var p_A = new THREE.Vector3(trackPointA.x,
        trackPointA.y,
        0)
    var p_B = new THREE.Vector3(trackPointB.x,
        trackPointB.y,
        0)
    var originDistance = p_A.distanceTo(p_B);

    // current distince
    var p_a = new THREE.Vector3(a.x,
        a.y,
        0)
    var p_b = new THREE.Vector3(b.x,
        b.y,
        0)
    var currentDistance = p_a.distanceTo(p_b);

    // scale
    var scale = currentDistance / originDistance;

    return {
        position: position,
        rotation: rotation,
        scale: scale,
    };
}

function setSceneBackground(frame) {
    var texture = new THREE.DataTexture(frame.data,
        frame.width,
        frame.height,
        THREE.RGBAFormat);
    texture.flipY = true;
    texture.needsUpdate = true;
    scene.background = texture;
}

function clearSceneBackground() {
    scene.background = null;
}

function animate() {
    requestId = canvas.requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function stopAnimate() {
    if (canvas && requestId) {
        canvas.cancelAnimationFrame(requestId);
    }
}

function dispose() {
    camera = null;
    scene = null;
    renderer = null;
    canvas = null;
    THREE = null;
    mainModel = null;
    requestId = null;
    canvasWidth = null;
    canvasHeight = null;
}

module.exports = {
    initThree,
    stopAnimate,
    updateModel,
    setModel,
    setSceneBackground,
    clearSceneBackground,
    dispose,
}