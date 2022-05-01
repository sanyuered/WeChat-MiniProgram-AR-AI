module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1631012218330, function(require, module, exports) {

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tfconv = require("@tensorflow/tfjs-converter");
var face_1 = require("./face");
// var BLAZEFACE_MODEL_URL = 'https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1';
// modified
var BLAZEFACE_MODEL_URL = 'https://m.sanyue.red/demo/tfjs/blazeface_v1';
/**
 * Load blazeface.
 *
 * @param config A configuration object with the following properties:
 *  `maxFaces` The maximum number of faces returned by the model.
 *  `inputWidth` The width of the input image.
 *  `inputHeight` The height of the input image.
 *  `iouThreshold` The threshold for deciding whether boxes overlap too
 * much.
 *  `scoreThreshold` The threshold for deciding when to remove boxes based
 * on score.
 */
function load(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.maxFaces, maxFaces = _c === void 0 ? 10 : _c, _d = _b.inputWidth, inputWidth = _d === void 0 ? 128 : _d, _e = _b.inputHeight, inputHeight = _e === void 0 ? 128 : _e, _f = _b.iouThreshold, iouThreshold = _f === void 0 ? 0.3 : _f, _g = _b.scoreThreshold, scoreThreshold = _g === void 0 ? 0.75 : _g, modelUrl = _b.modelUrl;
    return __awaiter(this, void 0, void 0, function () {
        var blazeface, model;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!(modelUrl != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, tfconv.loadGraphModel(modelUrl)];
                case 1:
                    blazeface = _h.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, tfconv.loadGraphModel(BLAZEFACE_MODEL_URL, {
                        fromTFHub: true,
                    })];
                case 3:
                    blazeface = _h.sent();
                    _h.label = 4;
                case 4:
                    model = new face_1.BlazeFaceModel(blazeface, inputWidth, inputHeight, maxFaces, iouThreshold, scoreThreshold);
                    return [2 /*return*/, model];
            }
        });
    });
}
exports.load = load;
var face_2 = require("./face");
exports.BlazeFaceModel = face_2.BlazeFaceModel;
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {"./face":1631012218331}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1631012218331, function(require, module, exports) {

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-core");
var box_1 = require("./box");
var ANCHORS_CONFIG = {
    'strides': [8, 16],
    'anchors': [2, 6]
};
// `NUM_LANDMARKS` is a fixed property of the model.
var NUM_LANDMARKS = 6;
function generateAnchors(width, height, outputSpec) {
    var anchors = [];
    for (var i = 0; i < outputSpec.strides.length; i++) {
        var stride = outputSpec.strides[i];
        var gridRows = Math.floor((height + stride - 1) / stride);
        var gridCols = Math.floor((width + stride - 1) / stride);
        var anchorsNum = outputSpec.anchors[i];
        for (var gridY = 0; gridY < gridRows; gridY++) {
            var anchorY = stride * (gridY + 0.5);
            for (var gridX = 0; gridX < gridCols; gridX++) {
                var anchorX = stride * (gridX + 0.5);
                for (var n = 0; n < anchorsNum; n++) {
                    anchors.push([anchorX, anchorY]);
                }
            }
        }
    }
    return anchors;
}
function decodeBounds(boxOutputs, anchors, inputSize) {
    var boxStarts = tf.slice(boxOutputs, [0, 1], [-1, 2]);
    var centers = tf.add(boxStarts, anchors);
    var boxSizes = tf.slice(boxOutputs, [0, 3], [-1, 2]);
    var boxSizesNormalized = tf.div(boxSizes, inputSize);
    var centersNormalized = tf.div(centers, inputSize);
    var halfBoxSize = tf.div(boxSizesNormalized, 2);
    var starts = tf.sub(centersNormalized, halfBoxSize);
    var ends = tf.add(centersNormalized, halfBoxSize);
    var startNormalized = tf.mul(starts, inputSize);
    var endNormalized = tf.mul(ends, inputSize);
    var concatAxis = 1;
    return tf.concat2d([startNormalized, endNormalized], concatAxis);
}
function getInputTensorDimensions(input) {
    return input instanceof tf.Tensor ? [input.shape[0], input.shape[1]] :
        [input.height, input.width];
}
function flipFaceHorizontal(face, imageWidth) {
    var flippedTopLeft, flippedBottomRight, flippedLandmarks;
    if (face.topLeft instanceof tf.Tensor &&
        face.bottomRight instanceof tf.Tensor) {
        var _a = tf.tidy(function () {
            return [
                tf.concat([
                    tf.slice(tf.sub(imageWidth - 1, face.topLeft), 0, 1),
                    tf.slice(face.topLeft, 1, 1)
                ]),
                tf.concat([
                    tf.sub(imageWidth - 1, tf.slice(face.bottomRight, 0, 1)),
                    tf.slice(face.bottomRight, 1, 1)
                ])
            ];
        }), topLeft = _a[0], bottomRight = _a[1];
        flippedTopLeft = topLeft;
        flippedBottomRight = bottomRight;
        if (face.landmarks != null) {
            flippedLandmarks = tf.tidy(function () {
                var a = tf.sub(tf.tensor1d([imageWidth - 1, 0]), face.landmarks);
                var b = tf.tensor1d([1, -1]);
                var product = tf.mul(a, b);
                return product;
            });
        }
    }
    else {
        var _b = face.topLeft, topLeftX = _b[0], topLeftY = _b[1];
        var _c = face.bottomRight, bottomRightX = _c[0], bottomRightY = _c[1];
        flippedTopLeft = [imageWidth - 1 - topLeftX, topLeftY];
        flippedBottomRight = [imageWidth - 1 - bottomRightX, bottomRightY];
        if (face.landmarks != null) {
            flippedLandmarks =
                face.landmarks.map(function (coord) { return ([
                    imageWidth - 1 - coord[0],
                    coord[1]
                ]); });
        }
    }
    var flippedFace = {
        topLeft: flippedTopLeft,
        bottomRight: flippedBottomRight
    };
    if (flippedLandmarks != null) {
        flippedFace.landmarks = flippedLandmarks;
    }
    if (face.probability != null) {
        flippedFace.probability = face.probability instanceof tf.Tensor ?
            face.probability.clone() :
            face.probability;
    }
    return flippedFace;
}
function scaleBoxFromPrediction(face, scaleFactor) {
    return tf.tidy(function () {
        var box;
        if (face.hasOwnProperty('box')) {
            box = face.box;
        }
        else {
            box = face;
        }
        return tf.squeeze(box_1.scaleBox(box, scaleFactor).startEndTensor);
    });
}
var BlazeFaceModel = /** @class */ (function () {
    function BlazeFaceModel(model, width, height, maxFaces, iouThreshold, scoreThreshold) {
        this.blazeFaceModel = model;
        this.width = width;
        this.height = height;
        this.maxFaces = maxFaces;
        this.anchorsData = generateAnchors(width, height, ANCHORS_CONFIG);
        this.anchors = tf.tensor2d(this.anchorsData);
        this.inputSizeData = [width, height];
        this.inputSize = tf.tensor1d([width, height]);
        this.iouThreshold = iouThreshold;
        this.scoreThreshold = scoreThreshold;
    }
    BlazeFaceModel.prototype.getBoundingBoxes = function (inputImage, returnTensors, annotateBoxes) {
        if (annotateBoxes === void 0) { annotateBoxes = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, detectedOutputs, boxes, scores, savedConsoleWarnFn, boxIndicesTensor, boxIndices, boundingBoxes, originalHeight, originalWidth, scaleFactor, annotatedBoxes, _loop_1, i;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = tf.tidy(function () {
                            var resizedImage = tf.image.resizeBilinear(inputImage, [_this.width, _this.height]);
                            var normalizedImage = tf.mul(tf.sub(tf.div(resizedImage, 255), 0.5), 2);
                            // [1, 897, 17] 1 = batch, 897 = number of anchors
                            var batchedPrediction = _this.blazeFaceModel.predict(normalizedImage);
                            var prediction = tf.squeeze(batchedPrediction);
                            var decodedBounds = decodeBounds(prediction, _this.anchors, _this.inputSize);
                            var logits = tf.slice(prediction, [0, 0], [-1, 1]);
                            var scores = tf.squeeze(tf.sigmoid(logits));
                            return [prediction, decodedBounds, scores];
                        }), detectedOutputs = _a[0], boxes = _a[1], scores = _a[2];
                        savedConsoleWarnFn = console.warn;
                        console.warn = function () { };
                        boxIndicesTensor = tf.image.nonMaxSuppression(boxes, scores, this.maxFaces, this.iouThreshold, this.scoreThreshold);
                        console.warn = savedConsoleWarnFn;
                        return [4 /*yield*/, boxIndicesTensor.array()];
                    case 1:
                        boxIndices = _b.sent();
                        boxIndicesTensor.dispose();
                        boundingBoxes = boxIndices.map(function (boxIndex) { return tf.slice(boxes, [boxIndex, 0], [1, -1]); });
                        if (!!returnTensors) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.all(boundingBoxes.map(function (boundingBox) { return __awaiter(_this, void 0, void 0, function () {
                                var vals;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, boundingBox.array()];
                                        case 1:
                                            vals = _a.sent();
                                            boundingBox.dispose();
                                            return [2 /*return*/, vals];
                                    }
                                });
                            }); }))];
                    case 2:
                        boundingBoxes = _b.sent();
                        _b.label = 3;
                    case 3:
                        originalHeight = inputImage.shape[1];
                        originalWidth = inputImage.shape[2];
                        if (returnTensors) {
                            scaleFactor = tf.div([originalWidth, originalHeight], this.inputSize);
                        }
                        else {
                            scaleFactor = [
                                originalWidth / this.inputSizeData[0],
                                originalHeight / this.inputSizeData[1]
                            ];
                        }
                        annotatedBoxes = [];
                        _loop_1 = function (i) {
                            var boundingBox = boundingBoxes[i];
                            var annotatedBox = tf.tidy(function () {
                                var box = boundingBox instanceof tf.Tensor ?
                                    box_1.createBox(boundingBox) :
                                    box_1.createBox(tf.tensor2d(boundingBox));
                                if (!annotateBoxes) {
                                    return box;
                                }
                                var boxIndex = boxIndices[i];
                                var anchor;
                                if (returnTensors) {
                                    anchor = tf.slice(_this.anchors, [boxIndex, 0], [1, 2]);
                                }
                                else {
                                    anchor = _this.anchorsData[boxIndex];
                                }
                                var landmarks = tf.reshape(tf.squeeze(tf.slice(detectedOutputs, [boxIndex, NUM_LANDMARKS - 1], [1, -1])), [NUM_LANDMARKS, -1]);
                                var probability = tf.slice(scores, [boxIndex], [1]);
                                return { box: box, landmarks: landmarks, probability: probability, anchor: anchor };
                            });
                            annotatedBoxes.push(annotatedBox);
                        };
                        for (i = 0; i < boundingBoxes.length; i++) {
                            _loop_1(i);
                        }
                        boxes.dispose();
                        scores.dispose();
                        detectedOutputs.dispose();
                        return [2 /*return*/, {
                                boxes: annotatedBoxes,
                                scaleFactor: scaleFactor
                            }];
                }
            });
        });
    };
    /**
     * Returns an array of faces in an image.
     *
     * @param input The image to classify. Can be a tensor, DOM element image,
     * video, or canvas.
     * @param returnTensors (defaults to `false`) Whether to return tensors as
     * opposed to values.
     * @param flipHorizontal Whether to flip/mirror the facial keypoints
     * horizontally. Should be true for videos that are flipped by default (e.g.
     * webcams).
     * @param annotateBoxes (defaults to `true`) Whether to annotate bounding
     * boxes with additional properties such as landmarks and probability. Pass in
     * `false` for faster inference if annotations are not needed.
     *
     * @return An array of detected faces, each with the following properties:
     *  `topLeft`: the upper left coordinate of the face in the form `[x, y]`
     *  `bottomRight`: the lower right coordinate of the face in the form `[x, y]`
     *  `landmarks`: facial landmark coordinates
     *  `probability`: the probability of the face being present
     */
    BlazeFaceModel.prototype.estimateFaces = function (input, returnTensors, flipHorizontal, annotateBoxes) {
        if (returnTensors === void 0) { returnTensors = false; }
        if (flipHorizontal === void 0) { flipHorizontal = false; }
        if (annotateBoxes === void 0) { annotateBoxes = true; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, width, image, _b, boxes, scaleFactor;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = getInputTensorDimensions(input), width = _a[1];
                        image = tf.tidy(function () {
                            if (!(input instanceof tf.Tensor)) {
                                input = tf.browser.fromPixels(input);
                            }
                            return tf.expandDims(tf.cast(input, 'float32'), 0);
                        });
                        return [4 /*yield*/, this.getBoundingBoxes(image, returnTensors, annotateBoxes)];
                    case 1:
                        _b = _c.sent(), boxes = _b.boxes, scaleFactor = _b.scaleFactor;
                        image.dispose();
                        if (returnTensors) {
                            return [2 /*return*/, boxes.map(function (face) {
                                    var scaledBox = scaleBoxFromPrediction(face, scaleFactor);
                                    var normalizedFace = {
                                        topLeft: tf.slice(scaledBox, [0], [2]),
                                        bottomRight: tf.slice(scaledBox, [2], [2])
                                    };
                                    if (annotateBoxes) {
                                        var _a = face, landmarks = _a.landmarks, probability = _a.probability, anchor = _a.anchor;
                                        var normalizedLandmarks = tf.mul(tf.add(landmarks, anchor), scaleFactor);
                                        normalizedFace.landmarks = normalizedLandmarks;
                                        normalizedFace.probability = probability;
                                    }
                                    if (flipHorizontal) {
                                        normalizedFace = flipFaceHorizontal(normalizedFace, width);
                                    }
                                    return normalizedFace;
                                })];
                        }
                        return [2 /*return*/, Promise.all(boxes.map(function (face) { return __awaiter(_this, void 0, void 0, function () {
                                var scaledBox, normalizedFace, boxData, _a, landmarkData, boxData, probabilityData, anchor_1, _b, scaleFactorX_1, scaleFactorY_1, scaledLandmarks;
                                var _this = this;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            scaledBox = scaleBoxFromPrediction(face, scaleFactor);
                                            if (!!annotateBoxes) return [3 /*break*/, 2];
                                            return [4 /*yield*/, scaledBox.array()];
                                        case 1:
                                            boxData = _c.sent();
                                            normalizedFace = {
                                                topLeft: boxData.slice(0, 2),
                                                bottomRight: boxData.slice(2)
                                            };
                                            return [3 /*break*/, 4];
                                        case 2: return [4 /*yield*/, Promise.all([face.landmarks, scaledBox, face.probability].map(function (d) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                return [2 /*return*/, d.array()];
                                            }); }); }))];
                                        case 3:
                                            _a = _c.sent(), landmarkData = _a[0], boxData = _a[1], probabilityData = _a[2];
                                            anchor_1 = face.anchor;
                                            _b = scaleFactor, scaleFactorX_1 = _b[0], scaleFactorY_1 = _b[1];
                                            scaledLandmarks = landmarkData
                                                .map(function (landmark) { return ([
                                                (landmark[0] + anchor_1[0]) * scaleFactorX_1,
                                                (landmark[1] + anchor_1[1]) * scaleFactorY_1
                                            ]); });
                                            normalizedFace = {
                                                topLeft: boxData.slice(0, 2),
                                                bottomRight: boxData.slice(2),
                                                landmarks: scaledLandmarks,
                                                probability: probabilityData
                                            };
                                            box_1.disposeBox(face.box);
                                            face.landmarks.dispose();
                                            face.probability.dispose();
                                            _c.label = 4;
                                        case 4:
                                            scaledBox.dispose();
                                            if (flipHorizontal) {
                                                normalizedFace = flipFaceHorizontal(normalizedFace, width);
                                            }
                                            return [2 /*return*/, normalizedFace];
                                    }
                                });
                            }); }))];
                }
            });
        });
    };
    return BlazeFaceModel;
}());
exports.BlazeFaceModel = BlazeFaceModel;
//# sourceMappingURL=face.js.map
}, function(modId) { var map = {"./box":1631012218332}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1631012218332, function(require, module, exports) {

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-core");
exports.disposeBox = function (box) {
    box.startEndTensor.dispose();
    box.startPoint.dispose();
    box.endPoint.dispose();
};
exports.createBox = function (startEndTensor) { return ({
    startEndTensor: startEndTensor,
    startPoint: tf.slice(startEndTensor, [0, 0], [-1, 2]),
    endPoint: tf.slice(startEndTensor, [0, 2], [-1, 2])
}); };
exports.scaleBox = function (box, factors) {
    var starts = tf.mul(box.startPoint, factors);
    var ends = tf.mul(box.endPoint, factors);
    var newCoordinates = tf.concat2d([starts, ends], 1);
    return exports.createBox(newCoordinates);
};
//# sourceMappingURL=box.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1631012218330);
})()
//# sourceMappingURL=index.js.map