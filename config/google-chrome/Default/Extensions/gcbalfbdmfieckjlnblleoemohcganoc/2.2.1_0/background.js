/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 987);
/******/ })
/************************************************************************/
/******/ ({

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ext_storage__ = __webpack_require__(166);



/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__ext_storage__["a" /* default */]);

/***/ }),

/***/ 166:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__web_extension__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__web_extension___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__web_extension__);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var local = __WEBPACK_IMPORTED_MODULE_0__web_extension___default.a.storage.local;

/* harmony default export */ __webpack_exports__["a"] = ({
  get: function get(key) {
    return local.get(key).then(function (obj) {
      return obj[key];
    });
  },

  set: function set(key, value) {
    return local.set(_defineProperty({}, key, value)).then(function () {
      return true;
    });
  },

  remove: function remove(key) {
    return local.remove(key).then(function () {
      return true;
    });
  },

  clear: function clear() {
    return local.clear().then(function () {
      return true;
    });
  },

  addListener: function addListener(fn) {
    __WEBPACK_IMPORTED_MODULE_0__web_extension___default.a.storage.onChanged.addListener(function (changes, areaName) {
      var list = Object.keys(changes).map(function (key) {
        return _extends({}, changes[key], { key: key });
      });
      fn(list);
    });
  }
});

/***/ }),

/***/ 169:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var fs = function () {
  var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  if (!requestFileSystem) {
    throw new Error('requestFileSystem not supported');
  }

  var dumbSize = 1024 * 1024;
  var maxSize = 5 * 1024 * 1024;
  var getFS = function getFS(size) {
    size = size || maxSize;

    return new Promise(function (resolve, reject) {
      requestFileSystem(window.TEMPORARY, size, resolve, reject);
    });
  };

  var getDirectory = function getDirectory(dir, shouldCreate, fs) {
    var parts = (Array.isArray(dir) ? dir : dir.split('/')).filter(function (p) {
      return p && p.length;
    });
    var getDir = function getDir(parts, directoryEntry) {
      if (!parts || !parts.length) return Promise.resolve(directoryEntry);

      return new Promise(function (resolve, reject) {
        directoryEntry.getDirectory(parts[0], { create: !!shouldCreate }, function (dirEntry) {
          return resolve(dirEntry);
        }, function (e) {
          return reject(e);
        });
      }).then(function (entry) {
        return getDir(parts.slice(1), entry);
      });
    };

    var pFS = fs ? Promise.resolve(fs) : getFS(dumbSize);
    return pFS.then(function (fs) {
      return getDir(parts, fs.root);
    });
  };

  // @return a Promise of [FileSystemEntries]
  var list = function list() {
    var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

    return getFS(dumbSize).then(function (fs) {
      return new Promise(function (resolve, reject) {
        getDirectory(dir).then(function (dirEntry) {
          var result = [];
          var dirReader = dirEntry.createReader();
          var read = function read() {
            dirReader.readEntries(function (entries) {
              if (entries.length === 0) {
                resolve(result.sort());
              } else {
                result = result.concat(Array.from(entries));
                read();
              }
            }, reject);
          };

          read();
        }).catch(reject);
      });
    });
  };

  var fileLocator = function fileLocator(filePath, fs) {
    var parts = filePath.split('/');
    return getDirectory(parts.slice(0, -1), false, fs).then(function (directoryEntry) {
      return {
        directoryEntry: directoryEntry,
        fileName: parts.slice(-1)[0]
      };
    });
  };

  var readFile = function readFile(filePath, type) {
    if (['ArrayBuffer', 'BinaryString', 'DataURL', 'Text'].indexOf(type) === -1) {
      throw new Error('invalid readFile type, \'' + type + '\'');
    }

    return getFS().then(function (fs) {
      return fileLocator(filePath, fs).then(function (_ref) {
        var directoryEntry = _ref.directoryEntry,
            fileName = _ref.fileName;

        return new Promise(function (resolve, reject) {
          directoryEntry.getFile(fileName, {}, function (fileEntry) {
            fileEntry.file(function (file) {
              var reader = new FileReader();

              reader.onerror = reject;
              reader.onloadend = function () {
                resolve(this.result);
              };

              switch (type) {
                case 'ArrayBuffer':
                  return reader.readAsArrayBuffer(file);
                case 'BinaryString':
                  return reader.readAsBinaryString(file);
                case 'DataURL':
                  return reader.readAsDataURL(file);
                case 'Text':
                  return reader.readAsText(file);
                default:
                  throw new Error('unsupported data type, \'' + type);
              }
            }, reject);
          }, reject);
        });
      });
    });
  };

  var writeFile = function writeFile(filePath, blob, size) {
    return getFS(size).then(function (fs) {
      return fileLocator(filePath, fs).then(function (_ref2) {
        var directoryEntry = _ref2.directoryEntry,
            fileName = _ref2.fileName;

        return new Promise(function (resolve, reject) {
          directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
              fileWriter.onwriteend = function () {
                return resolve(fileEntry.toURL());
              };
              fileWriter.onerror = reject;

              fileWriter.write(blob);
            });
          }, reject);
        });
      });
    });
  };

  var removeFile = function removeFile(filePath) {
    return getFS().then(function (fs) {
      return fileLocator(filePath, fs).then(function (_ref3) {
        var directoryEntry = _ref3.directoryEntry,
            fileName = _ref3.fileName;

        return new Promise(function (resolve, reject) {
          directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.remove(resolve, reject);
          }, reject);
        });
      });
    });
  };

  var getMetadata = function getMetadata(filePath) {
    return getFS().then(function (fs) {
      if (filePath.getMetadata) {
        return new Promise(function (resolve, reject) {
          return filePath.getMetadata(resolve);
        });
      }

      return fileLocator(filePath, fs).then(function (_ref4) {
        var directoryEntry = _ref4.directoryEntry,
            fileName = _ref4.fileName;

        return new Promise(function (resolve, reject) {
          directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
            fileEntry.getMetadata(resolve);
          }, reject);
        });
      });
    });
  };

  var exists = function exists(filePath) {
    var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        type = _ref5.type;

    return getFS().then(function (fs) {
      return fileLocator(filePath, fs).then(function (_ref6) {
        var directoryEntry = _ref6.directoryEntry,
            fileName = _ref6.fileName;

        var isSomeEntry = function isSomeEntry(getMethodName) {
          return new Promise(function (resolve) {
            directoryEntry[getMethodName](fileName, { create: false }, function () {
              return resolve(true);
            }, function () {
              return resolve(false);
            });
          });
        };

        var pIsFile = isSomeEntry('getFile');
        var pIsDir = isSomeEntry('getDirectory');

        return Promise.all([pIsFile, pIsDir]).then(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              isFile = _ref8[0],
              isDir = _ref8[1];

          switch (type) {
            case 'file':
              return isFile;
            case 'directory':
              return isDir;
            default:
              return isFile || isDir;
          }
        });
      });
    });
  };

  return {
    list: list,
    readFile: readFile,
    writeFile: writeFile,
    removeFile: removeFile,
    getDirectory: getDirectory,
    getMetadata: getMetadata,
    exists: exists
  };
}();

// For test only
window.fs = fs;

/* harmony default export */ __webpack_exports__["a"] = (fs);

/***/ }),

/***/ 21:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return delay; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return until; });
/* unused harmony export range */
/* unused harmony export partial */
/* unused harmony export reduceRight */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return compose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return on; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return updateIn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return setIn; });
/* unused harmony export getIn */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return pick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return uid; });
/* unused harmony export flatten */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return splitIntoTwo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return formatDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return splitKeep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return nameFactory; });
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// delay the call of a function and return a promise
var delay = function delay(fn, timeout) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      try {
        resolve(fn());
      } catch (e) {
        reject(e);
      }
    }, timeout);
  });
};

// Poll on whatever you want to check, and will time out after a specific duration
// `check` should return `{ pass: Boolean, result: Any }`
// `name` is for a meaningful error message
var until = function until(name, check) {
  var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
  var expire = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10000;
  var errorMsg = arguments[4];

  var start = new Date();
  var go = function go() {
    if (expire && new Date() - start >= expire) {
      var msg = errorMsg || 'until: ' + name + ' expired!';
      throw new Error(msg);
    }

    var _check = check(),
        pass = _check.pass,
        result = _check.result;

    if (pass) return Promise.resolve(result);
    return delay(go, interval);
  };

  return new Promise(function (resolve, reject) {
    try {
      resolve(go());
    } catch (e) {
      reject(e);
    }
  });
};

var range = function range(start, end) {
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var ret = [];

  for (var i = start; i < end; i += step) {
    ret.push(i);
  }

  return ret;
};

// create a curry version of the passed in function
var partial = function partial(fn) {
  var len = fn.length;
  var _arbitary = void 0;

  _arbitary = function arbitary(curArgs, leftArgCnt) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length >= leftArgCnt) {
        return fn.apply(null, curArgs.concat(args));
      }

      return _arbitary(curArgs.concat(args), leftArgCnt - args.length);
    };
  };

  return _arbitary([], len);
};

var reduceRight = function reduceRight(fn, initial, list) {
  var ret = initial;

  for (var i = list.length - 1; i >= 0; i--) {
    ret = fn(list[i], ret);
  }

  return ret;
};

// compose functions into one
var compose = function compose() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return reduceRight(function (cur, prev) {
    return function (x) {
      return cur(prev(x));
    };
  }, function (x) {
    return x;
  }, args);
};

var map = partial(function (fn, list) {
  var result = [];

  for (var i = 0, len = list.length; i < len; i++) {
    result.push(fn(list[i]));
  }

  return result;
});

var on = partial(function (key, fn, dict) {
  if (Array.isArray(dict)) {
    return [].concat(_toConsumableArray(dict.slice(0, key)), [fn(dict[key])], _toConsumableArray(dict.slice(key + 1)));
  }

  return _extends({}, dict, _defineProperty({}, key, fn(dict[key])));
});

// immutably update any part in an object
var updateIn = partial(function (keys, fn, obj) {
  var updater = compose.apply(null, keys.map(function (key) {
    return on(key);
  }));
  return updater(fn)(obj);
});

// immutably set any part in an object
// a restricted version of updateIn
var setIn = partial(function (keys, value, obj) {
  var updater = compose.apply(null, keys.map(function (key) {
    return on(key);
  }));
  return updater(function () {
    return value;
  })(obj);
});

// return part of the object with a few keys deep inside
var getIn = partial(function (keys, obj) {
  return keys.reduce(function (prev, key) {
    if (!prev) return prev;
    return prev[key];
  }, obj);
});

// return the passed in object with only certains keys
var pick = function pick(keys, obj) {
  return keys.reduce(function (prev, key) {
    if (obj[key] !== undefined) {
      prev[key] = obj[key];
    }
    return prev;
  }, {});
};

var uid = function uid() {
  return '' + new Date() * 1 + '.' + Math.floor(Math.random() * 10000000).toString(16);
};

var flatten = function flatten(list) {
  return [].concat.apply([], list);
};

var splitIntoTwo = function splitIntoTwo(pattern, str) {
  var index = str.indexOf(pattern);
  if (index === -1) return [str];

  return [str.substr(0, index), str.substr(index + 1)];
};

var cn = function cn() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return args.reduce(function (prev, cur) {
    if (typeof cur === 'string') {
      prev.push(cur);
    } else {
      Object.keys(cur).forEach(function (key) {
        if (cur[key]) {
          prev.push(key);
        }
      });
    }

    return prev;
  }, []).join(' ');
};

var formatDate = function formatDate(d) {
  var pad = function pad(n) {
    return n >= 10 ? '' + n : '0' + n;
  };
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map(pad).join('-');
};

var splitKeep = function splitKeep(pattern, str) {
  var result = [];
  var startIndex = 0;
  var reg = void 0,
      match = void 0,
      lastMatchIndex = void 0;

  if (pattern instanceof RegExp) {
    reg = new RegExp(pattern, pattern.flags.indexOf('g') !== -1 ? pattern.flags : pattern.flags + 'g');
  } else if (typeof pattern === 'string') {
    reg = new RegExp(pattern, 'g');
  }

  // eslint-disable-next-line no-cond-assign
  while (match = reg.exec(str)) {
    if (lastMatchIndex === match.index) {
      break;
    }

    if (match.index > startIndex) {
      result.push(str.substring(startIndex, match.index));
    }

    result.push(match[0]);
    startIndex = match.index + match[0].length;
    lastMatchIndex = match.index;
  }

  if (startIndex < str.length) {
    result.push(str.substr(startIndex));
  }

  return result;
};

var nameFactory = function nameFactory() {
  var all = {};

  return function (str) {
    if (!all[str]) {
      all[str] = true;
      return str;
    }

    var n = 2;
    while (all[str + '-' + n]) {
      n++;
    }

    all[str + '-' + n] = true;
    return str + '-' + n;
  };
};

/***/ }),

/***/ 24:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export logFactory */
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var logFactory = function logFactory(enabled) {
  var isEnabled = !!enabled;

  var obj = ['log', 'info', 'warn', 'error'].reduce(function (prev, method) {
    prev[method] = function () {
      var _console;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (!isEnabled) return;
      (_console = console)[method].apply(_console, [new Date().toISOString(), ' - '].concat(args));
    };
    return prev;
  }, {});

  return _extends(obj.log, obj, {
    enable: function enable() {
      isEnabled = true;
    },
    disable: function disable() {
      isEnabled = false;
    }
  });
};

/* harmony default export */ __webpack_exports__["a"] = (logFactory("production" !== 'production'));

/***/ }),

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APP_STATUS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return INSPECTOR_STATUS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return RECORDER_STATUS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return PLAYER_STATUS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return PLAYER_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CONTENT_SCRIPT_STATUS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return TEST_CASE_STATUS; });

var mk = function mk(list) {
  return list.reduce(function (prev, key) {
    prev[key] = key;
    return prev;
  }, {});
};

var APP_STATUS = mk(['NORMAL', 'INSPECTOR', 'RECORDER', 'PLAYER']);

var INSPECTOR_STATUS = mk(['PENDING', 'INSPECTING', 'STOPPED']);

var RECORDER_STATUS = mk(['PENDING', 'RECORDING', 'STOPPED']);

var PLAYER_STATUS = mk(['PLAYING', 'PAUSED', 'STOPPED']);

var PLAYER_MODE = mk(['TEST_CASE', 'TEST_SUITE']);

var CONTENT_SCRIPT_STATUS = mk(['NORMAL', 'RECORDING', 'INSPECTING', 'PLAYING']);

var TEST_CASE_STATUS = mk(['NORMAL', 'SUCCESS', 'ERROR']);

/***/ }),

/***/ 32:
/***/ (function(module, exports, __webpack_require__) {

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* global chrome browser */

// Note: it's an adapter for both chrome and web extension API
// chrome and web extension API have almost the same API signatures
// except that chrome accepts callback while web extension returns promises
//
// The whole idea here is to make sure all callback style API of chrome
// also return promises
//
// Important: You need to specify whatever API you need to use in `UsedAPI` below

(function () {
  var adaptChrome = function adaptChrome(obj, chrome) {
    var adapt = function adapt(src, ret, obj, fn) {
      return Object.keys(obj).reduce(function (prev, key) {
        var keyParts = key.split('.');

        var _keyParts$reduce = keyParts.reduce(function (tuple, subkey) {
          var tar = tuple[0];
          var src = tuple[1];

          tar[subkey] = tar[subkey] || {};
          return [tar[subkey], src && src[subkey]];
        }, [prev, src]),
            _keyParts$reduce2 = _slicedToArray(_keyParts$reduce, 2),
            target = _keyParts$reduce2[0],
            source = _keyParts$reduce2[1];

        obj[key].forEach(function (method) {
          fn(method, source, target);
        });

        return prev;
      }, ret);
    };

    var promisify = function promisify(method, source, target) {
      if (!source) return;
      var reg = /The message port closed before a res?ponse was received/;

      target[method] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return new Promise(function (resolve, reject) {
          var callback = function callback(result) {
            // Note: The message port closed before a reponse was received.
            // Ignore this message
            if (chrome.runtime.lastError && !reg.test(chrome.runtime.lastError.message)) {
              return reject(chrome.runtime.lastError);
            }
            resolve(result);
          };

          source[method].apply(source, args.concat(callback));
        });
      };
    };

    var copy = function copy(method, source, target) {
      if (!source) return;
      target[method] = source[method];
    };

    return [[obj.toPromisify, promisify], [obj.toCopy, copy]].reduce(function (prev, tuple) {
      return adapt(chrome, prev, tuple[0], tuple[1]);
    }, {});
  };

  var UsedAPI = {
    toPromisify: {
      tabs: ['create', 'sendMessage', 'get', 'update', 'query', 'captureVisibleTab', 'remove'],
      windows: ['update', 'getLastFocused', 'getCurrent'],
      runtime: ['sendMessage', 'setUninstallURL'],
      cookies: ['get', 'getAll', 'set', 'remove'],
      notifications: ['create'],
      browserAction: ['getBadgeText'],
      'storage.local': ['get', 'set']
    },
    toCopy: {
      tabs: ['onActivated'],
      runtime: ['onMessage', 'onInstalled'],
      storage: ['onChanged'],
      browserAction: ['setBadgeText', 'setBadgeBackgroundColor', 'onClicked'],
      extension: ['getURL']
    }
  };

  var Ext = typeof chrome !== 'undefined' ? adaptChrome(UsedAPI, chrome) : browser;

  if (true) {
    module.exports = Ext;
  } else if (typeof window !== 'undefined') {
    window.Ext = Ext;
  }
})();

/***/ }),

/***/ 84:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export openBgWithCs */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return csInit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return bgInit; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ipc_promise__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ipc_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__ipc_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__web_extension__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__web_extension___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__web_extension__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__log__ = __webpack_require__(24);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };





var TIMEOUT = 1000 * 60;

// Note: `cuid` is a kind of unique id so that you can create multiple
// ipc promise instances between the same two end points
var openBgWithCs = function openBgWithCs(cuid) {
  var wrap = function wrap(str) {
    return str + '_' + cuid;
  };

  // factory function to generate ipc promise instance for background
  // `tabId` is needed to identify which tab to send messages to
  var ipcBg = function ipcBg(tabId) {
    var bgListeners = [];

    // `sender` contains tab info. Background may need this to store the corresponding
    // relationship between tabId and ipc instance
    var addSender = function addSender(obj, sender) {
      if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') return obj;

      obj.sender = sender;
      return obj;
    };

    __WEBPACK_IMPORTED_MODULE_1__web_extension___default.a.runtime.onMessage.addListener(function (req, sender, sendResponse) {
      bgListeners.forEach(function (listener) {
        return listener(req, sender, sendResponse);
      });
      return true;
    });

    return __WEBPACK_IMPORTED_MODULE_0__ipc_promise___default()({
      timeout: TIMEOUT,
      ask: function ask(uid, cmd, args) {
        __WEBPACK_IMPORTED_MODULE_1__web_extension___default.a.tabs.sendMessage(tabId, {
          type: wrap('BG_ASK_CS'),
          uid: uid,
          cmd: cmd,
          args: args
        });
      },
      onAnswer: function onAnswer(fn) {
        bgListeners.push(function (req, sender, response) {
          if (req.type !== wrap('CS_ANSWER_BG')) return;
          fn(req.uid, req.err, addSender(req.data, sender));
        });
      },
      onAsk: function onAsk(fn) {
        bgListeners.push(function (req, sender, response) {
          if (req.type !== wrap('CS_ASK_BG')) return;
          fn(req.uid, req.cmd, addSender(req.args, sender));
        });
      },
      answer: function answer(uid, err, data) {
        __WEBPACK_IMPORTED_MODULE_1__web_extension___default.a.tabs.sendMessage(tabId, {
          type: wrap('BG_ANSWER_CS'),
          uid: uid,
          err: err,
          data: data
        });
      },
      destroy: function destroy() {
        bgListeners = [];
      }
    });
  };

  // factory function to generate ipc promise for content scripts
  var ipcCs = function ipcCs() {
    var csListeners = [];

    __WEBPACK_IMPORTED_MODULE_1__web_extension___default.a.runtime.onMessage.addListener(function (req, sender, sendResponse) {
      csListeners.forEach(function (listener) {
        return listener(req, sender, sendResponse);
      });
      return true;
    });

    return __WEBPACK_IMPORTED_MODULE_0__ipc_promise___default()({
      timeout: TIMEOUT,
      ask: function ask(uid, cmd, args) {
        // log('cs ask', uid, cmd, args)
        __WEBPACK_IMPORTED_MODULE_1__web_extension___default.a.runtime.sendMessage({
          type: wrap('CS_ASK_BG'),
          uid: uid,
          cmd: cmd,
          args: args
        });
      },
      onAnswer: function onAnswer(fn) {
        csListeners.push(function (req, sender, response) {
          if (req.type !== wrap('BG_ANSWER_CS')) return;
          fn(req.uid, req.err, req.data);
        });
      },
      onAsk: function onAsk(fn) {
        csListeners.push(function (req, sender, response) {
          if (req.type !== wrap('BG_ASK_CS')) return;
          fn(req.uid, req.cmd, req.args);
        });
      },
      answer: function answer(uid, err, data) {
        __WEBPACK_IMPORTED_MODULE_1__web_extension___default.a.runtime.sendMessage({
          type: wrap('CS_ANSWER_BG'),
          uid: uid,
          err: err,
          data: data
        });
      },
      destroy: function destroy() {
        csListeners = [];
      }
    });
  };

  return {
    ipcCs: ipcCs,
    ipcBg: ipcBg
  };
};

// Helper function to init ipc promise instance for content scripts
// The idea here is to send CONNECT message to background when initializing
var csInit = function csInit() {
  var cuid = '' + Math.floor(Math.random() * 10000);

  Object(__WEBPACK_IMPORTED_MODULE_2__log__["a" /* default */])('sending Connect...');

  // Note: Ext.extension.getURL is available in content script, but not injected js
  // We use it here to detect whether it is loaded by content script or injected
  // Calling runtime.sendMessage in injected js will cause an uncatchable exception
  if (!__WEBPACK_IMPORTED_MODULE_1__web_extension___default.a.extension.getURL) return;

  // try this process in case we're in none-src frame
  try {
    __WEBPACK_IMPORTED_MODULE_1__web_extension___default.a.runtime.sendMessage({
      type: 'CONNECT',
      cuid: cuid
    });

    return openBgWithCs(cuid).ipcCs();
  } catch (e) {}
};

// Helper function to init ipc promise instance for background
// it accepts a `fn` function to handle CONNECT message from content scripts
var bgInit = function bgInit(fn) {
  __WEBPACK_IMPORTED_MODULE_1__web_extension___default.a.runtime.onMessage.addListener(function (req, sender) {
    if (req.type === 'CONNECT' && req.cuid) {
      fn(sender.tab.id, openBgWithCs(req.cuid).ipcBg(sender.tab.id));
    }
    return true;
  });
};

/***/ }),

/***/ 85:
/***/ (function(module, exports) {

var TO_BE_REMOVED = false;

var log = function log(msg) {
  if (console && console.log) console.log(msg);
};

var transformError = function transformError(err) {
  if (err instanceof Error) {
    return {
      isError: true,
      name: err.name,
      message: err.message,
      stack: err.stack
    };
  }

  return err;
};

// Note: The whole idea of ipc promise is about transforming the callback style
// ipc communication API to a Promise style
//
// eg. Orignial:    `chrome.runtime.sendMessage({}, () => {})`
//     ipcPromise:  `ipc.ask({}).then(() => {})`
//
// The benifit is
// 1. You can chain this promise with others
// 2. Create kind of connected channels between two ipc ends
//
// This is a generic interface to define a ipc promise utility
// All you need to declare is 4 functions
//
// e.g.
// ```
// ipcPromise({
//   ask: function (uid, cmd, args) { ... },
//   answer: function (uid, err, data) { ... },
//   onAsk: function (fn) { ... },
//   onAnswer: function (fn) { ... },
// })
// ```
function ipcPromise(options) {
  var ask = options.ask;
  var answer = options.answer;
  var timeout = options.timeout;
  var onAnswer = options.onAnswer;
  var onAsk = options.onAsk;
  var userDestroy = options.destroy;

  var askCache = {};
  var unhandledAsk = [];
  var markUnhandled = function markUnhandled(uid, cmd, args) {
    unhandledAsk.push({ uid: uid, cmd: cmd, args: args });
  };
  var handler = markUnhandled;

  // both for ask and unhandledAsk
  timeout = timeout || 5000;

  onAnswer(function (uid, err, data) {
    if (uid && askCache[uid] === TO_BE_REMOVED) {
      delete askCache[uid];
      return;
    }

    if (!uid || !askCache[uid]) {
      // log('ipcPromise: response uid invalid: ' + uid);
      return;
    }

    var resolve = askCache[uid][0];
    var reject = askCache[uid][1];

    delete askCache[uid];

    if (err) {
      reject(transformError(err));
    } else {
      resolve(data);
    }
  });

  onAsk(function (uid, cmd, args) {
    setTimeout(function () {
      var found = unhandledAsk && unhandledAsk.find(function (item) {
        return item.uid === uid;
      });

      if (!found) return;

      answer(uid, new Error('ipcPromise: answer timeout ' + timeout + ' for cmd "' + cmd + '", args "' + args + '"'));
    }, timeout);

    if (handler === markUnhandled) {
      markUnhandled(uid, cmd, args);
      return;
    }

    return new Promise(function (resolve, reject) {
      resolve(handler(cmd, args));
    }).then(function (data) {
      // note: handler doens't handle the cmd => return undefined, should wait for timeout
      if (data === undefined) return markUnhandled(uid, cmd, args);
      answer(uid, null, data);
    }, function (err) {
      answer(uid, transformError(err), null);
    });
  });

  var wrapAsk = function wrapAsk(cmd, args, timeoutToOverride) {
    var uid = 'ipcp_' + new Date() * 1 + '_' + Math.round(Math.random() * 1000);
    var finalTimeout = timeoutToOverride || timeout;

    // Note: make it possible to disable timeout
    if (finalTimeout > 0) {
      setTimeout(function () {
        var reject;

        if (askCache && askCache[uid]) {
          reject = askCache[uid][1];
          askCache[uid] = TO_BE_REMOVED;
          reject(new Error('ipcPromise: onAsk timeout ' + finalTimeout + ' for cmd "' + cmd + '", args "' + args + '"'));
        }
      }, finalTimeout);
    }

    ask(uid, cmd, args || []);

    return new Promise(function (resolve, reject) {
      askCache[uid] = [resolve, reject];
    });
  };

  var wrapOnAsk = function wrapOnAsk(fn) {
    handler = fn;

    var ps = unhandledAsk.map(function (task) {
      return new Promise(function (resolve, reject) {
        resolve(handler(task.cmd, task.args));
      }).then(function (data) {
        // note: handler doens't handle the cmd => return undefined, should wait for timeout
        if (data === undefined) return;
        answer(task.uid, null, data);
        return task.uid;
      }, function (err) {
        answer(task.uid, err, null);
        return task.uid;
      });
    });

    Promise.all(ps).then(function (uids) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = uids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var uid = _step.value;

          if (uid === undefined) continue;

          var index = unhandledAsk.findIndex(function (item) {
            return item.uid === uid;
          });

          unhandledAsk.splice(index, 1);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });
  };

  var destroy = function destroy() {
    userDestroy && userDestroy();

    ask = null;
    answer = null;
    onAnswer = null;
    onAsk = null;
    unhandledAsk = null;

    Object.keys(askCache).forEach(function (uid) {
      var tuple = askCache[uid];
      var reject = tuple[1];
      reject && reject(new Error('IPC Promise has been Destroyed.'));
      delete askCache[uid];
    });
  };

  return {
    ask: wrapAsk,
    send: wrapAsk,
    onAsk: wrapOnAsk,
    destroy: destroy
  };
}

ipcPromise.serialize = function (obj) {
  return {
    ask: function ask(cmd, args, timeout) {
      return obj.ask(cmd, JSON.stringify(args), timeout);
    },

    send: function send(cmd, args, timeout) {
      return obj.send(cmd, JSON.stringify(args), timeout);
    },

    onAsk: function onAsk(fn) {
      return obj.onAsk(function (cmd, args) {
        return fn(cmd, JSON.parse(args));
      });
    },

    destroy: obj.destroy
  };
};

module.exports = ipcPromise;

/***/ }),

/***/ 987:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_web_extension__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__common_web_extension__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_ipc_ipc_bg_cs__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_constant__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_log__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_capture_screenshot__ = __webpack_require__(988);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__common_storage__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__config__ = __webpack_require__(989);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };










var state = {
  status: __WEBPACK_IMPORTED_MODULE_3__common_constant__["a" /* APP_STATUS */].NORMAL,
  tabIds: {
    lastInspect: null,
    lastRecord: null,
    toInspect: null,
    firstRecord: null,
    toRecord: null,
    firstPlay: null,
    toPlay: null,
    panel: null
  },
  ipcCache: {},
  pullback: false
};

var createTab = function createTab(url) {
  return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.create({ url: url, active: true });
};

var activateTab = function activateTab(tabId, focusWindow) {
  return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.get(tabId).then(function (tab) {
    var p = focusWindow ? __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.windows.update(tab.windowId, { focused: true }) : Promise.resolve();

    return p.then(function () {
      return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.update(tab.id, { active: true });
    }).then(function () {
      return tab;
    });
  });
};

var getTab = function getTab(tabId) {
  return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.get(tabId);
};

// Generate function to get ipc based on tabIdName and some error message
var genGetTabIpc = function genGetTabIpc(tabIdName, purpose) {
  return function () {
    var tabId = state.tabIds[tabIdName];

    if (!tabId) {
      return Promise.reject(new Error('No tab for ' + purpose + ' yet'));
    }

    return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.get(tabId).then(function (tab) {
      if (!tab) {
        throw new Error('The ' + purpose + ' tab seems to be closed');
      }

      var ipc = state.ipcCache[tab.id];

      if (!ipc) {
        throw new Error('No ipc available for the ' + purpose + ' tab');
      }

      return ipc;
    });
  };
};

var getRecordTabIpc = genGetTabIpc('toRecord', 'recording');

var getPlayTabIpc = genGetTabIpc('toPlay', 'playing commands');

var getPanelTabIpc = genGetTabIpc('panel', 'dashboard');

// Get the current tab for play, if url provided, it will be loaded in the tab
var getPlayTab = function getPlayTab(url) {
  var theError = new Error('Either a played tab or a url must be provided to start playing');
  var createOne = function createOne(url) {
    if (!url) throw theError;

    return createTab(url).then(function (tab) {
      state.tabIds.toPlay = state.tabIds.firstPlay = tab.id;
      return tab;
    });
  };

  if (!state.tabIds.toPlay && !url) {
    throw theError;
  }

  if (!state.tabIds.toPlay) {
    return createOne(url);
  }

  return getTab(state.tabIds.toPlay).then(function (tab) {
    if (!url) {
      return tab;
    }

    // Note: must clear ipcCache manually here, so that further messages
    // won't be sent the old ipc
    state.ipcCache[tab.id] = null;
    return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.update(tab.id, { url: url });
  }, function () {
    return createOne(url);
  });
};

var showBadge = function showBadge(options) {
  var _clear$text$color$bli = _extends({
    clear: false,
    text: '',
    color: '#ff0000',
    blink: 0
  }, options || {}),
      clear = _clear$text$color$bli.clear,
      text = _clear$text$color$bli.text,
      color = _clear$text$color$bli.color,
      blink = _clear$text$color$bli.blink;

  if (clear) {
    return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.browserAction.setBadgeText({ text: '' });
  }

  __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.browserAction.setBadgeBackgroundColor({ color: color });
  __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.browserAction.setBadgeText({ text: text });

  if (blink) {
    setTimeout(function () {
      __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.browserAction.getBadgeText({}).then(function (curText) {
        if (curText !== text) return false;
        return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.browserAction.setBadgeText({ text: '' });
      });
    }, blink);
  }

  return true;
};

var toggleRecordingBadge = function toggleRecordingBadge(isRecording, options) {
  return showBadge(_extends({
    color: '#ff0000',
    text: 'R'
  }, options || {}, {
    clear: !isRecording
  }));
};

var toggleInspectingBadge = function toggleInspectingBadge(isInspecting, options) {
  return showBadge(_extends({
    color: '#ffa800',
    text: 'S'
  }, options || {}, {
    clear: !isInspecting
  }));
};

var togglePlayingBadge = function togglePlayingBadge(isPlaying, options) {
  return showBadge(_extends({
    color: '#14c756',
    text: 'P'
  }, options || {}, {
    clear: !isPlaying
  }));
};

var isUpgradeViewed = function isUpgradeViewed() {
  return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.storage.local.get('upgrade_not_viewed').then(function (obj) {
    return obj['upgrade_not_viewed'] !== 'not_viewed';
  });
};

var notifyRecordCommand = function notifyRecordCommand(command) {
  __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.notifications.create({
    type: 'basic',
    iconUrl: './logo.png',
    title: 'Record command!',
    message: function () {
      var list = [];

      list.push('command: ' + command.cmd);
      if (command.target) list.push('target: ' + command.target);
      if (command.value) list.push('value: ' + command.value);

      return list.join('\n');
    }()
  });
};

var bindEvents = function bindEvents() {
  __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.browserAction.onClicked.addListener(function () {
    isUpgradeViewed().then(function (isViewed) {
      if (isViewed) {
        return activateTab(state.tabIds.panel, true).catch(function () {
          __WEBPACK_IMPORTED_MODULE_6__common_storage__["a" /* default */].get('config').then(function (config) {
            config = config || {};
            return (config.size || {})[config.showSidebar ? 'with_sidebar' : 'standard'];
          }).then(function (size) {
            size = size || {
              width: 800,
              height: 775
            };

            window.open(__WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.extension.getURL('popup.html'), 'idePanel', 'width=' + size.width + ',height=' + size.height + ',toolbar=no,resizable=no,scrollbars=no');

            return true;
          });
        });
      } else {
        __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.browserAction.setBadgeText({ text: '' });
        __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.storage.local.set({
          upgrade_not_viewed: ''
        });
        return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.create({
          url: __WEBPACK_IMPORTED_MODULE_7__config__["a" /* default */].urlAfterUpgrade
        });
      }
    });
  });

  // Note: set the activated tab as the one to play
  __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.onActivated.addListener(function (activeInfo) {
    if (activeInfo.tabId === state.tabIds.panel) return;

    switch (state.status) {
      case __WEBPACK_IMPORTED_MODULE_3__common_constant__["a" /* APP_STATUS */].NORMAL:
        __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.get(activeInfo.tabId).then(function (tab) {
          if (tab.url.indexOf(__WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.extension.getURL('')) === -1) {
            state.tabIds.toPlay = state.tabIds.firstPlay = activeInfo.tabId;
          }
        });
        break;

      case __WEBPACK_IMPORTED_MODULE_3__common_constant__["a" /* APP_STATUS */].RECORDER:
        {
          // Note: three things to do when switch tab in recording
          // 1. set the new tab to RECORDING status,
          // 2. and the original one back to NORMAL status
          // 3. commit a `selectWindow` command
          //
          // Have to wait for the new tab establish connection with background
          Object(__WEBPACK_IMPORTED_MODULE_1__common_utils__["m" /* until */])('new tab creates ipc', function () {
            return {
              pass: state.ipcCache[activeInfo.tabId],
              result: state.ipcCache[activeInfo.tabId]
            };
          })
          // Note: wait for 1 second, expecting commands from original page to be committed
          .then(function (ipc) {
            return Object(__WEBPACK_IMPORTED_MODULE_1__common_utils__["c" /* delay */])(function () {
              return ipc;
            }, 1000);
          }).then(function (ipc) {
            return ipc.ask('SET_STATUS', {
              status: __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].RECORDING
            });
          }).then(function () {
            // Note: set the original tab to NORMAL status
            // only if the new tab is set to RECORDING status
            return getRecordTabIpc().then(function (ipc) {
              ipc.ask('SET_STATUS', {
                status: __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].NORMAL
              });
            });
          }).then(function () {
            // Note: get window locator & update recording tab
            var oldTabId = state.tabIds.firstRecord;
            var newTabId = activeInfo.tabId;

            return Promise.all([__WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.get(oldTabId), __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.get(newTabId)]).then(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  oldTab = _ref2[0],
                  newTab = _ref2[1];

              var result = [];

              // update recording tab
              state.tabIds.toRecord = activeInfo.tabId;

              if (oldTab.windowId === newTab.windowId) {
                result.push('tab=' + (newTab.index - oldTab.index));
              }

              result.push('title=' + newTab.title);

              return {
                target: result[0],
                targetOptions: result
              };
            });
          }).then(function (data) {
            // Note: commit the `selectWindow` command
            var command = _extends({
              cmd: 'selectWindow'
            }, data);

            return getPanelTabIpc().then(function (panelIpc) {
              return panelIpc.ask('RECORD_ADD_COMMAND', command);
            }).then(function () {
              return notifyRecordCommand(command);
            });
          }).catch(function (e) {
            __WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */].error(e.stack);
          });
          break;
        }
    }
  });
};

// usage:
// 1. set tabId for inspector:  `setInspectorTabId(someTabId)`
// 2. clear tabId for inspector: `setInspectorTabId(null, true)`
var setInspectorTabId = function setInspectorTabId(tabId, shouldRemove, noNotify) {
  state.tabIds.lastInspect = state.tabIds.toInspect;

  if (tabId) {
    state.tabIds.toInspect = tabId;
    return Promise.resolve(true);
  } else if (shouldRemove) {
    if (state.tabIds.toInspect) {
      state.tabIds.toInspect = null;

      if (noNotify) return Promise.resolve(true);

      return state.ipcCache[state.tabIds.toInspect].ask('STOP_INSPECTING').catch(function (e) {
        return Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])(e.stack);
      });
    }
    return Promise.resolve(true);
  }
};

// Processor for all message background could receive
// All messages from panel starts with 'PANEL_'
// All messages from content script starts with 'CS_'
var onRequest = function onRequest(cmd, args) {
  Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])('onAsk', cmd, args);

  switch (cmd) {
    // Mark the tab as panel.
    case 'I_AM_PANEL':
      state.tabIds.panel = args.sender.tab.id;

      // Note: when the panel first open first, it could be marked as the tab to play
      // That's something we don't want to happen
      if (state.tabIds.toPlay === args.sender.tab.id) {
        state.tabIds.toPlay = state.tabIds.firstPlay = null;
      }

      return true;

    case 'PANEL_START_RECORDING':
      Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])('Start to record...');
      state.status = __WEBPACK_IMPORTED_MODULE_3__common_constant__["a" /* APP_STATUS */].RECORDER;
      toggleRecordingBadge(true);
      return true;

    case 'PANEL_STOP_RECORDING':
      Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])('Stop recording...');
      state.status = __WEBPACK_IMPORTED_MODULE_3__common_constant__["a" /* APP_STATUS */].NORMAL;
      state.tabIds.lastRecord = state.tabIds.toRecord;
      state.tabIds.toRecord = null;
      state.tabIds.firstRecord = null;

      toggleRecordingBadge(false);
      return true;

    case 'PANEL_START_INSPECTING':
      Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])('start to inspect...');
      state.status = __WEBPACK_IMPORTED_MODULE_3__common_constant__["a" /* APP_STATUS */].INSPECTOR;
      toggleInspectingBadge(true);
      return true;

    case 'PANEL_STOP_INSPECTING':
      Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])('start to inspect...');
      state.status = __WEBPACK_IMPORTED_MODULE_3__common_constant__["a" /* APP_STATUS */].NORMAL;

      toggleInspectingBadge(false);
      return setInspectorTabId(null, true);

    case 'PANEL_START_PLAYING':
      {
        Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])('start to play...');
        state.status = __WEBPACK_IMPORTED_MODULE_3__common_constant__["a" /* APP_STATUS */].PLAYER;

        togglePlayingBadge(true);

        if (state.timer) clearInterval(state.timer);

        return getPlayTab()
        // Note: catch any error, and make it run 'getPlayTab(args.url)' instead
        .catch(function (e) {
          return { id: -1 };
        }).then(function (tab) {
          if (!state.ipcCache[tab.id]) {
            return getPlayTab(args.url).then(function (tab) {
              return { tab: tab, hasOpenedUrl: true };
            });
          } else {
            return { tab: tab, hasOpenedUrl: false };
          }
        }).then(function (_ref3) {
          var tab = _ref3.tab,
              hasOpenedUrl = _ref3.hasOpenedUrl;

          // Note: wait for tab to confirm it has loaded
          return Object(__WEBPACK_IMPORTED_MODULE_1__common_utils__["m" /* until */])('ipc of tab to play', function () {
            return {
              pass: !!state.ipcCache[tab.id],
              result: state.ipcCache[tab.id]
            };
          }, 1000, 6000 * 10).then(function (ipc) {
            var p = !hasOpenedUrl ? Promise.resolve() : ipc.ask('MARK_NO_COMMANDS_YET', {});
            return p.then(function () {
              return ipc.ask('SET_STATUS', { status: __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].PLAYING });
            });
          });
        }).catch(function (e) {
          togglePlayingBadge(false);
          throw e;
        });
      }

    case 'PANEL_RUN_COMMAND':
      {
        var runCommand = function runCommand(args, retryInfo) {
          return getPlayTabIpc().then(function (ipc) {
            var gotHeartBeat = false;

            var checkHeartBeat = function checkHeartBeat() {
              // Note: ignore any exception when checking heart beat
              // possible exception: no tab for play, no ipc
              return getPlayTabIpc().then(function (ipc) {
                return ipc.ask('HEART_BEAT', {});
              }).then(function () {
                gotHeartBeat = true;
              }, function () {
                return null;
              });
            };
            var startSendingTimeoutStatus = function startSendingTimeoutStatus(timeout) {
              var past = 0;

              state.timer = setInterval(function () {
                past += 1000;

                getPanelTabIpc().then(function (panelIpc) {
                  panelIpc.ask('TIMEOUT_STATUS', {
                    type: 'wait',
                    total: timeout,
                    past: past
                  });
                });
              }, 1000);

              return function () {
                return clearInterval(state.timer);
              };
            };
            // res format: { data, isIFrame }
            var wait = function wait(res) {
              var shouldWait = /wait/i.test(args.command.cmd) || args.command.cmd === 'open';
              var shouldResetIpc = !res.isIFrame && (/AndWait/i.test(args.command.cmd) || args.command.cmd === 'refresh');
              if (!shouldWait) return Promise.resolve(res.data);

              Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])('wait!!!!', res);
              var timeoutPageLoad = (res.data && res.data.extra && res.data.extra.timeoutPageLoad || 60) * 1000;

              // Note: for clickAndWait etc.,  must reset ipc to avoid
              // any further message (like heart beat) to be sent to the original ipc
              if (shouldResetIpc) ipc.destroy();

              // Note: put some delay here because there are cases when next command's
              // heart beat request is answered by previous page
              return Object(__WEBPACK_IMPORTED_MODULE_1__common_utils__["c" /* delay */])(function () {}, 2000)
              // A standlone `checkHeartBeat to make sure we don't have to wait until's 
              // first interval to pass the check
              .then(function () {
                return checkHeartBeat();
              }).then(function () {
                return Object(__WEBPACK_IMPORTED_MODULE_1__common_utils__["m" /* until */])('player tab heart beat check', function () {
                  checkHeartBeat();

                  return {
                    pass: gotHeartBeat,
                    result: true
                  };
                }, 100, 1000 * 10);
              })
              // Note: must get the new ipc here.
              // The previous ipc is useless after a new page load
              .then(function () {
                return getPlayTabIpc();
              }).then(function (ipc) {
                // Note: send timeout status to dashboard once we get the heart beat
                // and start to wait for dom ready
                var clear = startSendingTimeoutStatus(timeoutPageLoad);
                return ipc.ask('DOM_READY', {}, timeoutPageLoad).then(function () {
                  clear();
                  ipc.ask('HACK_ALERT', {});
                }, function () {
                  clear();
                  throw new Error('page load ' + timeoutPageLoad / 1000 + ' seconds time out');
                });
              }).then(function () {
                return res.data;
              });
            };

            // Note: clear timer whenever we execute a new command
            if (state.timer) clearInterval(state.timer);

            // Note: -1 will disable ipc timeout for 'pause' command
            var ipcTimeout = args.command.cmd === 'pause' ? -1 : null;

            return ipc.ask('DOM_READY', {}).then(function () {
              return ipc.ask('RUN_COMMAND', {
                command: _extends({}, args.command, {
                  extra: _extends({}, args.command.extra || {}, {
                    retryInfo: retryInfo
                  })
                })
              }, ipcTimeout);
            }).then(wait);
          });
        };

        var retry = function retry(fn, options) {
          return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            var _timeout$retryInterva = _extends({
              timeout: 5000,
              retryInterval: 1000,
              onFirstFail: function onFirstFail() {},
              onFinal: function onFinal() {},
              shouldRetry: function shouldRetry() {
                return false;
              }
            }, options),
                timeout = _timeout$retryInterva.timeout,
                onFirstFail = _timeout$retryInterva.onFirstFail,
                onFinal = _timeout$retryInterva.onFinal,
                shouldRetry = _timeout$retryInterva.shouldRetry,
                retryInterval = _timeout$retryInterva.retryInterval;

            var wrappedOnFinal = function wrappedOnFinal() {
              if (timerToClear) {
                clearTimeout(timerToClear);
              }

              return onFinal.apply(undefined, arguments);
            };

            var retryCount = 0;
            var lastError = null;
            var timerToClear = null;

            var onError = function onError(e) {
              if (!shouldRetry(e)) {
                wrappedOnFinal(e);
                throw e;
              }
              lastError = e;

              return new Promise(function (resolve, reject) {
                if (retryCount++ === 0) {
                  onFirstFail.apply(undefined, args);
                  timerToClear = setTimeout(function () {
                    wrappedOnFinal(lastError);
                    reject(lastError);
                  }, timeout);
                }

                Object(__WEBPACK_IMPORTED_MODULE_1__common_utils__["c" /* delay */])(run, retryInterval).then(resolve, onError);
              });
            };

            var run = function run() {
              return fn.apply(undefined, args.concat([{ retryCount: retryCount, retryInterval: retryInterval }])).catch(onError);
            };

            return run().then(function (result) {
              wrappedOnFinal(null, result);
              return result;
            });
          };
        };

        var timer = null;
        var timeout = args.command.extra.timeoutElement * 1000;

        var runCommandWithRetry = retry(runCommand, {
          timeout: timeout,
          shouldRetry: function shouldRetry(e) {
            return e.message && e.message.indexOf('time out when looking for') !== -1;
          },
          onFirstFail: function onFirstFail() {
            var past = 0;
            state.timer = setInterval(function () {
              past += 1000;

              getPanelTabIpc().then(function (ipc) {
                ipc.ask('TIMEOUT_STATUS', {
                  type: 'Tag waiting',
                  total: timeout,
                  past: past
                });

                if (past >= timeout) {
                  clearInterval(state.timer);
                }
              });
            }, 1000);
          },
          onFinal: function onFinal(err, data) {
            Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])('onFinal', err, data);
            if (state.timer) clearInterval(state.timer);
          }
        });

        return runCommandWithRetry(args).catch(function (e) {
          // Note: if variable !ERRORIGNORE is set to true,
          // it will just log errors instead of a stop of whole macro
          if (args.command.extra && args.command.extra.errorIgnore) {
            return {
              log: {
                error: e.message
              }
            };
          }

          throw e;
        });
      }

    case 'PANEL_STOP_PLAYING':
      {
        togglePlayingBadge(false);
        state.status = __WEBPACK_IMPORTED_MODULE_3__common_constant__["a" /* APP_STATUS */].NORMAL;

        // Note: reset firstPlay to current toPlay when stopped playing
        // userful for playing loop (reset firstPlay after each loop)
        state.tabIds.firstPlay = state.tabIds.toPlay;

        if (state.timer) clearInterval(state.timer);

        // Note: let cs know that it should exit playing mode
        var ipc = state.ipcCache[state.tabIds.toPlay];
        return ipc.ask('SET_STATUS', { status: __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].NORMAL });
      }

    // corresponding to the 'find' functionality on dashboard panel
    // It will find either the last play tab or record tab to look for the passed in locator
    case 'PANEL_HIGHLIGHT_DOM':
      {
        return Promise.all([getRecordTabIpc().then(function (ipc) {
          return { ipc: ipc, type: 'record' };
        }).catch(function () {
          return null;
        }), getPlayTabIpc().then(function (ipc) {
          return { ipc: ipc, type: 'play' };
        }).catch(function () {
          return null;
        })]).then(function (tuple) {
          if (!tuple[0] && !tuple[1]) {
            throw new Error('No where to look for the dom');
          }

          return tuple.filter(function (x) {
            return !!x;
          });
        }).then(function (list) {
          return Promise.all(list.map(function (_ref4) {
            var ipc = _ref4.ipc,
                type = _ref4.type;

            return ipc.ask('FIND_DOM', { locator: args.locator }).then(function (result) {
              return { result: result, type: type, ipc: ipc };
            });
          }));
        }).then(function (list) {
          var foundedList = list.filter(function (x) {
            return x.result;
          });

          if (foundedList.length === 0) {
            throw new Error('DOM not found');
          }

          var item = foundedList.length === 2 ? foundedList.find(function (item) {
            return item.type === args.lastOperation;
          }) : foundedList[0];

          var tabId = state.tabIds[item.type === 'record' ? 'lastRecord' : 'toPlay'];

          return activateTab(tabId, true).then(function () {
            return item.ipc.ask('HIGHLIGHT_DOM', { locator: args.locator });
          });
        });
      }

    case 'PANEL_RESIZE_WINDOW':
      {
        if (!state.tabIds.panel) {
          throw new Error('Panel not available');
        }

        return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.get(state.tabIds.panel).then(function (tab) {
          return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.windows.update(tab.windowId, Object(__WEBPACK_IMPORTED_MODULE_1__common_utils__["h" /* pick */])(['width', 'height'], _extends({}, args.size, {
            width: args.size.width,
            height: args.size.height
          })));
        });
      }

    case 'PANEL_UPDATE_BADGE':
      {
        var dict = {
          play: togglePlayingBadge,
          record: toggleRecordingBadge,
          inspect: toggleInspectingBadge
        };
        var fn = dict[args.type];

        if (!fn) {
          throw new Error('unknown type for updating badge, \'' + args.type + '\'');
        }

        return fn(!args.clear, args);
      }

    case 'CS_DONE_INSPECTING':
      Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])('done inspecting...');
      state.status = __WEBPACK_IMPORTED_MODULE_3__common_constant__["a" /* APP_STATUS */].NORMAL;

      toggleInspectingBadge(false);
      setInspectorTabId(null, true, true);
      activateTab(state.tabIds.panel, true);

      return getPanelTabIpc().then(function (panelIpc) {
        return panelIpc.ask('INSPECT_RESULT', {
          xpath: args.xpath
        });
      });

    // It's used for inspecting. The first tab which sends a CS_ACTIVATE_ME event
    // on mouse over event will be the one for us to inspect
    case 'CS_ACTIVATE_ME':
      Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])('CS_ACTIVATE_ME state.status', state.status);

      switch (state.status) {
        case __WEBPACK_IMPORTED_MODULE_3__common_constant__["a" /* APP_STATUS */].INSPECTOR:
          if (!state.tabIds.toInspect) {
            state.tabIds.toInspect = args.sender.tab.id;

            setTimeout(function () {
              var ipc = state.ipcCache[state.tabIds.toInspect];
              ipc.ask('SET_STATUS', {
                status: __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].INSPECTING
              });
            }, 0);

            return true;
          }
          break;
      }
      return false;

    case 'CS_RECORD_ADD_COMMAND':
      {
        var pullbackTimeout = 1000;
        var isFirst = false;

        if (state.status !== __WEBPACK_IMPORTED_MODULE_3__common_constant__["a" /* APP_STATUS */].RECORDER) {
          return false;
        }

        if (!state.tabIds.toRecord) {
          isFirst = true;
          state.tabIds.toRecord = state.tabIds.firstRecord = args.sender.tab.id;
        }

        if (state.tabIds.toRecord !== args.sender.tab.id) {
          return false;
        }

        // Note: if receive a pullback cmd, we need to set the flag,
        // and strip Wait from any xxxAndWait command
        if (args.cmd === 'pullback') {
          state.pullback = true;
          setTimeout(function () {
            state.pullback = false;
          }, pullbackTimeout * 2);
          return false;
        }

        setTimeout(function () {
          var ipc = state.ipcCache[state.tabIds.toRecord];
          ipc.ask('SET_STATUS', {
            status: __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].RECORDING
          });
        }, 0);

        return Object(__WEBPACK_IMPORTED_MODULE_1__common_utils__["c" /* delay */])(function () {}, pullbackTimeout).then(function () {
          return getPanelTabIpc();
        }).then(function (panelIpc) {
          if (isFirst) {
            panelIpc.ask('RECORD_ADD_COMMAND', {
              cmd: 'open',
              target: args.url
            });
          }

          // Note: remove AndWait from commands if we got a pullback
          if (state.pullback) {
            args.cmd = args.cmd.replace('AndWait', '');
            state.pullback = false;
          }

          return panelIpc.ask('RECORD_ADD_COMMAND', args);
        }).then(function () {
          return __WEBPACK_IMPORTED_MODULE_6__common_storage__["a" /* default */].get('config');
        }).then(function (config) {
          if (config.recordNotification) {
            notifyRecordCommand(args);
          }
        }).then(function () {
          return true;
        });
      }

    case 'CS_CLOSE_OTHER_TABS':
      {
        var tabId = args.sender.tab.id;

        return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.get(tabId).then(function (tab) {
          return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.query({ windowId: tab.windowId }).then(function (tabs) {
            return tabs.filter(function (t) {
              return t.id !== tabId;
            });
          }).then(function (tabs) {
            return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.remove(tabs.map(function (t) {
              return t.id;
            }));
          });
        }).then(function () {
          return true;
        });
      }

    case 'CS_SELECT_WINDOW':
      {
        var oldTablId = args.sender.tab.id;

        var _splitIntoTwo = Object(__WEBPACK_IMPORTED_MODULE_1__common_utils__["j" /* splitIntoTwo */])('=', args.target),
            _splitIntoTwo2 = _slicedToArray(_splitIntoTwo, 2),
            type = _splitIntoTwo2[0],
            locator = _splitIntoTwo2[1];

        if (!locator) {
          throw new Error('invalid window locator, \'' + args.target + '\'');
        }

        var pQueryObj = void 0;

        switch (type.toLowerCase()) {
          case 'title':
            pQueryObj = Promise.resolve({ title: locator });
            break;

          case 'tab':
            {
              var offset = parseInt(locator, 10);

              if (isNaN(offset)) {
                throw new Error('invalid tab offset, \'' + locator + '\'');
              }

              pQueryObj = __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.get(state.tabIds.firstPlay).then(function (tab) {
                return {
                  windowId: tab.windowId,
                  index: tab.index + offset
                };
              });

              break;
            }

          default:
            throw new Error('window locator type \'' + type + '\' not supported');
        }

        return pQueryObj.then(function (queryObj) {
          return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.query(queryObj);
        }).then(function (tabs) {
          if (tabs.length === 0) {
            throw new Error('failed to find the tab with locator \'' + args.target + '\'');
          }
          return tabs[0];
        }).then(function (tab) {
          Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])('selectWindow, got tab', tab);

          return Object(__WEBPACK_IMPORTED_MODULE_1__common_utils__["m" /* until */])('new tab creates ipc', function () {
            return {
              pass: state.ipcCache[tab.id],
              result: state.ipcCache[tab.id]
            };
          }).then(function (ipc) {
            Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])('selectWindow, got ipc', ipc);

            return ipc.ask('DOM_READY', {}).then(function () {
              ipc.ask('SET_STATUS', {
                status: __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].PLAYING
              });

              return true;
            });
          }).then(function () {
            // Note: set the original tab to NORMAL status
            // only if the new tab is set to PLAYING status
            Object(__WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */])('selectWindow, set orignial to normal');

            state.ipcCache[oldTablId].ask('SET_STATUS', {
              status: __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].NORMAL
            });
          }).then(function () {
            state.tabIds.toPlay = tab.id;
            return activateTab(tab.id);
          });
        }).catch(function (e) {
          __WEBPACK_IMPORTED_MODULE_4__common_log__["a" /* default */].error(e.stack);
          throw e;
        });
      }

    case 'CS_CAPTURE_SCREENSHOT':
      return activateTab(state.tabIds.toPlay).then(__WEBPACK_IMPORTED_MODULE_5__common_capture_screenshot__["a" /* default */]);

    case 'CS_TIMEOUT_STATUS':
      return getPanelTabIpc().then(function (ipc) {
        return ipc.ask('TIMEOUT_STATUS', args);
      });

    case 'CS_DELETE_ALL_COOKIES':
      {
        var url = args.url;


        return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.cookies.getAll({ url: url }).then(function (cookies) {
          var ps = cookies.map(function (c) {
            return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.cookies.remove({
              url: '' + url + c.path,
              name: c.name
            });
          });

          return Promise.all(ps);
        });
      }

    default:
      return 'unknown';
  }
};

var initIPC = function initIPC() {
  Object(__WEBPACK_IMPORTED_MODULE_2__common_ipc_ipc_bg_cs__["a" /* bgInit */])(function (tabId, ipc) {
    state.ipcCache[tabId] = ipc;
    ipc.onAsk(onRequest);
  });
};

var initOnInstalled = function initOnInstalled() {
  __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.runtime.setUninstallURL(__WEBPACK_IMPORTED_MODULE_7__config__["a" /* default */].urlAfterUninstall);

  __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.runtime.onInstalled.addListener(function (_ref5) {
    var reason = _ref5.reason;

    switch (reason) {
      case 'install':
        return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.create({
          url: __WEBPACK_IMPORTED_MODULE_7__config__["a" /* default */].urlAfterInstall
        });

      case 'update':
        __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.browserAction.setBadgeText({ text: 'NEW' });
        __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.browserAction.setBadgeBackgroundColor({ color: '#4444FF' });
        return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.storage.local.set({
          upgrade_not_viewed: 'not_viewed'
        });
    }
  });
};

var initPlayTab = function initPlayTab() {
  return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.windows.getCurrent().then(function (window) {
    return __WEBPACK_IMPORTED_MODULE_0__common_web_extension___default.a.tabs.query({ active: true, windowId: window.id }).then(function (tabs) {
      console.log('tabs', tabs);
      if (!tabs || !tabs.length) return false;
      state.tabIds.toPlay = tabs[0].id;
      return true;
    });
  });
};

bindEvents();
initIPC();
initOnInstalled();
initPlayTab();

/***/ }),

/***/ 988:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = saveScreen;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__web_extension__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__web_extension___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__web_extension__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__filesystem__ = __webpack_require__(169);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();




// refer to https://stackoverflow.com/questions/12168909/blob-from-dataurl
function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], { type: mimeString });
  return blob;
}

function getActiveTabInfo() {
  return __WEBPACK_IMPORTED_MODULE_0__web_extension___default.a.windows.getLastFocused().then(function (win) {
    return __WEBPACK_IMPORTED_MODULE_0__web_extension___default.a.tabs.query({ active: true, windowId: win.id }).then(function (tabs) {
      return tabs[0];
    });
  });
}

function captureScreenBlob() {
  return __WEBPACK_IMPORTED_MODULE_0__web_extension___default.a.tabs.captureVisibleTab(null, { format: 'png' }).then(dataURItoBlob);
}

function saveScreen() {
  return Promise.all([getActiveTabInfo(), captureScreenBlob()]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        tabInfo = _ref2[0],
        screenBlob = _ref2[1];

    var fileName = Date.now() + '_' + tabInfo.title.replace(/\s/g, '_') + '.png';

    return __WEBPACK_IMPORTED_MODULE_1__filesystem__["a" /* default */].writeFile(fileName, screenBlob).then(function (url) {
      return url;
    });
  });
}

/***/ }),

/***/ 989:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

/* harmony default export */ __webpack_exports__["a"] = ({
  urlAfterUpgrade: 'https://a9t9.com/kantu/web-automation/chrome/whatsnew',
  urlAfterInstall: 'https://a9t9.com/kantu/web-automation/chrome/welcome',
  urlAfterUninstall: 'https://a9t9.com/kantu/web-automation/chrome/why'
});

/***/ })

/******/ });