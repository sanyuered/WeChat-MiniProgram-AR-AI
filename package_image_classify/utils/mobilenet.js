/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

 import * as tfconv from '@tensorflow/tfjs-converter';
 import * as tf from '@tensorflow/tfjs-core';
 
 import { IMAGENET_CLASSES } from './imagenet_classes.js';
 
 const IMAGE_SIZE = 224;
 
 const EMBEDDING_NODES = {
   '1.00': 'module_apply_default/MobilenetV1/Logits/global_pool',
   '2.00': 'module_apply_default/MobilenetV2/Logits/AvgPool'
 };
 
 const MODEL_INFO = {
   '1.00': {
     '0.25': {
       url:
         'https://tfhub.dev/google/imagenet/mobilenet_v1_025_224/classification/1',
       inputRange: [0, 1]
     },
     '0.50': {
       url:
         'https://tfhub.dev/google/imagenet/mobilenet_v1_050_224/classification/1',
       inputRange: [0, 1]
     },
     '0.75': {
       url:
         'https://tfhub.dev/google/imagenet/mobilenet_v1_075_224/classification/1',
       inputRange: [0, 1]
     },
     '1.00': {
       url:
         'https://tfhub.dev/google/imagenet/mobilenet_v1_100_224/classification/1',
       inputRange: [0, 1]
     }
   }, // mobilenet_model_path
   '2.00': {
     '0.50': {
       url:
         'https://m.sanyue.red/demo/tfjs/mobilenet_v2_050_224',
       inputRange: [0, 1]
     },
     '0.75': {
       url:
         'https://tfhub.dev/google/imagenet/mobilenet_v2_075_224/classification/2',
       inputRange: [0, 1]
     },
     '1.00': {
       url:
         'https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/2',
       inputRange: [0, 1]
     }
   }
 };
 
 const STORAGE_KEY = 'mobilenet_model';
 
 // See ModelConfig documentation for expectations of provided fields.
 export async function load(modelConfig = {
   version: 1,
   alpha: 1.0
 }) {
   if (tf == null) {
     throw new Error(
       `Cannot find TensorFlow.js. If you are using a <script> tag, please ` +
       `also include @tensorflow/tfjs on the page before using this model.`);
   }
   const versionStr = modelConfig.version.toFixed(2);
   const alphaStr = modelConfig.alpha ? modelConfig.alpha.toFixed(2) : '';
   let inputMin = -1;
   let inputMax = 1;
   // User provides versionStr / alphaStr.
   if (modelConfig.modelUrl == null) {
     if (!(versionStr in MODEL_INFO)) {
       throw new Error(
         `Invalid version of MobileNet. Valid versions are: ` +
         `${Object.keys(MODEL_INFO)}`);
     }
     if (!(alphaStr in MODEL_INFO[versionStr])) {
       throw new Error(
         `MobileNet constructed with invalid alpha ${modelConfig.alpha}. Valid ` +
         `multipliers for this version are: ` +
         `${Object.keys(MODEL_INFO[versionStr])}.`);
     }
     [inputMin, inputMax] = MODEL_INFO[versionStr][alphaStr].inputRange;
   }
   // User provides modelUrl & optional<inputRange>.
   if (modelConfig.inputRange != null) {
     [inputMin, inputMax] = modelConfig.inputRange;
   }
   const mobilenet = new MobileNetImpl(
     versionStr, alphaStr, modelConfig.modelUrl, inputMin, inputMax);
   await mobilenet.load();
   return mobilenet;
 }
 
 class MobileNetImpl {
   constructor(
     version, 
     alpha,
     modelUrl, 
     inputMin = -1,
     inputMax = 1) {
 
     this.version = version
     this.alpha = alpha
     this.modelUrl = modelUrl
     this.inputMin = inputMin
     this.inputMax = inputMax
 
     this.normalizationConstant = (inputMax - inputMin) / 255.0;
   }
 
   async load() {
     // save model into fileStorageIO
     const storageHandler = getApp().globalData.fileStorageIO(
       STORAGE_KEY, 
       wx.getFileSystemManager());
 
     try {
       this.model = await tfconv.loadGraphModel(storageHandler);
       console.log('load local model','success')
     } catch (e) {
       console.log('load local model',e)
       if (this.modelUrl) {
         this.model = await tfconv.loadGraphModel(this.modelUrl);
         // Expect that models loaded by URL should be normalized to [-1, 1]
       } else {
         const url = MODEL_INFO[this.version][this.alpha].url;
         this.model = await tfconv.loadGraphModel(url, { fromTFHub: true });
       }
       this.model.save(storageHandler);
     }
 
     // Warmup the model.
     const result = tf.tidy(
       () => this.model.predict(tf.zeros(
         [1, IMAGE_SIZE, IMAGE_SIZE, 3])));
     await result.data();
     result.dispose();
   }
 
   /**
    * Computes the logits (or the embedding) for the provided image.
    *
    * @param img The image to classify. Can be a tensor or a DOM element image,
    *     video, or canvas.
    * @param embedding If true, it returns the embedding. Otherwise it returns
    *     the 1000-dim logits.
    */
   infer(
     img,
     embedding = false) {
     return tf.tidy(() => {
       if (!(img instanceof tf.Tensor)) {
         img = tf.browser.fromPixels(img);
       }
 
       // Normalize the image from [0, 255] to [inputMin, inputMax].
       const normalized = tf.add(
         tf.mul(tf.cast(img, 'float32'), this.normalizationConstant),
         this.inputMin);
 
       // Resize the image to
       let resized = normalized;
       if (img.shape[0] !== IMAGE_SIZE || img.shape[1] !== IMAGE_SIZE) {
         const alignCorners = true;
         resized = tf.image.resizeBilinear(
           normalized, [IMAGE_SIZE, IMAGE_SIZE], alignCorners);
       }
 
       // Reshape so we can pass it to predict.
       const batched = tf.reshape(resized, [-1, IMAGE_SIZE, IMAGE_SIZE, 3]);
 
       let result;
 
       if (embedding) {
         const embeddingName = EMBEDDING_NODES[this.version];
         const internal =
           this.model.execute(batched, embeddingName);
         result = tf.squeeze(internal, [1, 2]);
       } else {
         const logits1001 = this.model.predict(batched);
         // Remove the very first logit (background noise).
         result = tf.slice(logits1001, [0, 1], [-1, 1000]);
       }
 
       return result;
     });
   }
 
   /**
    * Classifies an image from the 1000 ImageNet classes returning a map of
    * the most likely class names to their probability.
    *
    * @param img The image to classify. Can be a tensor or a DOM element image,
    * video, or canvas.
    * @param topk How many top values to use. Defaults to 3.
    */
   async classify(
     img,
     topk = 3) {
     var start = new Date();
     const logits = this.infer(img);
     var end = new Date() - start;
     console.log('classify', end, 'ms');
 
     const classes = await getTopKClasses(logits, topk);
 
     logits.dispose();
 
     return classes;
   }
 }
 
 async function getTopKClasses(logits, topK) {
   const softmax = tf.softmax(logits);
   const values = await softmax.data();
   softmax.dispose();
 
   const valuesAndIndices = [];
   for (let i = 0; i < values.length; i++) {
     valuesAndIndices.push({ value: values[i], index: i });
   }
   valuesAndIndices.sort((a, b) => {
     return b.value - a.value;
   });
   const topkValues = new Float32Array(topK);
   const topkIndices = new Int32Array(topK);
   for (let i = 0; i < topK; i++) {
     topkValues[i] = valuesAndIndices[i].value;
     topkIndices[i] = valuesAndIndices[i].index;
   }
 
   const topClassesAndProbs = [];
   for (let i = 0; i < topkIndices.length; i++) {
     topClassesAndProbs.push({
       className: IMAGENET_CLASSES[topkIndices[i]],
       probability: topkValues[i]
     });
   }
   return topClassesAndProbs;
 }