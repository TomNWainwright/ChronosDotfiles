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
/******/ 	return __webpack_require__(__webpack_require__.s = 980);
/******/ })
/************************************************************************/
/******/ ({

/***/ 100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__log__ = __webpack_require__(24);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



/*
 * Basic tool function
 */

var extend = function extend() {
  var args = Array.from(arguments);
  var len = args.length;

  if (len <= 0) return {};
  if (len === 1) return args[0];

  var head = args[0];
  var rest = args.slice(1);

  return rest.reduce(function (prev, cur) {
    for (var i = 0, keys = Object.keys(cur), len = keys.length; i < len; i++) {
      prev[keys[i]] = cur[keys[i]];
    }

    return prev;
  }, head);
};

var isArray = Array.isArray;

var id = function id(x) {
  return x;
};

var trim = function trim(str) {
  return str.replace(/^\s*|\s*$/g, '');
};

var flatten = function flatten(list) {
  return [].concat.apply([], list);
};

var sum = function sum() {
  var list = Array.from(arguments);
  return list.reduce(function (prev, cur) {
    return prev + cur;
  }, 0);
};

var last = function last(list) {
  return list[list.length - 1];
};

var or = function or(list) {
  return (list || []).reduce(function (prev, cur) {
    return prev || cur;
  }, false);
};

var and = function and(list) {
  return (list || []).reduce(function (prev, cur) {
    return prev && cur;
  }, true);
};

var zipWith = function zipWith(fn) {
  if (arguments.length < 3) return null;

  var list = Array.from(arguments).slice(1);
  var len = list.reduce(function (min, cur) {
    return cur.length < min ? cur.length : min;
  }, Infinity);
  var ret = [];

  for (var i = 0; i < len; i++) {
    ret.push(fn.apply(null, list.map(function (item) {
      return item[i];
    })));
  }

  return ret;
};

var intersect = function intersect() {
  var list = Array.from(arguments);
  var len = Math.max.apply(null, list.map(function (item) {
    return item.length;
  }));
  var result = [];

  for (var i = 0; i < len; i++) {
    var val = list[0][i];
    var no = list.filter(function (item) {
      return item[i] !== val;
    });

    if (no && no.length) break;

    result.push(val);
  }

  return result;
};

var deepEqual = function deepEqual(a, b) {
  if (isArray(a) && isArray(b)) {
    return a.length === b.length && and(zipWith(deepEqual, a, b));
  }

  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object') {
    // TODO
    return false;
  }

  return a === b;
};

/*
 * Dom helper function
 */

var pixel = function pixel(num) {
  if ((num + '').indexOf('px') !== -1) return num;
  return (num || 0) + 'px';
};

var getStyle = function getStyle(dom, styleName) {
  if (!dom) throw new Error('getStyle: dom not exist');
  return getComputedStyle(dom)[styleName];
};

var setStyle = function setStyle(dom, style) {
  if (!dom) throw new Error('setStyle: dom not exist');

  for (var i = 0, keys = Object.keys(style), len = keys.length; i < len; i++) {
    dom.style[keys[i]] = style[keys[i]];
  }

  return dom;
};

var cssSum = function cssSum(dom, list) {
  var isInline = getStyle(dom, 'display') === 'inline';

  return list.reduce(function (prev, cur) {
    var val = isInline && ['width', 'height'].indexOf(cur) !== -1 ? dom.getClientRects()[0][cur] : getStyle(dom, cur);

    return prev + parseInt(val || '0', 10);
  }, 0);
};

var offset = function offset(dom, noPx) {
  if (!dom) return { left: 0, top: 0 };

  var rect = dom.getBoundingClientRect();
  var fn = noPx ? id : pixel;

  return {
    left: fn(rect.left + window.scrollX),
    top: fn(rect.top + window.scrollY)
  };
};

var rect = function rect(dom, noPx) {
  var pos = offset(dom, noPx);
  var isInline = getStyle(dom, 'display') === 'inline';
  var w = isInline ? dom.getClientRects()[0]['width'] : getStyle(dom, 'width');
  var h = isInline ? dom.getClientRects()[0]['height'] : getStyle(dom, 'height');
  var fn = noPx ? id : pixel;

  return extend({ width: fn(w), height: fn(h) }, pos);
};

// Reference: http://ryanve.com/lab/dimensions/
var clientWidth = function clientWidth(document) {
  return document.documentElement.clientWidth;
};

var clientHeight = function clientHeight(document) {
  return document.documentElement.clientHeight;
};

var removeChildren = function removeChildren(dom, predicate) {
  var pred = predicate || function () {
    return true;
  };
  var children = dom.childNodes;

  for (var i = children.length - 1; i >= 0; i--) {
    if (pred(children[i])) {
      dom.removeChild(children[i]);
    }
  }
};

var inDom = function inDom($outer, $el) {
  if (!$el) return false;
  if ($outer === $el) return true;
  return inDom($outer, $el.parentNode);
};

var inDomList = function inDomList(list, $el) {
  return or(list.map(function ($outer) {
    return inDom($outer, $el);
  }));
};

var parentWithTag = function parentWithTag(tag, $el) {
  var lowerTag = tag.toLowerCase();
  var $dom = $el;

  while ($dom) {
    if ($dom.tagName.toLowerCase() === lowerTag) {
      return $dom;
    }

    $dom = $dom.parentNode;
  }

  return null;
};

var selector = function selector(dom) {
  if (dom.nodeType !== 1) return '';
  if (dom.tagName === 'BODY') return 'body';
  if (dom.id) return '#' + dom.id;

  var classes = dom.className.split(/\s+/g).filter(function (item) {
    return item && item.length;
  });

  var children = Array.from(dom.parentNode.childNodes).filter(function ($el) {
    return $el.nodeType === 1;
  });

  var sameTag = children.filter(function ($el) {
    return $el.tagName === dom.tagName;
  });

  var sameClass = children.filter(function ($el) {
    var cs = $el.className.split(/\s+/g);

    return and(classes.map(function (c) {
      return cs.indexOf(c) !== -1;
    }));
  });

  var extra = '';

  if (sameTag.length === 1) {
    extra = '';
  } else if (classes.length && sameClass.length === 1) {
    extra = '.' + classes.join('.');
  } else {
    extra = ':nth-child(' + (1 + children.findIndex(function (item) {
      return item === dom;
    })) + ')';
  }

  var me = dom.tagName.toLowerCase() + extra;

  // Note: browser will add an extra 'tbody' when tr directly in table, which will cause an wrong selector,
  // so the hack is to remove all tbody here
  var ret = selector(dom.parentNode) + ' > ' + me;
  return ret.replace(/\s*>\s*tbody\s*>?/g, ' ');
};

var xpath = function xpath(dom, cur, list) {
  var getTagIndex = function getTagIndex(dom) {
    return Array.from(dom.parentNode.childNodes).filter(function (item) {
      return item.nodeType === dom.nodeType && item.tagName === dom.tagName;
    }).reduce(function (prev, node, i) {
      if (prev !== null) return prev;
      return node === dom ? i + 1 : prev;
    }, null);
  };

  var name = function name(dom) {
    if (!dom) return null;
    if (dom.nodeType === 3) return '@text';

    var index = getTagIndex(dom);
    var count = Array.from(dom.parentNode.childNodes).filter(function (item) {
      return item.nodeType === dom.nodeType && item.tagName === dom.tagName;
    }).length;
    var tag = dom.tagName.toLowerCase();

    return count > 1 ? tag + '[' + index + ']' : tag;
  };

  var helper = function helper(dom, cur, list) {
    if (!dom) return null;

    if (!cur) {
      if (dom.nodeType === 3) {
        return helper(dom.parentNode);
      } else {
        return helper(dom, dom, []);
      }
    }

    if (!cur.parentNode) {
      return ['html'].concat(list);
    }

    if (cur.tagName === 'BODY') {
      return ['html', 'body'].concat(list);
    }

    if (cur.id) {
      return ['*[@id="' + cur.id + '"]'].concat(list);
    }

    return helper(dom, cur.parentNode, [name(cur)].concat(list));
  };

  var parts = helper(dom, cur, list);
  var prefix = parts[0] === 'html' ? '/' : '//';
  var ret = prefix + parts.join('/');

  return ret;
};

var atXPath = function atXPath(xpath, document) {
  var lower = function lower(str) {
    return str && str.toLowerCase();
  };
  var reg = /^([a-zA-Z0-9]+)(\[(\d+)\])?$/;

  return xpath.reduce(function (prev, cur) {
    if (!prev) return prev;
    if (!prev.childNodes || !prev.childNodes.length) return null;

    var match = cur.match(reg);
    var tag = match[1];
    var index = match[3] ? parseInt(match[3], 10) : 1;
    var list = Array.from(prev.childNodes).filter(function (item) {
      return item.nodeType === 1 && lower(item.tagName) === lower(tag);
    });

    return list[index - 1];
  }, document);
};

var domText = function domText($dom) {
  var it = $dom.innerText;
  var tc = $dom.textContent;
  var pos = tc.toUpperCase().indexOf(it.toUpperCase());

  return tc.substr(pos, it.length);
};

// Note: get the locator of a DOM
var getLocator = function getLocator($dom, withAllOptions) {
  var id = $dom.getAttribute('id');
  var name = $dom.getAttribute('name');
  var isLink = $dom.tagName.toLowerCase() === 'a';
  var text = domText($dom);
  var classes = Array.from($dom.classList);
  var candidates = [];

  if (id && id.length) {
    candidates.push('id=' + id);
  }

  if (name && name.length) {
    candidates.push('name=' + name);
  }

  if (isLink && text && text.length) {
    var links = [].slice.call(document.getElementsByTagName('a'));
    var matches = links.filter(function ($el) {
      return domText($el) === text;
    });
    var index = matches.findIndex(function ($el) {
      return $el === $dom;
    });

    if (index !== -1) {
      candidates.push(index === 0 ? 'link=' + text : 'link=' + text + '@POS=' + (index + 1));
    }
  }

  if (classes.length > 0) {
    var _selector = $dom.tagName.toLowerCase() + classes.map(function (c) {
      return '.' + c;
    }).join('');
    Object(__WEBPACK_IMPORTED_MODULE_0__log__["a" /* default */])('selector', _selector);
    var $doms = document.querySelectorAll(_selector);

    // Note: to use css selector, we need to make sure that selecor is unique
    if ($doms[0] === $dom) {
      candidates.push('css=' + _selector);
    }
  }

  candidates.push(xpath($dom));

  if (withAllOptions) {
    return {
      target: candidates[0],
      targetOptions: candidates
    };
  }

  return candidates[0];
};

var checkIframe = function checkIframe(iframeWin) {
  var key = new Date() * 1 + '' + Math.random();

  try {
    iframeWin[key] = 'asd';
    return iframeWin[key] === 'asd';
  } catch (e) {
    return false;
  }
};

// Note: get the locator for frame
var getFrameLocator = function getFrameLocator(frameWin, win) {
  if (checkIframe(frameWin)) {
    var frameDom = frameWin.frameElement;
    var locator = getLocator(frameDom);

    if (/^id=/.test(locator) || /^name=/.test(locator)) {
      return locator;
    }
  }

  for (var i = 0, len = win.frames.length; i < len; i++) {
    if (win.frames[i] === frameWin) {
      return 'index=' + i;
    }
  }

  throw new Error('Frame locator not found');
};

/*
 * Mask related
 */

var maskFactory = function maskFactory() {
  var cache = [];
  var prefix = '__mask__' + new Date() * 1 + Math.round(Math.random() * 1000) + '__';
  var uid = 1;
  var defaultStyle = {
    position: 'absolute',
    zIndex: '999',
    display: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'red',
    opacity: 0.3,
    pointerEvents: 'none'
  };

  var genMask = function genMask(style, dom) {
    var mask = document.createElement('div');

    if (dom) {
      style = extend({}, defaultStyle, style || {}, rect(dom));
    } else {
      style = extend({}, defaultStyle, style || {});
    }

    setStyle(mask, style);
    mask.id = prefix + uid++;
    cache.push(mask);

    return mask;
  };

  var clear = function clear() {
    for (var i = 0, len = cache.length; i < len; i++) {
      var mask = cache[i];

      if (mask && mask.parentNode) {
        mask.parentNode.removeChild(mask);
      }
    }
  };

  return {
    gen: genMask,
    clear: clear
  };
};

var showMaskOver = function showMaskOver(mask, el) {
  var pos = offset(el);
  var w = cssSum(el, ['width', 'paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth']);
  var h = cssSum(el, ['height', 'paddingTop', 'paddingBottom', 'borderTopWidth', ' borderBottomWidth']);

  setStyle(mask, extend(pos, {
    width: pixel(w),
    height: pixel(h),
    display: 'block'
  }));
};

/* harmony default export */ __webpack_exports__["a"] = ({
  setStyle: setStyle,
  selector: selector,
  xpath: xpath,
  atXPath: atXPath,
  domText: domText,
  getLocator: getLocator,
  getFrameLocator: getFrameLocator,
  maskFactory: maskFactory,
  showMaskOver: showMaskOver,
  inDom: inDom,
  parentWithTag: parentWithTag
});

/***/ }),

/***/ 200:
/***/ (function(module, exports) {


function removeFromArray(array, item) {
  var index = array.indexOf(item);

  if (index >= 0) {
    array.splice(index, 1);
  }
}

var DataTransfer = function DataTransfer() {
  this.dataByFormat = {};

  this.dropEffect = 'none';
  this.effectAllowed = 'all';
  this.files = [];
  this.types = [];
};

DataTransfer.prototype.clearData = function (dataFormat) {
  if (dataFormat) {
    delete this.dataByFormat[dataFormat];
    removeFromArray(this.types, dataFormat);
  } else {
    this.dataByFormat = {};
    this.types = [];
  }
};

DataTransfer.prototype.getData = function (dataFormat) {
  return this.dataByFormat[dataFormat];
};

DataTransfer.prototype.setData = function (dataFormat, data) {
  this.dataByFormat[dataFormat] = data;

  if (this.types.indexOf(dataFormat) < 0) {
    this.types.push(dataFormat);
  }

  return true;
};

DataTransfer.prototype.setDragImage = function () {
  // don't do anything (the stub just makes sure there is no error thrown if someone tries to call the method)
};

module.exports = window.DataTransfer || DataTransfer;

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

/***/ 459:
/***/ (function(module, exports, __webpack_require__) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var eventFactory = __webpack_require__(460),
    DataTransfer = __webpack_require__(200);

function _noop() {}

function parseParams(targetElement, eventProperties, configCallback) {
  if (typeof eventProperties === 'function') {
    configCallback = eventProperties;
    eventProperties = null;
  }

  if (!targetElement || (typeof targetElement === 'undefined' ? 'undefined' : _typeof(targetElement)) !== 'object') {
    throw new Error('Expected first parameter to be a targetElement. Instead got: ' + targetElement);
  }

  return {
    targetElement: targetElement,
    eventProperties: eventProperties || {},
    configCallback: configCallback || _noop
  };
}

function customizeEvent(event, configCallback, isPrimaryEvent) {
  if (configCallback) {
    // call configCallback only for the primary event if the callback takes less than two arguments
    if (configCallback.length < 2) {
      if (isPrimaryEvent) {
        configCallback(event);
      }
    }
    // call configCallback for each event if the callback takes two arguments
    else {
        configCallback(event, event.type);
      }
  }
}

function createAndDispatchEvents(targetElement, eventNames, primaryEventName, dataTransfer, eventProperties, configCallback) {
  eventNames.forEach(function (eventName) {
    var event = eventFactory.createEvent(eventName, eventProperties, dataTransfer);
    var isPrimaryEvent = eventName === primaryEventName;

    customizeEvent(event, configCallback, isPrimaryEvent);

    targetElement.dispatchEvent(event);
  });
}

var DragDropAction = function DragDropAction() {
  this.lastDragSource = null;
  this.lastDataTransfer = null;
  this.pendingActionsQueue = [];
};

DragDropAction.prototype._queue = function (fn) {
  this.pendingActionsQueue.push(fn);

  if (this.pendingActionsQueue.length === 1) {
    this._queueExecuteNext();
  }
};

DragDropAction.prototype._queueExecuteNext = function () {
  if (this.pendingActionsQueue.length === 0) {
    return;
  }

  var self = this;
  var firstPendingAction = this.pendingActionsQueue[0];

  var doneCallback = function doneCallback() {
    self.pendingActionsQueue.shift();
    self._queueExecuteNext();
  };

  if (firstPendingAction.length === 0) {
    firstPendingAction.call(this);
    doneCallback();
  } else {
    firstPendingAction.call(this, doneCallback);
  }
};

DragDropAction.prototype.dragStart = function (targetElement, eventProperties, configCallback) {
  var params = parseParams(targetElement, eventProperties, configCallback),
      events = ['mousedown', 'dragstart', 'drag'],
      dataTransfer = new DataTransfer();

  this._queue(function () {
    createAndDispatchEvents(params.targetElement, events, 'drag', dataTransfer, params.eventProperties, params.configCallback);

    this.lastDragSource = targetElement;
    this.lastDataTransfer = dataTransfer;
  });

  return this;
};

DragDropAction.prototype.dragEnter = function (overElement, eventProperties, configCallback) {
  var params = parseParams(overElement, eventProperties, configCallback),
      events = ['mousemove', 'mouseover', 'dragenter'];

  this._queue(function () {
    createAndDispatchEvents(params.targetElement, events, 'dragenter', this.lastDataTransfer, params.eventProperties, params.configCallback);
  });

  return this;
};

DragDropAction.prototype.dragOver = function (overElement, eventProperties, configCallback) {
  var params = parseParams(overElement, eventProperties, configCallback),
      events = ['mousemove', 'mouseover', 'dragover'];

  this._queue(function () {
    createAndDispatchEvents(params.targetElement, events, 'drag', this.lastDataTransfer, params.eventProperties, params.configCallback);
  });

  return this;
};

DragDropAction.prototype.dragLeave = function (overElement, eventProperties, configCallback) {
  var params = parseParams(overElement, eventProperties, configCallback),
      events = ['mousemove', 'mouseover', 'dragleave'];

  this._queue(function () {
    createAndDispatchEvents(params.targetElement, events, 'dragleave', this.lastDataTransfer, params.eventProperties, params.configCallback);
  });

  return this;
};

DragDropAction.prototype.drop = function (targetElement, eventProperties, configCallback) {
  var params = parseParams(targetElement, eventProperties, configCallback);
  var eventsOnDropTarget = ['mousemove', 'mouseup', 'drop'];
  var eventsOnDragSource = ['dragend'];

  this._queue(function () {
    createAndDispatchEvents(params.targetElement, eventsOnDropTarget, 'drop', this.lastDataTransfer, params.eventProperties, params.configCallback);

    if (this.lastDragSource) {
      // trigger dragend event on last drag source element
      createAndDispatchEvents(this.lastDragSource, eventsOnDragSource, 'drop', this.lastDataTransfer, params.eventProperties, params.configCallback);
    }
  });

  return this;
};

DragDropAction.prototype.then = function (callback) {
  this._queue(function () {
    callback.call(this);
  }); // make sure _queue() is given a callback with no arguments

  return this;
};

DragDropAction.prototype.delay = function (waitingTimeMs) {
  this._queue(function (done) {
    window.setTimeout(done, waitingTimeMs);
  });

  return this;
};

module.exports = DragDropAction;

/***/ }),

/***/ 460:
/***/ (function(module, exports, __webpack_require__) {


var DataTransfer = __webpack_require__(200);

var dataTransferEvents = ['drag', 'dragstart', 'dragenter', 'dragover', 'dragend', 'drop', 'dragleave'];

function mergeInto(destObj, srcObj) {
  for (var key in srcObj) {
    if (!srcObj.hasOwnProperty(key)) {
      continue;
    } // ignore inherited properties

    destObj[key] = srcObj[key];
  }

  return destObj;
}

function createModernEvent(eventName, eventType, eventProperties) {
  // if (eventType === 'DragEvent') { eventType = 'CustomEvent'; }     // Firefox fix (since FF does not allow us to override dataTransfer)

  var constructor = window[eventType];
  var options = { view: window, bubbles: true, cancelable: true };

  mergeInto(options, eventProperties);

  var event = new constructor(eventName, options);

  mergeInto(event, eventProperties);

  return event;
}

function createLegacyEvent(eventName, eventType, eventProperties) {
  var event;

  switch (eventType) {
    case 'MouseEvent':
      event = document.createEvent('MouseEvent');
      event.initEvent(eventName, true, true);
      break;

    default:
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, true, true, 0);
  }

  // copy eventProperties into event
  if (eventProperties) {
    mergeInto(event, eventProperties);
  }

  return event;
}

function _createEvent(eventName, eventType, eventProperties) {
  try {
    return createModernEvent(eventName, eventType, eventProperties);
  } catch (error) {
    return createLegacyEvent(eventName, eventType, eventProperties);
  }
}

var EventFactory = {
  createEvent: function createEvent(eventName, eventProperties, dataTransfer) {
    var eventType = 'CustomEvent';

    if (eventName.match(/^mouse/)) {
      eventType = 'MouseEvent';
    } else if (eventName.match(/^(drag|drop)/)) {
      eventType = 'DragEvent';
    }

    if (dataTransferEvents.indexOf(eventName) > -1) {
      eventProperties.dataTransfer = dataTransfer || new DataTransfer();
    }

    var event = _createEvent(eventName, eventType, eventProperties);

    return event;
  }
};

module.exports = EventFactory;

/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ipc_bg_cs__ = __webpack_require__(84);


var throwNotTop = function throwNotTop() {
  throw new Error('You are not a top window, not allowed to initialize/use csIpc');
};

// Note: csIpc is only available to top window
var ipc = window.top === window ? Object(__WEBPACK_IMPORTED_MODULE_0__ipc_bg_cs__["b" /* csInit */])() : {
  ask: throwNotTop,
  send: throwNotTop,
  onAsk: throwNotTop,
  destroy: throwNotTop

  // Note: one ipc singleton per content script
};/* harmony default export */ __webpack_exports__["a"] = (ipc);

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

/***/ 980:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_ipc_ipc_cs__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_ipc_cs_postmessage__ = __webpack_require__(981);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_inspector__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_constant__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_command_runner__ = __webpack_require__(982);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__common_log__ = __webpack_require__(24);
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }









var MASK_CLICK_FADE_TIMEOUT = 2000;
var oops =  true ? function () {} : function (e) {
  return log.error(e.stack);
};

var state = {
  status: __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].NORMAL,
  // Note: it decides whether we're running commands
  // in the current window or some iframe/frame
  playingFrame: window,
  // Note: current frame stack when recording, it helps
  // to generate `selectFrame` commands
  recordingFrameStack: []

  // Note: Whether it's top or inner window, a content script has the need
  // to send IPC message to background. But in our design, only the top window
  // has access to the real csIpc, while inner frames have to bubble up the messages
  // to the top window.
  // So inner windows are provided with a fake csIpc, which post messages to its parent
};var superCsIpc = window.top === window ? __WEBPACK_IMPORTED_MODULE_0__common_ipc_ipc_cs__["a" /* default */] : {
  ask: function ask(ipcAction, ipcData) {
    return Object(__WEBPACK_IMPORTED_MODULE_1__common_ipc_cs_postmessage__["b" /* postMessage */])(window.parent, window, {
      action: 'IPC_CALL',
      data: { ipcAction: ipcAction, ipcData: ipcData }
    });
  }
};

var calcSelectFrameCmds = function calcSelectFrameCmds(frameStack) {
  var xs = state.recordingFrameStack;
  var ys = frameStack;
  var len = Math.min(xs.length, ys.length);
  var tpl = { cmd: 'selectFrame', url: window.location.href };
  var ret = [];
  var i = 0;

  for (i = 0; i < len; i++) {
    if (xs[i] !== ys[i]) {
      break;
    }
  }

  if (i === 0) {
    // No need for relative=top, if state.recordingFrameStack is empty
    if (xs.length !== 0) {
      ret.push(_extends({}, tpl, { target: 'relative=top' }));
    }
  } else if (i < len) {
    for (var j = i; j < xs.length; j++) {
      ret.push(_extends({}, tpl, { target: 'relative=parent' }));
    }
  }

  for (var _j = i; _j < ys.length; _j++) {
    ret.push(_extends({}, tpl, { target: ys[_j] }));
  }

  return ret;
};

// Two masks to show on page
// 1. mask on click
// 2. mask on hover
var getMask = function () {
  var mask = void 0,
      factory = void 0;

  return function (remove) {
    if (remove && factory) return factory.clear();
    if (mask) return mask;

    factory = __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].maskFactory();

    var maskClick = factory.gen({ background: 'green' });
    var maskHover = factory.gen({ background: '#ffa800' });

    mask = { maskClick: maskClick, maskHover: maskHover };

    document.body.appendChild(maskClick);
    document.body.appendChild(maskHover);

    return mask;
  };
}();

var addWaitInCommand = function addWaitInCommand(cmdObj) {
  var cmd = cmdObj.cmd;


  switch (cmd) {
    case 'click':
      return _extends({}, cmdObj, { cmd: 'clickAndWait' });

    case 'select':
      return _extends({}, cmdObj, { cmd: 'selectAndWait' });

    default:
      return cmdObj;
  }
};

// report recorded commands to background.
// transform `leave` event to clickAndWait / selectAndWait event based on the last command
var reportCommand = function () {
  var LEAVE_INTERVAL = 500;
  var last = null;
  var lastTime = null;
  var timer = null;

  return function (obj) {
    obj = _extends({}, obj, { url: window.location.href });

    Object(__WEBPACK_IMPORTED_MODULE_6__common_log__["a" /* default */])('to report', obj);

    // Change back to top frame if it was recording inside
    if (state.recordingFrameStack.length > 0) {
      state.recordingFrameStack = [];

      superCsIpc.ask('CS_RECORD_ADD_COMMAND', {
        cmd: 'selectFrame',
        target: 'relative=top',
        url: window.location.href
      }).catch(oops);
    }

    switch (obj.cmd) {
      case 'leave':
        {
          if (timer) {
            clearTimeout(timer);
          }

          if (new Date() - lastTime < LEAVE_INTERVAL) {
            obj = addWaitInCommand(last);
          } else {
            return;
          }

          break;
        }
      case 'click':
      case 'select':
        {
          timer = setTimeout(function () {
            superCsIpc.ask('CS_RECORD_ADD_COMMAND', obj).catch(oops);
          }, LEAVE_INTERVAL);

          last = obj;
          lastTime = new Date();

          return;
        }

      default:
        break;
    }

    last = obj;
    lastTime = new Date();

    superCsIpc.ask('CS_RECORD_ADD_COMMAND', obj).catch(oops);
  };
}();

var isValidClick = function isValidClick(el) {
  // Note: all elements are allowed to be recorded when clicked
  return true;

  // if (el === document.body) return false
  //
  // const tag   = el.tagName.toLowerCase()
  // const type  = el.getAttribute('type')
  // const role  = el.getAttribute('role')
  //
  // if (tag === 'a' || tag === 'button')  return true
  // if (tag === 'input' && ['radio', 'checkbox'].indexOf(type) !== -1)  return true
  // if (['link', 'button', 'checkbox', 'radio'].indexOf(role) !== -1)   return true
  //
  // return isValidClick(el.parentNode)
};

var isValidSelect = function isValidSelect(el) {
  var tag = el.tagName.toLowerCase();

  if (['option', 'select'].indexOf(tag) !== -1) return true;
  return false;
};

var isValidType = function isValidType(el) {
  var tag = el.tagName.toLowerCase();
  var type = el.getAttribute('type');

  if (tag === 'textarea') return true;
  if (tag === 'input' && ['radio, checkbox'].indexOf(type) === -1) return true;

  return false;
};

var highlightDom = function highlightDom($dom, timeout) {
  var mask = getMask();

  __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].showMaskOver(mask.maskClick, $dom);

  setTimeout(function () {
    __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].setStyle(mask.maskClick, { display: 'none' });
  }, timeout || MASK_CLICK_FADE_TIMEOUT);
};

var onClick = function onClick(e) {
  if (!isValidClick(e.target)) return;

  reportCommand(_extends({
    cmd: 'click'
  }, __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].getLocator(e.target, true)));
};

var onChange = function onChange(e) {
  if (isValidSelect(e.target)) {
    var value = e.target.value;
    var $option = Array.from(e.target.children).find(function ($op) {
      return $op.value === value;
    });

    reportCommand(_extends({
      cmd: 'select',
      value: 'label=' + __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].domText($option)
    }, __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].getLocator(e.target, true)));
  } else if (isValidType(e.target)) {
    reportCommand(_extends({
      cmd: 'type',
      value: (e.target.value || '').replace(/\n/g, '\\n')
    }, __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].getLocator(e.target, true)));
  }
};

var onDragDrop = function () {
  var dragStart = null;

  return function (e) {
    switch (e.type) {
      case 'dragstart':
        {
          dragStart = __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].getLocator(e.target, true);
          break;
        }
      case 'drop':
        {
          if (!dragStart) return;
          var tmp = __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].getLocator(e.target, true);
          var drop = {
            value: tmp.target,
            valueOptions: tmp.targetOptions
          };

          reportCommand(_extends({
            cmd: 'dragAndDropToObject'
          }, dragStart, drop));

          dragStart = null;
        }
    }
  };
}();

var onLeave = function onLeave(e) {
  reportCommand({
    cmd: 'leave',
    target: null,
    value: null
  });

  setTimeout(function () {
    reportCommand({
      cmd: 'pullback',
      target: null,
      value: null
    });
  }, 800);
};

var bindEventsToRecord = function bindEventsToRecord() {
  document.addEventListener('click', onClick, true);
  document.addEventListener('change', onChange, true);
  document.addEventListener('dragstart', onDragDrop, true);
  document.addEventListener('drop', onDragDrop, true);
  window.addEventListener('beforeunload', onLeave, true);
};

var unbindEventsToRecord = function unbindEventsToRecord() {
  document.removeEventListener('click', onClick, true);
  document.removeEventListener('change', onChange, true);
  document.removeEventListener('dragstart', onDragDrop, true);
  document.removeEventListener('drop', onDragDrop, true);
  window.removeEventListener('beforeunload', onLeave, true);
};

var waitForDomReady = function waitForDomReady(accurate) {
  return Object(__WEBPACK_IMPORTED_MODULE_4__common_utils__["m" /* until */])('dom ready', function () {
    return {
      pass: ['complete', 'interactive'].slice(0, accurate ? 1 : 2).indexOf(document.readyState) !== -1,
      result: true
    };
  }, 1000, 6000 * 10);
};

var updateStatus = function updateStatus(args) {
  if (!args.status) {
    throw new Error('SET_STATUS: missing args.status');
  }
  if (!__WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */][args.status]) {
    throw new Error('SET_STATUS: invalid args.status - ' + args.status);
  }

  _extends(state, {
    status: args.status
  });

  if (args.status === __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].NORMAL || args.status === __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].RECORDING) {
    bindEventsToRecord();
  } else {
    unbindEventsToRecord();
  }

  // replace alert/confirm/prompt with our version when playing
  if (args.status === __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].PLAYING) {
    hackAlertConfirmPrompt();
  } else {
    restoreAlertConfirmPrompt();
  }

  // IMPORTANT: broadcast status change to all frames inside
  var frames = window.frames;

  for (var i = 0, len = frames.length; i < len; i++) {
    Object(__WEBPACK_IMPORTED_MODULE_1__common_ipc_cs_postmessage__["b" /* postMessage */])(frames[i], window, {
      action: 'SET_STATUS',
      data: args
    });
  }
};

var bindIPCListener = function bindIPCListener() {
  // Note: need to check csIpc in case it's a none-src iframe into which we
  // inject content_script.js. It has no access to chrome api, thus no csIpc available
  if (!__WEBPACK_IMPORTED_MODULE_0__common_ipc_ipc_cs__["a" /* default */]) return;

  // Note: csIpc instead of superIpc, because only top window is able
  // to listen to ipc events from bg
  __WEBPACK_IMPORTED_MODULE_0__common_ipc_ipc_cs__["a" /* default */].onAsk(function (cmd, args) {
    Object(__WEBPACK_IMPORTED_MODULE_6__common_log__["a" /* default */])(cmd, args);

    switch (cmd) {
      case 'HEART_BEAT':
        return true;

      case 'SET_STATUS':
        {
          updateStatus(args);
          return true;
        }

      case 'DOM_READY':
        return waitForDomReady(true);

      case 'RUN_COMMAND':
        return runCommand(args.command).catch(function (e) {
          // Mark that there is already at least one command run
          window.noCommandsYet = false;

          __WEBPACK_IMPORTED_MODULE_6__common_log__["a" /* default */].error(e.stack);
          throw e;
        }).then(function (data) {
          // Mark that there is already at least one command run
          window.noCommandsYet = false;

          if (state.playingFrame !== window) {
            return { data: data, isIFrame: true };
          }

          return { data: data };
        });

      case 'FIND_DOM':
        {
          try {
            var $el = Object(__WEBPACK_IMPORTED_MODULE_5__common_command_runner__["a" /* getElementByLocator */])(args.locator);
            return true;
          } catch (e) {
            return false;
          }
        }

      case 'HIGHLIGHT_DOM':
        {
          var _$el = Object(__WEBPACK_IMPORTED_MODULE_5__common_command_runner__["a" /* getElementByLocator */])(args.locator);
          highlightDom(_$el);
          return true;
        }

      case 'HACK_ALERT':
        {
          hackAlertConfirmPrompt();
          return true;
        }

      case 'MARK_NO_COMMANDS_YET':
        {
          window.noCommandsYet = true;
          return true;
        }

      default:
        throw new Error('cmd not supported: ' + cmd);
    }
  });
};

var bindEventsToInspect = function bindEventsToInspect() {
  // Bind click events for inspecting
  document.addEventListener('click', function (e) {
    switch (state.status) {
      case __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].INSPECTING:
        {
          e.preventDefault();

          var mask = getMask();

          __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].setStyle(mask.maskHover, { display: 'none' });
          __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].showMaskOver(mask.maskClick, e.target);

          setTimeout(function () {
            __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].setStyle(mask.maskClick, { display: 'none' });
          }, MASK_CLICK_FADE_TIMEOUT);

          _extends(state, {
            status: __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].NORMAL
          });

          return superCsIpc.ask('CS_DONE_INSPECTING', {
            xpath: __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].getLocator(e.target)
          }).catch(oops);
        }

      default:
        break;
    }
  });

  // bind mouse over event for applying for a inspector role
  document.addEventListener('mouseover', function (e) {
    if (state.status === __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].NORMAL) {
      return superCsIpc.ask('CS_ACTIVATE_ME', {}).catch(oops);
    }
  });

  // bind mouse move event to show hover mask in inspecting
  document.addEventListener('mousemove', function (e) {
    if (state.status !== __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].INSPECTING) return;

    var mask = getMask();
    __WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].showMaskOver(mask.maskHover, e.target);
  });
};

var bindOnMessage = function bindOnMessage() {
  Object(__WEBPACK_IMPORTED_MODULE_1__common_ipc_cs_postmessage__["a" /* onMessage */])(window, function (_ref, _ref2) {
    var action = _ref.action,
        data = _ref.data;
    var source = _ref2.source;

    switch (action) {
      case 'SET_STATUS':
        updateStatus(data);
        return true;

      // inner frames may receive this message when there are
      // some previous `selectFrame` command
      case 'RUN_COMMAND':
        // runCommand will decide whether to run in this window or pass on
        return runCommand(data);

      // inner frames send IPC_CALL to background,
      // It will go step by step up to the topmost frame, which has
      // the access to csIpc
      case 'IPC_CALL':
        // When recording, need to calculate `selectFrame` by ourselves
        // * for inner frames, add current frame locator to frame stack
        // * for top frame, send `selectFrame` commands before the original command 
        //   and keep track of the latest frame stack
        if (data.ipcAction === 'CS_RECORD_ADD_COMMAND') {
          // Note: Do not send any RECORD_ADD_COMMAND in playing mode
          if (state.status === __WEBPACK_IMPORTED_MODULE_3__common_constant__["b" /* CONTENT_SCRIPT_STATUS */].PLAYING) {
            return false;
          }

          data = Object(__WEBPACK_IMPORTED_MODULE_4__common_utils__["n" /* updateIn */])(['ipcData', 'frameStack'], function () {
            var stack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            return [__WEBPACK_IMPORTED_MODULE_2__common_inspector__["a" /* default */].getFrameLocator(source, window)].concat(_toConsumableArray(stack));
          }, data);

          if (window.top === window) {
            calcSelectFrameCmds(data.ipcData.frameStack).forEach(function (cmd) {
              __WEBPACK_IMPORTED_MODULE_0__common_ipc_ipc_cs__["a" /* default */].ask('CS_RECORD_ADD_COMMAND', cmd).catch(oops);
            });

            state.recordingFrameStack = data.ipcData.frameStack;
          }
        }

        if (window.top === window) {
          return __WEBPACK_IMPORTED_MODULE_0__common_ipc_ipc_cs__["a" /* default */].ask(data.ipcAction, data.ipcData).catch(oops);
        } else {
          return Object(__WEBPACK_IMPORTED_MODULE_1__common_ipc_cs_postmessage__["b" /* postMessage */])(window.parent, window, { action: action, data: data });
        }

      case 'RESET_PLAYING_FRAME':
        state.playingFrame = window;

        // pass on RESET_PLAYING_FRAME to parent, all the way till top window
        if (data === 'TOP' && window.top !== window) {
          Object(__WEBPACK_IMPORTED_MODULE_1__common_ipc_cs_postmessage__["b" /* postMessage */])(window.parent, window, {
            action: 'RESET_PLAYING_FRAME',
            data: 'TOP'
          });
        }

        return true;
    }
  });
};

var hackAlertConfirmPrompt = function hackAlertConfirmPrompt() {
  var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

  var script = '\n    if (!window.oldAlert)     window.oldAlert   = window.alert\n    if (!window.oldConfirm)   window.oldConfirm = window.confirm\n    if (!window.oldPrompt)    window.oldPrompt  = window.prompt\n\n    window.alert = function (str) {\n      document.body.setAttribute(\'data-alert\', str)\n    }\n\n    window.confirm = function (str) {\n      document.body.setAttribute(\'data-confirm\', str)\n      return true\n    }\n\n    window.prompt = function (str) {\n      var answer = document.body.getAttribute(\'data-prompt-answer\')\n      document.body.setAttribute(\'data-prompt\', str)\n      document.body.setAttribute(\'data-prompt-answer\', \'\')\n      return answer\n    }\n  ';
  var s = doc.constructor.prototype.createElement.call(doc, 'script');

  s.setAttribute('type', 'text/javascript');
  s.text = script;

  doc.documentElement.appendChild(s);
  s.parentNode.removeChild(s);
};

var restoreAlertConfirmPrompt = function restoreAlertConfirmPrompt() {
  var script = '\n    if (window.oldAlert)    window.alert = window.oldAlert\n    if (window.oldConfirm)  window.confirm = window.oldConfirm\n    if (window.oldPrompt)   window.prompt = window.oldPrompt\n  ';
  var s = document.constructor.prototype.createElement.call(document, 'script');

  s.setAttribute('type', 'text/javascript');
  s.text = script;

  document.documentElement.appendChild(s);
  s.parentNode.removeChild(s);
};

var init = function init() {
  // ** comment these two lines out for test **
  bindEventsToRecord();
  bindEventsToInspect();
  bindOnMessage();

  // Note: only bind ipc events if it's the top window
  if (window.top === window) {
    bindIPCListener();
  }
};

var runCommand = function runCommand(command) {
  if (!command.cmd) {
    throw new Error('runCommand: must provide cmd');
  }

  // if it's an 'open' command, it must be executed in the top window
  if (state.playingFrame === window || command.cmd === 'open') {
    // Note: both top and inner frames could run commands here
    // So must use superCsIpc instead of csIpc
    var ret = Object(__WEBPACK_IMPORTED_MODULE_5__common_command_runner__["b" /* run */])(command, superCsIpc, { highlightDom: highlightDom, hackAlertConfirmPrompt: hackAlertConfirmPrompt });

    // Note: `run` returns the contentWindow of the selected frame
    if (command.cmd === 'selectFrame') {
      return ret.then(function (_ref3) {
        var frame = _ref3.frame;

        // let outside window know that playingFrame has been changed, if it's parent or top
        if (frame !== window && (frame === window.top || frame === window.parent)) {
          Object(__WEBPACK_IMPORTED_MODULE_1__common_ipc_cs_postmessage__["b" /* postMessage */])(window.parent, window, {
            action: 'RESET_PLAYING_FRAME',
            data: frame === window.top ? 'TOP' : 'PARENT'
          });

          // set playingFrame to own window, get ready for later commands if any
          state.playingFrame = window;
        } else {
          state.playingFrame = frame;
        }

        return Promise.resolve({
          pageUrl: window.location.href,
          extra: command.extra
        });
      });
    }

    // Extra info passed on to background, it contains timeout info
    var wrapResult = function wrapResult(ret) {
      return _extends({}, (typeof ret === 'undefined' ? 'undefined' : _typeof(ret)) === 'object' ? ret : {}, {
        pageUrl: window.location.href,
        extra: command.extra
      });
    };

    return Promise.resolve(ret).then(wrapResult);
  } else {
    // log('passing command to frame...', state.playingFrame, '...', window.location.href)
    // Note: pass on the command if our window is not the current playing one
    return Object(__WEBPACK_IMPORTED_MODULE_1__common_ipc_cs_postmessage__["b" /* postMessage */])(state.playingFrame, window, {
      action: 'RUN_COMMAND',
      data: command
    });
  }
};

init();

/***/ }),

/***/ 981:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return postMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return onMessage; });
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var TYPE = 'SELENIUM_IDE_CS_MSG';

var postMessage = function postMessage(targetWin, myWin, payload) {
  var target = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '*';
  var timeout = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 60000;

  return new Promise(function (resolve, reject) {
    if (!targetWin || !targetWin.postMessage) {
      throw new Error('csPostMessage: targetWin is not a window', targetWin);
    }

    if (!myWin || !myWin.addEventListener || !myWin.removeEventListener) {
      throw new Error('csPostMessage: myWin is not a window', myWin);
    }

    var secret = Math.random();
    var type = TYPE;

    // Note: create a listener with a corresponding secret every time
    var onMsg = function onMsg(e) {
      if (e.data && e.data.type === TYPE && e.data.secret === secret) {
        myWin.removeEventListener('message', onMsg);
        var _e$data = e.data,
            _payload = _e$data.payload,
            error = _e$data.error;


        if (error) return reject(new Error(error));
        if (_payload !== undefined) return resolve(_payload);

        reject(new Error('csPostMessage: No payload nor error found'));
      }
    };

    myWin.addEventListener('message', onMsg);

    // Note:
    // * `type` to make sure we check our own msg only
    // * `secret` is for 1 to 1 relationship between a msg and a listener
    // * `payload` is the real data you want to send
    // * `isRequest` is to mark that it's not an answer to some previous request
    targetWin.postMessage({
      type: type,
      secret: secret,
      payload: payload,
      isRequest: true
    }, target);

    setTimeout(function () {
      reject(new Error('csPostMessage: timeout ' + timeout + ' ms'));
    }, timeout);
  });
};

var onMessage = function onMessage(win, fn) {
  if (!win || !win.addEventListener || !win.removeEventListener) {
    throw new Error('csOnMessage: not a window', win);
  }

  var onMsg = function onMsg(e) {
    // Note: only respond to msg with `isRequest` as true
    if (e && e.data && e.data.type === TYPE && e.data.isRequest && e.data.secret) {
      var tpl = {
        type: TYPE,
        secret: e.data.secret

        // Note: wrapped with a new Promise to catch any exception during the execution of fn
      };new Promise(function (resolve, reject) {
        var ret = void 0;

        try {
          ret = fn(e.data.payload, {
            source: e.source
          });
        } catch (err) {
          reject(err);
        }

        resolve(ret);
      }).then(function (res) {
        e.source.postMessage(_extends({}, tpl, {
          payload: res
        }), '*');
      }, function (err) {
        e.source.postMessage(_extends({}, tpl, {
          error: err.message
        }), '*');
      });
    }
  };

  win.addEventListener('message', onMsg);
  return function () {
    return win.removeEventListener('message', onMsg);
  };
};

/***/ }),

/***/ 982:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getElementByLocator; });
/* unused harmony export getFrameByLocator */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return run; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__web_extension__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__web_extension___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__web_extension__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__log__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__drag_mock__ = __webpack_require__(983);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__drag_mock___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__drag_mock__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__send_keys__ = __webpack_require__(984);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__inspector__ = __webpack_require__(100);
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








var domText = __WEBPACK_IMPORTED_MODULE_5__inspector__["a" /* default */].domText;

var HIGHLIGHT_TIMEOUT = 500;

var getElementByXPath = function getElementByXPath(xpath) {
  var snapshot = document.evaluate(xpath, document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  return snapshot.snapshotItem(0);
};

// reference: https://github.com/timoxley/offset
var viewportOffset = function viewportOffset(el) {
  var box = el.getBoundingClientRect();

  // Note: simply use bouddingClientRect since elementFromPoint uses
  // the same top/left relative to the current viewport/window instead of whole document
  return {
    top: box.top,
    left: box.left
  };
};

// Note: parse the locator and return the element found accordingly
var getElementByLocator = function getElementByLocator(str) {
  var i = str.indexOf('=');
  var el = void 0;

  if (/^\//.test(str)) {
    el = getElementByXPath(str);
  } else if (i === -1) {
    throw new Error('getElementByLocator: invalid locator, ' + str);
  } else {
    var method = str.substr(0, i);
    var value = str.substr(i + 1);

    switch (method && method.toLowerCase()) {
      case 'id':
        el = document.getElementById(value);
        break;

      case 'name':
        el = document.getElementsByName(value)[0];
        break;

      case 'identifier':
        el = document.getElementById(value) || document.getElementsByName(value)[0];
        break;

      case 'link':
        {
          var links = [].slice.call(document.getElementsByTagName('a'));
          // Note: there are cases such as 'link=exact:xxx'
          var realVal = value.replace(/^exact:/, '');
          // Note: position support. eg. link=Download@POS=3
          var match = realVal.match(/^(.+)@POS=(\d+)$/i);
          var index = 0;

          if (match) {
            realVal = match[1];
            index = parseInt(match[2]) - 1;
          }

          // Note: use textContent instead of innerText to avoid influence from text-transform
          var candidates = links.filter(function (a) {
            return domText(a) === realVal;
          });
          el = candidates[index];
          break;
        }

      case 'css':
        el = document.querySelector(value);
        break;

      case 'xpath':
        el = getElementByXPath(value);
        break;

      default:
        throw new Error('getElementByLocator: unsupported locator method, ' + method);
    }
  }

  if (!el) {
    throw new Error('getElementByLocator: fail to find element based on the locator, ' + str);
  }

  return el;
};

var getFrameByLocator = function getFrameByLocator(str, helpers) {
  var i = str.indexOf('=');

  // Note: try to parse format of 'index=0' and 'relative=top/parent'
  if (i !== -1) {
    var method = str.substr(0, i);
    var value = str.substr(i + 1);

    switch (method) {
      case 'index':
        {
          var index = parseInt(value, 10);
          var frames = window.frames;
          var frame = frames[index];

          if (!frame) {
            throw new Error('Frame index out of range (index ' + value + ' in ' + frames.length + ' frames');
          }

          return { frame: frame };
        }

      case 'relative':
        {
          if (value === 'top') {
            return { frame: window.top };
          }

          if (value === 'parent') {
            return { frame: window.parent };
          }

          throw new Error('Unsupported relative type, ' + value);
        }
    }
  }

  // Note: consider it as name, if no '=' found and it has no xpath pattern
  if (i === -1 && !/^\//.test(str)) {
    str = 'name=' + str;
  }

  var frameDom = getElementByLocator(str);

  if (!frameDom || !frameDom.contentWindow) {
    throw new Error('The element found based on ' + str + ' is NOT a frame/iframe');
  }

  // Note: for those iframe/frame that don't have src, they won't load content_script.js
  // so we have to inject the script by ourselves
  if (!frameDom.getAttribute('src')) {
    var file = __WEBPACK_IMPORTED_MODULE_1__web_extension___default.a.extension.getURL('content_script.js');
    var doc = frameDom.contentDocument;
    var s = doc.constructor.prototype.createElement.call(doc, 'script');

    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);

    doc.documentElement.appendChild(s);
    s.parentNode.removeChild(s);

    helpers.hackAlertConfirmPrompt(doc);
  }

  // Note: can't reurn the contentWindow directly, because Promise 'resolve' will
  // try to test its '.then' method, which will cause a cross origin violation
  // so, we wrap it in an object
  return { frame: frameDom.contentWindow };
};

var run = function run(command, csIpc, helpers) {
  var cmd = command.cmd,
      target = command.target,
      value = command.value,
      extra = command.extra;

  var delayWithTimeoutStatus = function delayWithTimeoutStatus(type, timeout, promise) {
    return new Promise(function (resolve, reject) {
      var past = 0;

      var timer = setInterval(function () {
        past += 1000;
        csIpc.ask('CS_TIMEOUT_STATUS', {
          type: type,
          total: timeout,
          past: past
        });

        if (past >= timeout) {
          clearInterval(timer);
        }
      }, 1000);

      var p = promise.then(function (val) {
        clearInterval(timer);
        return val;
      });

      resolve(p);
    });
  };
  var wrap = function wrap(fn, genOptions) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var options = genOptions.apply(undefined, args);

      return new Promise(function (resolve, reject) {
        try {
          resolve(fn.apply(undefined, args));
        } catch (e) {
          reject(new Error(options.errorMsg));
        }
      });
    };
  };
  var __getFrameByLocator = wrap(getFrameByLocator, function (locator) {
    return {
      errorMsg: 'time out when looking for frame \'' + locator + '\''
    };
  });
  var __getElementByLocator = wrap(getElementByLocator, function (locator) {
    return {
      errorMsg: 'time out when looking for element \'' + locator + '\''
    };
  });

  switch (cmd) {
    case 'open':
      if (window.noCommandsYet) {
        return true;
      }

      return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["m" /* until */])('document.body', function () {
        return {
          pass: !!document.body,
          result: document.body
        };
      }).then(function (body) {
        window.location.href = command.target;
        return true;
      });

    case 'refresh':
      setTimeout(function () {
        return window.location.reload();
      }, 0);
      return true;

    case 'mouseOver':
      {
        return __getElementByLocator(target).then(function (el) {
          try {
            if (extra.playScrollElementsIntoView) el.scrollIntoView();
            if (extra.playHighlightElements) helpers.highlightDom(el, HIGHLIGHT_TIMEOUT);
          } catch (e) {
            __WEBPACK_IMPORTED_MODULE_2__log__["a" /* default */].error('error in scroll and highlight', e.message);
          }

          el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
          return true;
        });
      }

    case 'dragAndDropToObject':
      {
        return Promise.all([__getElementByLocator(target), __getElementByLocator(value)]).then(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              $src = _ref2[0],
              $tgt = _ref2[1];

          __WEBPACK_IMPORTED_MODULE_3__drag_mock___default.a.dragStart($src).drop($tgt);
          return true;
        });
      }

    case 'clickAt':
      {
        return __getElementByLocator(target).then(function (el) {
          if (!/^\d+\s*,\s*\d+$/.test(value)) {
            throw new Error('invalid offset for clickAt: ' + value);
          }

          var _value$split$map = value.split(',').map(function (str) {
            return parseInt(str.trim(), 10);
          }),
              _value$split$map2 = _slicedToArray(_value$split$map, 2),
              x = _value$split$map2[0],
              y = _value$split$map2[1];

          var _viewportOffset = viewportOffset(el),
              top = _viewportOffset.top,
              left = _viewportOffset.left;

          var vx = left + x;
          var vy = top + y;
          var elToClick = document.elementFromPoint(vx, vy);

          if (!elToClick) {
            throw new Error('Not able to find an element to click');
          }

          try {
            if (extra.playScrollElementsIntoView) elToClick.scrollIntoView();
            if (extra.playHighlightElements) helpers.highlightDom(elToClick, HIGHLIGHT_TIMEOUT);
          } catch (e) {
            __WEBPACK_IMPORTED_MODULE_2__log__["a" /* default */].error('error in scroll and highlight');
          }

          elToClick.click();
          return true;
        });
      }

    case 'click':
    case 'clickAndWait':
      {
        return __getElementByLocator(target).then(function (el) {
          try {
            if (extra.playScrollElementsIntoView) el.scrollIntoView();
            if (extra.playHighlightElements) helpers.highlightDom(el, HIGHLIGHT_TIMEOUT);
          } catch (e) {
            __WEBPACK_IMPORTED_MODULE_2__log__["a" /* default */].error('error in scroll and highlight');
          }

          el.click();
          return true;
        });
      }

    case 'select':
    case 'selectAndWait':
      {
        return __getElementByLocator(target).then(function (el) {
          var text = value.replace(/^label=/, '');
          var options = [].slice.call(el.getElementsByTagName('option'));
          var option = options.find(function (op) {
            return domText(op) === text;
          });

          if (!option) {
            throw new Error('cannot find option with label \'' + text + '\'');
          }

          if (extra.playScrollElementsIntoView) el.scrollIntoView();
          if (extra.playHighlightElements) helpers.highlightDom(el, HIGHLIGHT_TIMEOUT);

          el.value = option.value;
          el.dispatchEvent(new Event('change'));

          return true;
        });
      }

    case 'type':
      {
        return __getElementByLocator(target).then(function (el) {
          var tag = el.tagName.toLowerCase();

          if (tag !== 'input' && tag !== 'textarea') {
            throw new Error('run command: element found is neither input nor textarea');
          }

          if (extra.playScrollElementsIntoView) el.scrollIntoView();
          if (extra.playHighlightElements) helpers.highlightDom(el, HIGHLIGHT_TIMEOUT);

          el.value = value;
          el.dispatchEvent(new Event('change'));

          return true;
        }).catch(function (e) {
          if (/This input element accepts a filename/i.test(e.message)) {
            throw new Error('Sorry, upload can not be automated Chrome (API limitation).');
          }

          throw e;
        });
      }

    case 'selectFrame':
      {
        return __getFrameByLocator(target, helpers).then(function (frameWindow) {
          if (!frameWindow) {
            throw new Error('Invalid frame/iframe');
          }

          return frameWindow;
        });
      }

    case 'pause':
      {
        var n = parseInt(target);

        if (isNaN(n) || n <= 0) {
          throw new Error('target of pause command must be a positive integer');
        }

        return delayWithTimeoutStatus('pause', n, Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* delay */])(function () {
          return true;
        }, n));
      }

    case 'verifyText':
      {
        return __getElementByLocator(target).then(function (el) {
          var text = domText(el);

          if (text !== value) {
            return {
              log: {
                error: 'text not matched, \n\texpected: "' + value + '", \n\tactual: "' + text + '"'
              }
            };
          }

          return true;
        });
      }

    case 'verifyTitle':
      {
        if (target !== document.title) {
          return {
            log: {
              error: 'title not matched, \n\texpected: "' + target + '", \n\tactual: "' + document.title + '"'
            }
          };
        }

        return true;
      }

    case 'verifyElementPresent':
      {
        var _ref3 = extra || {},
            timeoutElement = _ref3.timeoutElement,
            retryInfo = _ref3.retryInfo;

        return __getElementByLocator(target).then(function () {
          return true;
        }, function (e) {
          var shotsLeft = timeoutElement * 1000 / retryInfo.retryInterval - retryInfo.retryCount;
          var isLastChance = shotsLeft <= 1;

          if (isLastChance) {
            return {
              log: {
                error: '\'' + target + '\' element not present'
              }
            };
          }

          throw e;
        });
      }

    case 'assertText':
      {
        return __getElementByLocator(target).then(function (el) {
          var text = domText(el);

          if (text !== value) {
            throw new Error('text not matched, \n\texpected: "' + value + '", \n\tactual: "' + text + '"');
          }

          return true;
        });
      }

    case 'assertTitle':
      {
        if (target !== document.title) {
          throw new Error('title not matched, \n\texpected: "' + target + '", \n\tactual: "' + document.title + '"');
        }

        return true;
      }

    case 'assertElementPresent':
      {
        return __getElementByLocator(target).then(function () {
          return true;
        });
      }

    case 'assertAlert':
      {
        var msg = document.body.getAttribute('data-alert');

        if (!msg) {
          throw new Error('no alert found!');
        }

        if (target !== '*' && msg !== target) {
          throw new Error('unmatched alert msg, \n\texpected: "' + target + '", \n\tactual: "' + msg + '"');
        }

        document.body.setAttribute('data-alert', '');
        return true;
      }

    case 'assertConfirmation':
      {
        var _msg = document.body.getAttribute('data-confirm');

        if (!_msg) {
          throw new Error('no confirm found!');
        }

        if (target !== '*' && _msg !== target) {
          throw new Error('unmatched confirm msg, \n\texpected: "' + target + '", \n\tactual: "' + _msg + '"');
        }

        document.body.setAttribute('data-confirm', '');
        return true;
      }

    case 'assertPrompt':
      {
        var _msg2 = document.body.getAttribute('data-prompt');

        if (!_msg2) {
          throw new Error('no prompt found!');
        }

        if (target !== '*' && _msg2 !== target) {
          throw new Error('unmatched prompt msg, \n\texpected: "' + target + '", \n\tactual: "' + _msg2 + '"');
        }

        document.body.setAttribute('data-prompt', '');
        return true;
      }

    case 'answerOnNextPrompt':
      {
        document.body.setAttribute('data-prompt-answer', target);
        return true;
      }

    case 'waitForPageToLoad':
      return true;

    case 'store':
      return {
        vars: _defineProperty({}, value, target)
      };

    case 'storeTitle':
      {
        return {
          vars: _defineProperty({}, value, document.title)
        };
      }

    case 'storeText':
      {
        return __getElementByLocator(target).then(function (el) {
          return {
            vars: _defineProperty({}, value, domText(el))
          };
        });
      }

    case 'storeAttribute':
      {
        var index = target.lastIndexOf('@');

        if (index === -1) {
          throw new Error('invalid target for storeAttribute - ' + target);
        }

        var locator = target.substr(0, index);
        var attrName = target.substr(index + 1);

        return __getElementByLocator(locator).then(function (el) {
          var attr = el.getAttribute(attrName);

          if (!attr) {
            throw new Error('missing attribute \'' + attrName + '\'');
          }

          return {
            vars: _defineProperty({}, value, attr)
          };
        });
      }

    case 'storeEval':
      {
        try {
          return {
            vars: _defineProperty({}, value, window.eval(target))
          };
        } catch (e) {
          throw new Error('Error in runEval code: ' + e.message);
        }
      }

    case 'echo':
      {
        return {
          log: {
            info: target
          }
        };
      }

    case 'sendKeys':
      {
        return __getElementByLocator(target).then(function (el) {
          Object(__WEBPACK_IMPORTED_MODULE_4__send_keys__["a" /* default */])(el, value);
          return true;
        });
      }

    case 'selectWindow':
      {
        var p = target && target.toUpperCase() === 'TAB=CLOSEALLOTHER' ? csIpc.ask('CS_CLOSE_OTHER_TABS', {}) : csIpc.ask('CS_SELECT_WINDOW', { target: target });

        // Note: let `selectWindow` pass through cs and back to background,
        // to keep the flow more consistent with the other commands
        return p.then(function () {
          return true;
        });
      }

    case 'captureScreenshot':
      {
        return csIpc.ask('CS_CAPTURE_SCREENSHOT', { target: target }).then(function (url) {
          return {
            screenshot: {
              url: url,
              name: target || url.split('/').slice(-1)[0]
            }
          };
        });
      }

    case 'deleteAllCookies':
      {
        return csIpc.ask('CS_DELETE_ALL_COOKIES', {
          url: window.location.origin
        }).then(function () {
          return true;
        });
      }

    case 'while':
    case 'gotoIf':
      {
        try {
          return {
            // eslint-disable-next-line no-eval
            condition: window.eval(target)
          };
        } catch (e) {
          throw new Error('Error in runEval condition of ' + cmd + ': ' + e.message);
        }
      }

    default:
      throw new Error('Command ' + cmd + ' not supported yet');
  }
};

/***/ }),

/***/ 983:
/***/ (function(module, exports, __webpack_require__) {


var DragDropAction = __webpack_require__(459);

function call(instance, methodName, args) {
  return instance[methodName].apply(instance, args);
}

var dragMock = {
  dragStart: function dragStart(targetElement, eventProperties, configCallback) {
    return call(new DragDropAction(), 'dragStart', arguments);
  },
  dragEnter: function dragEnter(targetElement, eventProperties, configCallback) {
    return call(new DragDropAction(), 'dragEnter', arguments);
  },
  dragOver: function dragOver(targetElement, eventProperties, configCallback) {
    return call(new DragDropAction(), 'dragOver', arguments);
  },
  dragLeave: function dragLeave(targetElement, eventProperties, configCallback) {
    return call(new DragDropAction(), 'dragLeave', arguments);
  },
  drop: function drop(targetElement, eventProperties, configCallback) {
    return call(new DragDropAction(), 'drop', arguments);
  },
  delay: function delay(targetElement, eventProperties, configCallback) {
    return call(new DragDropAction(), 'delay', arguments);
  },

  // Just for unit testing:
  DataTransfer: __webpack_require__(200),
  DragDropAction: __webpack_require__(459),
  eventFactory: __webpack_require__(460)
};

module.exports = dragMock;

/***/ }),

/***/ 984:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = sendKeys;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_keysim__ = __webpack_require__(985);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_keysim___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_keysim__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__log__ = __webpack_require__(24);




var keyboard = __WEBPACK_IMPORTED_MODULE_0_keysim__["Keyboard"].US_ENGLISH;

var findParentByTag = function findParentByTag(el, tag) {
  var p = el;

  // eslint-disable-next-line no-cond-assign
  while (p = p.parentNode) {
    if (p.tagName === tag.toUpperCase()) {
      return p;
    }
  }

  return null;
};

var splitStringToChars = function splitStringToChars(str) {
  var specialKeys = ['KEY_LEFT', 'KEY_UP', 'KEY_RIGHT', 'KEY_DOWN', 'KEY_PGUP', 'KEY_PAGE_UP', 'KEY_PGDN', 'KEY_PAGE_DOWN', 'KEY_BKSP', 'KEY_BACKSPACE', 'KEY_DEL', 'KEY_DELETE', 'KEY_ENTER', 'KEY_TAB'];
  var reg = new RegExp('\\$\\{(' + specialKeys.join('|') + ')\\}');
  var parts = Object(__WEBPACK_IMPORTED_MODULE_1__utils__["k" /* splitKeep */])(reg, str);

  return parts.reduce(function (prev, cur) {
    if (reg.test(cur)) {
      prev.push(cur);
    } else {
      prev = prev.concat(cur.split(''));
    }

    return prev;
  }, []);
};

var getKeyStrokeAction = function getKeyStrokeAction(str) {
  var reg = /^\$\{([^}]+)\}$/;
  var match = void 0;

  // eslint-disable-next-line no-cond-assign
  if (match = str.match(reg)) {
    switch (match[1]) {
      case 'KEY_LEFT':
        return 'LEFT';

      case 'KEY_UP':
        return 'UP';

      case 'KEY_RIGHT':
        return 'RIGHT';

      case 'KEY_DOWN':
        return 'DOWN';

      case 'KEY_PGUP':
      case 'KEY_PAGE_UP':
        return 'PAGEUP';

      case 'KEY_PGDN':
      case 'KEY_PAGE_DOWN':
        return 'PAGEDOWN';

      case 'KEY_BKSP':
      case 'KEY_BACKSPACE':
        return 'BACKSPACE';

      case 'KEY_DEL':
      case 'KEY_DELETE':
        return 'DELETE';

      case 'KEY_ENTER':
        return 'ENTER';

      case 'KEY_TAB':
        return 'TAB';
    }
  }

  return str;
};

var isEditable = function isEditable(el) {
  if (el.getAttribute('readonly') !== null) return false;
  var tag = el.tagName.toUpperCase();
  var type = (el.getAttribute('type') || '').toLowerCase();
  var editableTypes = ['text', 'search', 'tel', 'url', 'email', 'password', 'number'];

  if (tag === 'TEXTAREA') return true;
  if (tag === 'INPUT' && editableTypes.indexOf(type) !== -1) return true;

  return false;
};

var maybeEditText = function maybeEditText(target, c) {
  if (!isEditable(target)) return;
  if (c.length === 1) {
    var lastStart = target.selectionStart;
    target.value = target.value.substring(0, target.selectionStart) + c + target.value.substring(target.selectionEnd);

    target.selectionStart = target.selectionEnd = lastStart + 1;
  } else {
    switch (c) {
      case 'LEFT':
        target.selectionStart = target.selectionEnd = target.selectionStart - 1;
        break;
      case 'RIGHT':
        target.selectionStart = target.selectionEnd = target.selectionEnd + 1;
        break;
      case 'BACKSPACE':
        {
          var pos = target.selectionStart;
          target.value = target.value.substring(0, target.selectionStart - 1) + target.value.substring(target.selectionEnd);
          target.selectionStart = target.selectionEnd = pos - 1;
          break;
        }
      case 'DELETE':
        {
          var _pos = target.selectionEnd;
          target.value = target.value.substring(0, target.selectionStart) + target.value.substring(target.selectionEnd + 1);
          target.selectionStart = target.selectionEnd = _pos;
          break;
        }
    }
  }
};

var maybeSubmitForm = function maybeSubmitForm(target, key) {
  if (key !== 'ENTER') return;
  if (!isEditable(target)) return;

  var form = findParentByTag(target, 'FORM');
  if (!form) return;

  form.submit();
};

function sendKeys(target, str) {
  var chars = splitStringToChars(str);

  target.focus();
  if (target.value) {
    target.selectionStart = target.selectionEnd = target.value.length;
  }

  chars.forEach(function (c) {
    var action = getKeyStrokeAction(c);

    // Note: This line will take care of KEYDOWN KEYPRESS KEYUP and TEXTINPUT
    keyboard.dispatchEventsForAction(action, target);
    maybeEditText(target, action);
    maybeSubmitForm(target, action);
  });
}

/***/ }),

/***/ 985:
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
   true ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.Keysim = global.Keysim || {})));
}(this, function (exports) { 'use strict';

  function isEditable (element) {
    if (element.ownerDocument.designMode && element.ownerDocument.designMode.toLowerCase() === 'on') {
      return true;
    }

    switch (element.tagName.toLowerCase()) {
      case 'input':
        return isEditableInput(element);
      case 'textarea':
        return true;
    }

    if (isContentEditable(element)) {
      return true;
    }

    return false;
  }

  function isContentEditable(element) {
    if (element.contentEditable && element.contentEditable.toLowerCase() === 'true') {
      return true;
    }
    if (element.contentEditable && element.contentEditable.toLowerCase() === 'inherit' && element.parentNode) {
      return isContentEditable(element.parentNode);
    }
    return false;
  }

  function isEditableInput(input) {
    switch (input.type) {
      case 'text':
        return true;
      case 'email':
        return true;
      case 'password':
        return true;
      case 'search':
        return true;
      case 'tel':
        return true;
      case 'url':
        return true;
      default:
        return false;
    }
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var CTRL = 1 << 0;
  var META = 1 << 1;
  var ALT = 1 << 2;
  var SHIFT = 1 << 3;

  // Key Events
  var KeyEvents = {
    DOWN: 1 << 0,
    PRESS: 1 << 1,
    UP: 1 << 2,
    INPUT: 1 << 3
  };
  KeyEvents.ALL = KeyEvents.DOWN | KeyEvents.PRESS | KeyEvents.UP | KeyEvents.INPUT;

  /**
   * Represents a keystroke, or a single key code with a set of active modifiers.
   *
   * @class Keystroke
   */
  var Keystroke =
  /**
   * @param {number} modifiers A bitmask formed by CTRL, META, ALT, and SHIFT.
   * @param {number} keyCode
   */
  function Keystroke(modifiers, keyCode) {
    classCallCheck(this, Keystroke);

    this.modifiers = modifiers;
    this.ctrlKey = !!(modifiers & CTRL);
    this.metaKey = !!(modifiers & META);
    this.altKey = !!(modifiers & ALT);
    this.shiftKey = !!(modifiers & SHIFT);
    this.keyCode = keyCode;
  }

  /**
   * Gets the bitmask value for the "control" modifier.
   *
   * @type {number}
   */


  /**
   * Gets the bitmask value for the "meta" modifier.
   *
   * @return {number}
   */


  /**
   * Gets the bitmask value for the "alt" modifier.
   *
   * @return {number}
   */


  /**
   * Gets the bitmask value for the "shift" modifier.
   *
   * @return {number}
   */
  ;

  /**
   * Simulates a keyboard with a particular key-to-character and key-to-action
   * mapping. Use `US_ENGLISH` to get a pre-configured keyboard.
   */
  Keystroke.CTRL = CTRL;
  Keystroke.META = META;
  Keystroke.ALT = ALT;
  Keystroke.SHIFT = SHIFT;
  var Keyboard = function () {
    /**
     * @param {Object.<number, Keystroke>} charCodeKeyCodeMap
     * @param {Object.<string, number>} actionKeyCodeMap
     */

    function Keyboard(charCodeKeyCodeMap, actionKeyCodeMap) {
      classCallCheck(this, Keyboard);

      this._charCodeKeyCodeMap = charCodeKeyCodeMap;
      this._actionKeyCodeMap = actionKeyCodeMap;
    }

    /**
     * Determines the character code generated by pressing the given keystroke.
     *
     * @param {Keystroke} keystroke
     * @return {?number}
     */


    createClass(Keyboard, [{
      key: 'charCodeForKeystroke',
      value: function charCodeForKeystroke(keystroke) {
        var map = this._charCodeKeyCodeMap;
        for (var charCode in map) {
          if (Object.prototype.hasOwnProperty.call(map, charCode)) {
            var keystrokeForCharCode = map[charCode];
            if (keystroke.keyCode === keystrokeForCharCode.keyCode && keystroke.modifiers === keystrokeForCharCode.modifiers) {
              return parseInt(charCode, 10);
            }
          }
        }
        return null;
      }

      /**
       * Creates an event ready for dispatching onto the given target.
       *
       * @param {string} type One of "keydown", "keypress", "keyup", or "textInput".
       * @param {Keystroke} keystroke
       * @param {HTMLElement} target
       * @return {Event}
       */

    }, {
      key: 'createEventFromKeystroke',
      value: function createEventFromKeystroke(type, keystroke, target) {
        var document = target.ownerDocument;
        var window = document.defaultView;
        var Event = window.Event;

        var event = void 0;

        try {
          event = new Event(type);
        } catch (e) {
          event = document.createEvent('UIEvents');
        }

        event.initEvent(type, true, true);

        switch (type) {
          case 'textInput':
            event.data = String.fromCharCode(this.charCodeForKeystroke(keystroke));
            break;

          case 'keydown':case 'keypress':case 'keyup':
            event.shiftKey = keystroke.shiftKey;
            event.altKey = keystroke.altKey;
            event.metaKey = keystroke.metaKey;
            event.ctrlKey = keystroke.ctrlKey;
            event.keyCode = type === 'keypress' ? this.charCodeForKeystroke(keystroke) : keystroke.keyCode;
            event.charCode = type === 'keypress' ? event.keyCode : 0;
            event.which = event.keyCode;
            break;
        }

        return event;
      }

      /**
       * Fires the correct sequence of events on the given target as if the given
       * action was undertaken by a human.
       *
       * @param {string} action e.g. "alt+shift+left" or "backspace"
       * @param {HTMLElement} target
       */

    }, {
      key: 'dispatchEventsForAction',
      value: function dispatchEventsForAction(action, target) {
        var keystroke = this.keystrokeForAction(action);
        this.dispatchEventsForKeystroke(keystroke, target);
      }

      /**
       * Fires the correct sequence of events on the given target as if the given
       * input had been typed by a human.
       *
       * @param {string} input
       * @param {HTMLElement} target
       */

    }, {
      key: 'dispatchEventsForInput',
      value: function dispatchEventsForInput(input, target) {
        var currentModifierState = 0;
        for (var i = 0, length = input.length; i < length; i++) {
          var keystroke = this.keystrokeForCharCode(input.charCodeAt(i));
          this.dispatchModifierStateTransition(target, currentModifierState, keystroke.modifiers);
          this.dispatchEventsForKeystroke(keystroke, target, false);
          currentModifierState = keystroke.modifiers;
        }
        this.dispatchModifierStateTransition(target, currentModifierState, 0);
      }

      /**
       * Fires the correct sequence of events on the given target as if the given
       * keystroke was performed by a human. When simulating, for example, typing
       * the letter "A" (assuming a U.S. English keyboard) then the sequence will
       * look like this:
       *
       *   keydown   keyCode=16 (SHIFT) charCode=0      shiftKey=true
       *   keydown   keyCode=65 (A)     charCode=0      shiftKey=true
       *   keypress  keyCode=65 (A)     charCode=65 (A) shiftKey=true
       *   textInput data=A
       *   keyup     keyCode=65 (A)     charCode=0      shiftKey=true
       *   keyup     keyCode=16 (SHIFT) charCode=0      shiftKey=false
       *
       * If the keystroke would not cause a character to be input, such as when
       * pressing alt+shift+left, the sequence looks like this:
       *
       *   keydown   keyCode=16 (SHIFT) charCode=0 altKey=false shiftKey=true
       *   keydown   keyCode=18 (ALT)   charCode=0 altKey=true  shiftKey=true
       *   keydown   keyCode=37 (LEFT)  charCode=0 altKey=true  shiftKey=true
       *   keyup     keyCode=37 (LEFT)  charCode=0 altKey=true  shiftKey=true
       *   keyup     keyCode=18 (ALT)   charCode=0 altKey=false shiftKey=true
       *   keyup     keyCode=16 (SHIFT) charCode=0 altKey=false shiftKey=false
       *
       * To disable handling of modifier keys, call with `transitionModifers` set
       * to false. Doing so will omit the keydown and keyup events associated with
       * shift, ctrl, alt, and meta keys surrounding the actual keystroke.
       *
       * @param {Keystroke} keystroke
       * @param {HTMLElement} target
       * @param {boolean=} transitionModifiers
       * @param {number} events
       */

    }, {
      key: 'dispatchEventsForKeystroke',
      value: function dispatchEventsForKeystroke(keystroke, target) {
        var transitionModifiers = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
        var events = arguments.length <= 3 || arguments[3] === undefined ? KeyEvents.ALL : arguments[3];

        if (transitionModifiers) {
          this.dispatchModifierStateTransition(target, 0, keystroke.modifiers, events);
        }

        var keydownEvent = void 0;
        if (events & KeyEvents.DOWN) {
          keydownEvent = this.createEventFromKeystroke('keydown', keystroke, target);
        }

        if (keydownEvent && target.dispatchEvent(keydownEvent) && this.targetCanReceiveTextInput(target)) {
          var keypressEvent = void 0;
          if (events & KeyEvents.PRESS) {
            keypressEvent = this.createEventFromKeystroke('keypress', keystroke, target);
          }
          if (keypressEvent && keypressEvent.charCode && target.dispatchEvent(keypressEvent)) {
            if (events & KeyEvents.INPUT) {
              var textinputEvent = this.createEventFromKeystroke('textInput', keystroke, target);
              target.dispatchEvent(textinputEvent);
            }
          }
        }

        if (events & KeyEvents.UP) {
          var keyupEvent = this.createEventFromKeystroke('keyup', keystroke, target);
          target.dispatchEvent(keyupEvent);
        }

        if (transitionModifiers) {
          this.dispatchModifierStateTransition(target, keystroke.modifiers, 0);
        }
      }

      /**
       * Transitions from one modifier state to another by dispatching key events.
       *
       * @param {EventTarget} target
       * @param {number} fromModifierState
       * @param {number} toModifierState
       * @param {number} events
       * @private
       */

    }, {
      key: 'dispatchModifierStateTransition',
      value: function dispatchModifierStateTransition(target, fromModifierState, toModifierState) {
        var events = arguments.length <= 3 || arguments[3] === undefined ? KeyEvents.ALL : arguments[3];

        var currentModifierState = fromModifierState;
        var didHaveMeta = (fromModifierState & META) === META;
        var willHaveMeta = (toModifierState & META) === META;
        var didHaveCtrl = (fromModifierState & CTRL) === CTRL;
        var willHaveCtrl = (toModifierState & CTRL) === CTRL;
        var didHaveShift = (fromModifierState & SHIFT) === SHIFT;
        var willHaveShift = (toModifierState & SHIFT) === SHIFT;
        var didHaveAlt = (fromModifierState & ALT) === ALT;
        var willHaveAlt = (toModifierState & ALT) === ALT;

        var includeKeyUp = events & KeyEvents.UP;
        var includeKeyDown = events & KeyEvents.DOWN;

        if (includeKeyUp && didHaveMeta === true && willHaveMeta === false) {
          // Release the meta key.
          currentModifierState &= ~META;
          target.dispatchEvent(this.createEventFromKeystroke('keyup', new Keystroke(currentModifierState, this._actionKeyCodeMap.META), target));
        }

        if (includeKeyUp && didHaveCtrl === true && willHaveCtrl === false) {
          // Release the ctrl key.
          currentModifierState &= ~CTRL;
          target.dispatchEvent(this.createEventFromKeystroke('keyup', new Keystroke(currentModifierState, this._actionKeyCodeMap.CTRL), target));
        }

        if (includeKeyUp && didHaveShift === true && willHaveShift === false) {
          // Release the shift key.
          currentModifierState &= ~SHIFT;
          target.dispatchEvent(this.createEventFromKeystroke('keyup', new Keystroke(currentModifierState, this._actionKeyCodeMap.SHIFT), target));
        }

        if (includeKeyUp && didHaveAlt === true && willHaveAlt === false) {
          // Release the alt key.
          currentModifierState &= ~ALT;
          target.dispatchEvent(this.createEventFromKeystroke('keyup', new Keystroke(currentModifierState, this._actionKeyCodeMap.ALT), target));
        }

        if (includeKeyDown && didHaveMeta === false && willHaveMeta === true) {
          // Press the meta key.
          currentModifierState |= META;
          target.dispatchEvent(this.createEventFromKeystroke('keydown', new Keystroke(currentModifierState, this._actionKeyCodeMap.META), target));
        }

        if (includeKeyDown && didHaveCtrl === false && willHaveCtrl === true) {
          // Press the ctrl key.
          currentModifierState |= CTRL;
          target.dispatchEvent(this.createEventFromKeystroke('keydown', new Keystroke(currentModifierState, this._actionKeyCodeMap.CTRL), target));
        }

        if (includeKeyDown && didHaveShift === false && willHaveShift === true) {
          // Press the shift key.
          currentModifierState |= SHIFT;
          target.dispatchEvent(this.createEventFromKeystroke('keydown', new Keystroke(currentModifierState, this._actionKeyCodeMap.SHIFT), target));
        }

        if (includeKeyDown && didHaveAlt === false && willHaveAlt === true) {
          // Press the alt key.
          currentModifierState |= ALT;
          target.dispatchEvent(this.createEventFromKeystroke('keydown', new Keystroke(currentModifierState, this._actionKeyCodeMap.ALT), target));
        }

        if (currentModifierState !== toModifierState) {
          throw new Error('internal error, expected modifier state: ' + toModifierState + (', got: ' + currentModifierState));
        }
      }

      /**
       * Returns the keystroke associated with the given action.
       *
       * @param {string} action
       * @return {?Keystroke}
       */

    }, {
      key: 'keystrokeForAction',
      value: function keystrokeForAction(action) {
        var keyCode = null;
        var modifiers = 0;

        var parts = action.split('+');
        var lastPart = parts.pop();

        parts.forEach(function (part) {
          switch (part.toUpperCase()) {
            case 'CTRL':
              modifiers |= CTRL;break;
            case 'META':
              modifiers |= META;break;
            case 'ALT':
              modifiers |= ALT;break;
            case 'SHIFT':
              modifiers |= SHIFT;break;
            default:
              throw new Error('in "' + action + '", invalid modifier: ' + part);
          }
        });

        if (lastPart.toUpperCase() in this._actionKeyCodeMap) {
          keyCode = this._actionKeyCodeMap[lastPart.toUpperCase()];
        } else if (lastPart.length === 1) {
          var lastPartKeystroke = this.keystrokeForCharCode(lastPart.charCodeAt(0));
          modifiers |= lastPartKeystroke.modifiers;
          keyCode = lastPartKeystroke.keyCode;
        } else {
          throw new Error('in "' + action + '", invalid action: ' + lastPart);
        }

        return new Keystroke(modifiers, keyCode);
      }

      /**
       * Gets the keystroke used to generate the given character code.
       *
       * @param {number} charCode
       * @return {?Keystroke}
       */

    }, {
      key: 'keystrokeForCharCode',
      value: function keystrokeForCharCode(charCode) {
        return this._charCodeKeyCodeMap[charCode] || null;
      }

      /**
       * @param {EventTarget} target
       * @private
       */

    }, {
      key: 'targetCanReceiveTextInput',
      value: function targetCanReceiveTextInput(target) {
        if (!target) {
          return false;
        }

        return isEditable(target);
      }
    }]);
    return Keyboard;
  }();

  var US_ENGLISH_CHARCODE_KEYCODE_MAP = {
    32: new Keystroke(0, 32), // <space>
    33: new Keystroke(SHIFT, 49), // !
    34: new Keystroke(SHIFT, 222), // "
    35: new Keystroke(SHIFT, 51), // #
    36: new Keystroke(SHIFT, 52), // $
    37: new Keystroke(SHIFT, 53), // %
    38: new Keystroke(SHIFT, 55), // &
    39: new Keystroke(0, 222), // '
    40: new Keystroke(SHIFT, 57), // (
    41: new Keystroke(SHIFT, 48), // )
    42: new Keystroke(SHIFT, 56), // *
    43: new Keystroke(SHIFT, 187), // +
    44: new Keystroke(0, 188), // ,
    45: new Keystroke(0, 189), // -
    46: new Keystroke(0, 190), // .
    47: new Keystroke(0, 191), // /
    48: new Keystroke(0, 48), // 0
    49: new Keystroke(0, 49), // 1
    50: new Keystroke(0, 50), // 2
    51: new Keystroke(0, 51), // 3
    52: new Keystroke(0, 52), // 4
    53: new Keystroke(0, 53), // 5
    54: new Keystroke(0, 54), // 6
    55: new Keystroke(0, 55), // 7
    56: new Keystroke(0, 56), // 8
    57: new Keystroke(0, 57), // 9
    58: new Keystroke(SHIFT, 186), // :
    59: new Keystroke(0, 186), // ;
    60: new Keystroke(SHIFT, 188), // <
    61: new Keystroke(0, 187), // =
    62: new Keystroke(SHIFT, 190), // >
    63: new Keystroke(SHIFT, 191), // ?
    64: new Keystroke(SHIFT, 50), // @
    65: new Keystroke(SHIFT, 65), // A
    66: new Keystroke(SHIFT, 66), // B
    67: new Keystroke(SHIFT, 67), // C
    68: new Keystroke(SHIFT, 68), // D
    69: new Keystroke(SHIFT, 69), // E
    70: new Keystroke(SHIFT, 70), // F
    71: new Keystroke(SHIFT, 71), // G
    72: new Keystroke(SHIFT, 72), // H
    73: new Keystroke(SHIFT, 73), // I
    74: new Keystroke(SHIFT, 74), // J
    75: new Keystroke(SHIFT, 75), // K
    76: new Keystroke(SHIFT, 76), // L
    77: new Keystroke(SHIFT, 77), // M
    78: new Keystroke(SHIFT, 78), // N
    79: new Keystroke(SHIFT, 79), // O
    80: new Keystroke(SHIFT, 80), // P
    81: new Keystroke(SHIFT, 81), // Q
    82: new Keystroke(SHIFT, 82), // R
    83: new Keystroke(SHIFT, 83), // S
    84: new Keystroke(SHIFT, 84), // T
    85: new Keystroke(SHIFT, 85), // U
    86: new Keystroke(SHIFT, 86), // V
    87: new Keystroke(SHIFT, 87), // W
    88: new Keystroke(SHIFT, 88), // X
    89: new Keystroke(SHIFT, 89), // Y
    90: new Keystroke(SHIFT, 90), // Z
    91: new Keystroke(0, 219), // [
    92: new Keystroke(0, 220), // \
    93: new Keystroke(0, 221), // ]
    96: new Keystroke(0, 192), // `
    97: new Keystroke(0, 65), // a
    98: new Keystroke(0, 66), // b
    99: new Keystroke(0, 67), // c
    100: new Keystroke(0, 68), // d
    101: new Keystroke(0, 69), // e
    102: new Keystroke(0, 70), // f
    103: new Keystroke(0, 71), // g
    104: new Keystroke(0, 72), // h
    105: new Keystroke(0, 73), // i
    106: new Keystroke(0, 74), // j
    107: new Keystroke(0, 75), // k
    108: new Keystroke(0, 76), // l
    109: new Keystroke(0, 77), // m
    110: new Keystroke(0, 78), // n
    111: new Keystroke(0, 79), // o
    112: new Keystroke(0, 80), // p
    113: new Keystroke(0, 81), // q
    114: new Keystroke(0, 82), // r
    115: new Keystroke(0, 83), // s
    116: new Keystroke(0, 84), // t
    117: new Keystroke(0, 85), // u
    118: new Keystroke(0, 86), // v
    119: new Keystroke(0, 87), // w
    120: new Keystroke(0, 88), // x
    121: new Keystroke(0, 89), // y
    122: new Keystroke(0, 90), // z
    123: new Keystroke(SHIFT, 219), // {
    124: new Keystroke(SHIFT, 220), // |
    125: new Keystroke(SHIFT, 221), // }
    126: new Keystroke(SHIFT, 192) // ~
  };

  var US_ENGLISH_ACTION_KEYCODE_MAP = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPSLOCK: 20,
    ESCAPE: 27,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    INSERT: 45,
    DELETE: 46,
    META: 91,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123
  };

  /**
   * Gets a keyboard instance configured as a U.S. English keyboard would be.
   *
   * @return {Keyboard}
   */
  Keyboard.US_ENGLISH = new Keyboard(US_ENGLISH_CHARCODE_KEYCODE_MAP, US_ENGLISH_ACTION_KEYCODE_MAP);

  exports.KeyEvents = KeyEvents;
  exports.Keystroke = Keystroke;
  exports.Keyboard = Keyboard;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

/***/ })

/******/ });