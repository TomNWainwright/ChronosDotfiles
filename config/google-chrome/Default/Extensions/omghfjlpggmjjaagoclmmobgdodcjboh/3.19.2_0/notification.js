(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}
  
  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(this);

},{}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

require('polyfills/Promise');

var _createIncludeStyle = require('tools/createIncludeStyle');

var _createIncludeStyle2 = _interopRequireDefault(_createIncludeStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


var css = "._Notification{\r\n  position: fixed;\r\n  bottom: 30px;\r\n\tright: 30px;\r\n  z-index: 44444444;\r\n  font-size: 14px;\r\n  line-height: 1.4;\r\n\tfont-family: tahoma, arial, sans-serif;\r\n}\r\n._Notification,\r\n._Notification *{\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\n._Notification_Small{\r\n  width: 48px;\r\n\theight: 48px;\r\n\tborder-radius: 50%;\r\n\tbackground-color: #FFF;\r\n\tbox-shadow: 0 2px 7px rgba(0,0,0,.2);\r\n\topacity: .5;\r\n\ttransition: opacity .3s;\r\n  cursor: pointer;\r\n  display: none;\r\n}\r\n._Notification_Small:hover {\r\n\topacity: 1;\r\n}\r\n\r\n._Notification_Small:before,\r\n._Notification_Small:after{\r\n  content: ' ';\r\n  display:block;\r\n}\r\n._Notification_Small:before{\r\n  position: absolute;\r\n  left: 8px;\r\n  top: 8px;\r\n  width: 32px;\r\n  overflow:hidden;font-size:0;text-indent:-9999px;height:0;padding-top:32px;\r\n  box-sizing: content-box;\r\n  background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTkzNTc0NjhGREZDMTFFNkFDMzRBNTQ2QTYyRDhGQ0MiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTkzNTc0NjlGREZDMTFFNkFDMzRBNTQ2QTYyRDhGQ0MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBOTM1NzQ2NkZERkMxMUU2QUMzNEE1NDZBNjJEOEZDQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBOTM1NzQ2N0ZERkMxMUU2QUMzNEE1NDZBNjJEOEZDQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiPs7a8AAAW0SURBVHjaxFdpUFNXFP6ygIArqCCyi6OAOiquA+4VZCplGSsOtorYATsqZUas2Fp1sB2B1jpF+aHYVm0V3KbBpY6KW0HUFltrka0gyBIgQSCIUIG8vN7zLJGExdD84DKXvHvvd77z5d5zz8kT8TyPgWxiQ4GKuoaxzxpUURoNfzbz3sPCNZviVGyap8/bdx8Ws/lztE64fimgHeirPy4snbbh43hZhVyhZg742cvW8/bTAoROrfN5pm84X1ev4hmOIzzZvYlb2P3eFl62tZntSkw54OgZyN17kMurmpr5CV4hWof6AqjTOuEIT3bM/iDx9CWgxyNQPmu0CwqLvfd92qUofx9v8ezpHghYuw2trS/73E1aJ9wshg/0WyBm9puJh/gMjoEaRb19cPj2bNpCGsdti8ApWQZKy+UGHSnhTp67ii+2bxDGxBO0LjabeA0RYJ5bWHKpoqrWiQbvvrMEw4YMxo6EQ/2Kq91fpcBskClCg32EcaVc4US8xN+ngDPnb3y5yGvG1PuXv4XXrCmIjgjB9cwcqNWafgkgPNltDF8h8BDfYsZL/L0KyCsq89y2J3njjKVhkNcocerw53B2sEVuUen/ut9kR/bEU11bB0/GS/zsSDy74kSdiSgiJl525eb9oM6F7dFr8OHaYKg5DhKxBKUV1fj9USEe/FmA/KIyVFQpkJeViknzV8PR3gYeE10wc5o7Zkx1wzjHseA0HKQSCQ79IENC0o9ah35L5qYf+fqTYB0BLHnYzfH7oILTaLQ7cvpYHEbYmiEyPRoLXebBd/wSjLdyxUiLETCVmkIsen16Gl6DdnU76ltVKGl4gmslN/FL2R2kBCWhSdGOkLU7tViJWKz59cp3jjajrYSoltI/9s2Duzqn5upoj0z5HeGZyKjrtzuRVzEvZVmvx/BYkY+F9gt05sgP+Qtb9XayNgbu5uQu0jceMXQY8pWFRuX5PGZPPPqNJarFOkFYXFY5WR9kKjFBbbPCKAFlDeUwkUi7zRc9qZikI6BWWW+rDxKJRFC21BkloLZFqRMrXQqbrf4tGIiaLNIK8Jgf2tT8olXnsCofnseK1PeheNH7LrwpCC1MLXBtnQwO0wN15ocOsXien5U2XHsE7ErU9FSmrQePNuorjhlsLVxR/dbVnyBgwjjHx/qgdq4DY4baGCXAxcoJHZy62zzzl6cjgOXr2/ogVctzeFi7GSVgErMnHv3G/N3SEcDSo4wyVFfQ0+oqgcCYNtnGA09rdMs4+aF03DmW/ncmcp9Fsy90rQUZWb8hJnzNK8WOc7B8oi/Gj3SFlYUlBklep2IKRDrnNq4djf+oUPysBJf/zkB2+X24WDrhm4upOgLID/NX1a0YUZXyfy8mpzMle7g542paEjo0HWybxKhskrPMViB0eq5tVuJs6HGsTAtjsWINh+F2bMfchU7PGvZnIjbBstXRyC94qv32F0/smzXF3fWPbgKo7Uo8cvD0heubk/duxVvzZ4LjORSz4hIp+6jf1zAl+AAmsOIlFklwI+sBNn+6D6sClibviY2I6rEcC5HfobZgCfCusq5x6pbdSXBwHoX42E3wORoAtUZjsACpWIyM8AvYuf8wyoprsT8uGtajLR+xdOdlYiJt7fUXkSlbVHdw/iGRn5WzAoXTZ2/heWsLtsyL6lfwRXttxMv2NpxMzaBCh5URO8qJV995jz9Kzc0HVcmOJnhPdhv3l3AsCUfgP9EP9sPtDHJOuED35dgRn/LqJjCe9GOJ3sRr8JuR9ShLefrxxLnrQ/2TL13J1uQ8ykdKYBLMpWZ9Oqd1whH+/M+ZGrInHuIz5s1oeuTWvbLKaoW6oUXFB51YzXsf9hU6tc5nmq9/0cgzHBcRs1eWW/DE06g3I/3OSvbYuvrGKI7jzt3Mzy6KPLOliQTQJxsXs/mf2KtZFOEM5aQuGui34wEX8K8AAwDBE6hyr22tyQAAAABJRU5ErkJggg==\");\r\n}\r\n._Notification_Small:after{\r\n  position: absolute;\r\n\tright: 2px;\r\n\ttop: 2px;\r\n\twidth: 10px;\r\n\toverflow:hidden;font-size:0;text-indent:-9999px;height:0;padding-top:10px;\r\n  box-sizing: content-box;\r\n\tbackground-color: #993B3B;\r\n\tborder-radius: 50%;\r\n}\r\n\r\n._Notification_Big{\r\n  background-color: #FFF;\r\n\tcolor: #494B4D;\r\n\tbox-shadow: 0 5px 15px rgba(0,0,0,.15);\r\n\tborder-radius: 4px;\r\n\twidth: 340px;\r\n}\r\n\r\n._Notification_Big:before {\r\n  content: ' ';\r\n  display: block;\r\n\tborder-radius: 4px 4px 0 0;\r\n\tposition: relative;\r\n\toverflow:hidden;font-size:0;text-indent:-9999px;height:0;padding-top:54px;\r\n  box-sizing: content-box;\r\n\tbackground: #1C304E url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAAAiCAYAAACTHwETAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTkzNTc0NjRGREZDMTFFNkFDMzRBNTQ2QTYyRDhGQ0MiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTkzNTc0NjVGREZDMTFFNkFDMzRBNTQ2QTYyRDhGQ0MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBOTM1NzQ2MkZERkMxMUU2QUMzNEE1NDZBNjJEOEZDQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBOTM1NzQ2M0ZERkMxMUU2QUMzNEE1NDZBNjJEOEZDQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmyAFe0AAAsKSURBVHja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') no-repeat center center;\r\n}\r\n\r\n._Notification_Big_In {\r\n\tpadding: 25px 30px 28px;\r\n\ttext-align: center;\r\n}\r\n\r\n._Notification_Big_Title {\r\n\tmargin-bottom: 11px;\r\n\tfont-size: 18px;\r\n\tfont-weight: 600;\r\n\tcolor: #3B9946;\r\n\ttext-align: center;\r\n}\r\n\r\n._Notification_Big_Text {\r\n\tfont-size: 14px;\r\n\tline-height: 22px;\r\n\ttext-align: center;\r\n  padding-bottom: 20px;\r\n}\r\n\r\na._Notification_Big_Button {\r\n\tborder-radius: 3px;\r\n\tdisplay: block;\r\n\tfont-size: 14px;\r\n\tbackground-color: #3B9946;\r\n\tline-height: 20px;\r\n  padding: 10px 15px;\r\n  box-sizing: content-box;\r\n\ttext-align: center;\r\n\ttext-decoration: none;\r\n\tcolor: #fff;\r\n\ttransition: background .3s;\r\n}\r\na._Notification_Big_Button:hover{\r\n\tbackground: #308139;\r\n  color: #fff;\r\n\ttext-decoration: none;\r\n}\r\n\r\n._Notification_Later{\r\n  padding-top: 15px;\r\n  text-align: center;\r\n}\r\n._Notification_Later_In{\r\n  cursor: pointer;\r\n  color: #1C304E;\r\n  text-decoration: underline;\r\n}\r\n._Notification_Later_In:hover{\r\n  color: #1C304E;\r\n  text-decoration: none;\r\n}\r\n\r\n._Notification._Notification_stSmall ._Notification_Small{\r\n  display: block;\r\n}\r\n._Notification._Notification_stSmall ._Notification_Big{\r\n  display: none;\r\n}\r\n"; // NOTE URL relative to package.json


/**
@param {*} message
@return {Promise} */
var sendMessage = function sendMessage(message) {
  if (typeof browser !== 'undefined') {
    return browser.runtime.sendMessage(message);
  }

  return new Promise(function (resolve) {
    chrome.runtime.sendMessage(message, resolve);
  });
};

/** User's language
@type {string} */
var language = (navigator.language || navigator.userLanguage).slice(0, 2).toLowerCase();

/** Intitial call to get popup status + translation
(When page fully loaded + message received) */
var initialPromise = new Promise(function (resolve) {
  sendMessage({
    language: language,
    'type': 'notification:request:initial',
    'url': location.href
  }).then(function (data) {
    if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object' || !data.show) return;

    resolve(data);
  });
});

/** When promise resolved */
initialPromise.then(
/**
@param {string} link
@param {string} size - 'small' or 'big'
@param {object} translation - translation object for user's language */
function (_ref) {
  var link = _ref.link,
      size = _ref.size,
      translation = _ref.translation;

  // Inserting styles in <head>
  (0, _createIncludeStyle2.default)(css);

  /** @type {Object<Element>} */
  var elements = {};

  /**
  @param {Object} object
  @return {Element} */
  var createElement = function createElement(object) {
    var element = document.createElement(object.tag);
    if (object.class) element.setAttribute('class', object.class);
    if (object.attributes) {
      Object.keys(object.attributes).forEach(function (attribute) {
        if (['href', 'target'].indexOf(attribute) === -1) return;

        var value = object.attributes[attribute];
        element.setAttribute(attribute, value);
      });
    }
    if (object.node) object.node(element);
    if (object.text) element.textContent = object.text;

    if (object.children) {
      /** @type {Array<Element>} */
      var children = [];
      object.children.forEach(function (child) {
        children.push(createElement(child));
      });

      children.forEach(function (child) {
        element.appendChild(child);
      });
    }

    return element;
  };

  /** @type {Object} */
  var structure = {
    'tag': 'div',
    'class': '_Notification' + (size === 'small' ? ' _Notification_stSmall' : ''),
    'node': function node(_node) {
      elements.parent = _node;
    },
    'children': [{
      'tag': 'div',
      'class': '_Notification_Small',
      'node': function node(_node2) {
        elements.makeBig = _node2;
      }
    }, {
      'tag': 'div',
      'class': '_Notification_Big',
      'children': [{
        'tag': 'div',
        'class': '_Notification_Big_In',
        'children': [{
          'tag': 'div',
          'class': '_Notification_Big_Title',
          'text': translation.title
        }, {
          'tag': 'div',
          'class': '_Notification_Big_Text',
          'text': translation.price_description
        }, {
          'tag': 'a',
          'class': '_Notification_Big_Button',
          'attributes': {
            'href': link,
            'target': '_blank'
          },
          'text': translation.upgrade_to_premium_now
        }, {
          'tag': 'div',
          'class': '_Notification_Later',
          'children': [{
            'tag': 'div',
            'class': '_Notification_Later_In',
            'node': function node(_node3) {
              elements.makeSmall = _node3;
            },
            'text': translation.remind_me_later
          }]
        }]
      }]
    }]
  };

  createElement(structure);

  /** Set visibility
  @param {boolean} visible - true if visible
  @return {undefined} */
  var setVisibility = function setVisibility(visible) {
    sendMessage({ 'type': 'notification:request:setVisibility', visible: visible });

    /** @type {String} */
    var action = visible ? 'remove' : 'add';
    elements.parent.classList[action]('_Notification_stSmall');
  };

  elements.makeBig.addEventListener('click', function () {
    setVisibility(true);
  });
  elements.makeSmall.addEventListener('click', function () {
    setVisibility(false);
  });

  // Inserting into actual DOM with delay
  setTimeout(function () {
    document.body.appendChild(elements.parent);
  }, 10 * 1000);

  // Ping to check all is OK
  var ping = function ping() {
    new Promise(function (resolve, reject) {
      try {
        sendMessage({ 'type': 'notification:ping' }).then(function (state) {
          if (state === 'ok') resolve();
        });
        setTimeout(reject, 3000);
      } catch (e) {
        reject();
      }
    }).then(function () {
      setTimeout(ping, 4000);
    }, function () {
      document.body.removeChild(elements.parent);
    });
  };
  ping();
});

},{"polyfills/Promise":3,"tools/createIncludeStyle":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promisePolyfill = require('promise-polyfill');

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// To add to window
if (window && !window.Promise) window.Promise = _promisePolyfill2.default;

exports.default = _promisePolyfill2.default;

},{"promise-polyfill":1}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Добавляет текстовый стиль в страницу
@param {string} css - аля '.class{ display: block; }'
@return {undefined} */
var createIncludeStyle = function createIncludeStyle(css) {
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');

  style.type = 'text/css';
  if (style.styleSheet) style.styleSheet.cssText = css;else style.appendChild(document.createTextNode(css));

  head.appendChild(style);
};

exports.default = createIncludeStyle;

},{}]},{},[2]);
