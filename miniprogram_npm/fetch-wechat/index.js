module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1631012218353, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.TEXT_FILE_EXTS = /\.(txt|json|html|txt|csv)/;
function parseResponse(url, res) {
    var header = res.header || {};
    header = Object.keys(header).reduce(function (map, key) {
        map[key.toLowerCase()] = header[key];
        return map;
    }, {});
    return {
        ok: ((res.statusCode / 200) | 0) === 1,
        status: res.statusCode,
        statusText: res.statusCode,
        url: url,
        clone: function () { return parseResponse(url, res); },
        text: function () {
            return Promise.resolve(typeof res.data === 'string' ? res.data : JSON.stringify(res.data));
        },
        json: function () {
            if (typeof res.data === 'object')
                return Promise.resolve(res.data);
            var json = {};
            try {
                json = JSON.parse(res.data);
            }
            catch (err) {
                console.error(err);
            }
            return Promise.resolve(json);
        },
        arrayBuffer: function () {
            return Promise.resolve(res.data);
        },
        headers: {
            keys: function () { return Object.keys(header); },
            entries: function () {
                var all = [];
                for (var key in header) {
                    if (header.hasOwnProperty(key)) {
                        all.push([key, header[key]]);
                    }
                }
                return all;
            },
            get: function (n) { return header[n.toLowerCase()]; },
            has: function (n) { return n.toLowerCase() in header; }
        }
    };
}
exports.parseResponse = parseResponse;
function fetchFunc() {
    // tslint:disable-next-line:no-any
    return function (url, options) {
        options = options || {};
        var dataType = url.match(exports.TEXT_FILE_EXTS) ? 'text' : 'arraybuffer';
        return new Promise(function (resolve, reject) {
            wx.request({
                url: url,
                method: options.method || 'GET',
                data: options.body,
                header: options.headers,
                dataType: dataType,
                responseType: dataType,
                success: function (resp) { return resolve(parseResponse(url, resp)); },
                fail: function (err) { return reject(err); }
            });
        });
    };
}
exports.fetchFunc = fetchFunc;
function setWechatFetch(debug) {
    if (debug === void 0) { debug = false; }
    // tslint:disable-next-line:no-any
    var typedGlobal = global;
    if (typeof typedGlobal.fetch !== 'function') {
        if (debug) {
            console.log('setup global fetch...');
        }
        typedGlobal.fetch = fetchFunc();
    }
}
exports.setWechatFetch = setWechatFetch;
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1631012218353);
})()
//# sourceMappingURL=index.js.map