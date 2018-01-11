window.onload = function(){
  var popupWidth = 250;  // default width of popup in px
  var rawHeight = 200;
  document.body.style.minWidth = popupWidth + 'px';
  document.body.style.Height = rawHeight + 'px';
  window.scroll(0,0);
};

document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});