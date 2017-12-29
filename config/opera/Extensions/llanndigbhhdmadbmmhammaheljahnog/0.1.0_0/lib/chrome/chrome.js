var app = {}, tabId;

app.version = function () {return chrome.runtime.getManifest().version};
app.tab = {"open": function (url) {chrome.tabs.create({"url": url, "active": true})}};
if (chrome.runtime.setUninstallURL) chrome.runtime.setUninstallURL(config.welcome.url + "?v=" + app.version() + "&type=uninstall", function () {});

app.storage = (function () {
  var objs = {};
  window.setTimeout(function () {
    chrome.storage.local.get(null, function (o) {
      objs = o;
      document.getElementById("common").src = "../common.js";
    });
  }, 300);
  /*  */
  return {
    "read": function (id) {return objs[id]},
    "write": function (id, data) {
      var tmp = {};
      objs[id] = data;
      tmp[id] = data;
      chrome.storage.local.set(tmp, function () {});
    }
  }
})();