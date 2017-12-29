var winid;

window.setTimeout(function () {
  var v = config.welcome.version;
  if (!v) app.tab.open(config.welcome.url + "?version=" + app.version() + "&type=install");
  config.welcome.version = app.version();
}, config.welcome.timeout);

chrome.browserAction.onClicked.addListener(function () {
  chrome.windows.getCurrent(function (win) {
    if (winid) chrome.windows.update(winid, {"focused": true});
    else {
      var url = "https://twitter.com/";
      var width = config.UI.size.width;
      var height = config.UI.size.height;
      var top = win.top + Math.round((win.height - height) / 2);
      var left = win.left + Math.round((win.width - width) / 2);
      chrome.windows.create({'url': url, 'type': 'popup', 'width': width, 'height': height, 'top': top, 'left': left}, function (e) {
        winid = e.id;
      });
    }
  });
});

chrome.windows.onRemoved.addListener(function (e) {if (e === winid) winid = ''});