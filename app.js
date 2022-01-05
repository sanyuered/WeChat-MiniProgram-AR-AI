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

 const fetchWechat = require('fetch-wechat');
 const tf = require('@tensorflow/tfjs-core');
 const webgl = require('@tensorflow/tfjs-backend-webgl');
 const plugin = require('./plugin/index.js');
 const ENABLE_DEBUG = true;
 //app.js
 App({
   globalData: {
     localStorageIO: plugin.localStorageIO,
     fileStorageIO: plugin.fileStorageIO,
   },
   onLaunch: async function () {
     /*
 注意 由于最新版本的WeChat的OffscreenCanvas会随页面跳转而失效，
 在app.js的 onLaunch 函数中设置 tfjs 会导致小程序退出或页面跳转之后操作出错。
 建议在使用tfjs的page的onLoad中调用 configPlugin 函数。
 */
     plugin.configPlugin({
       fetchFunc: fetchWechat.fetchFunc(),
       tf,
       webgl,
       canvas: wx.createOffscreenCanvas()
     },
       ENABLE_DEBUG);
 
     /*
     注意 使用WASM暂时只能导入 2.0.0的tfjs库。因为2.0.1 版本wasm有和WeChat兼容性问题。
     中低端手机的GPU往往相对CPU要弱一些，而WASM backend是跑在CPU上的，这就为中低端手机提供了另一个加速平台。
     const info = wx.getSystemInfoSync();
     console.log(info.platform);
     if (info.platform == 'android') {
       setWasmPath(
           'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@2.0.0/wasm-out/tfjs-backend-wasm.wasm',
           true);
       await tf.setBackend('wasm');
       console.log('set wasm as backend');
     }
     */
   }
 })
 