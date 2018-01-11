-function() {

var store = localStorage;
var defaults = {
  'endpoint'    : 'https://api.clipbrd.com'
, 'enabled'     : false
, 'maxLength'   : 1024
, 'notifyPopup' : true
, 'notifySound' : true
, 'authEmail'   : null
, 'authHash'    : null
};

store.deviceId || set('deviceId', uuid.v4());

function get(key) {
  if (store[key] === undefined) {
    return defaults[key];
  }
  return JSON.parse(store[key]);
}

function set(key, val) {
  store[key] = JSON.stringify(val);
}

window.settings = {
  get: get
, set: set
};

}();
