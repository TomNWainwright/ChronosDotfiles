chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var API_URL = "https://api.dissident.ai";
  var body = document.getElementsByTagName('body')[0];
  var head = document.getElementsByTagName('head')[0];
  var iframe;
  var spinnerDiv;

  var removeAll = function(){
    iframe = document.getElementById('joliframe');
    iframe && iframe.parentNode.removeChild(iframe);
    spinnerDiv = document.getElementById('waiting-spinner-desktop');
    spinnerDiv && spinnerDiv.parentNode.removeChild(spinnerDiv);
    body = document.getElementsByTagName('body')[0];
    body.setAttribute('style', body.getAttribute('style').replace(' overflow: hidden;', ''));
  };
  if (request.action === 'add') {
    var urlTmp = API_URL+'/ext/folderpicker?url=' + encodeURIComponent(request.item.url) + '&name=' + encodeURIComponent(request.item.name) + '&type=' + encodeURIComponent(request.item.type) + '&edit=' + request.edit;
    if (!!request.item.exportType) {
      urlTmp+= '&exporttype=' + encodeURIComponent(request.item.exportType);
    }
    if (!!chrome.runtime.id) {
      urlTmp+= '&extid=' + encodeURIComponent(chrome.runtime.id);
    }
    iframe = document.createElement('iframe');
    iframe.setAttribute('style', 'display: block; width: 100%; height: 100%; position: fixed; top: 0; left: 0; border: none; z-index: 2147483642;');
    iframe.setAttribute('id',    'joliframe');
    iframe.setAttribute('src',   urlTmp);

    var spinnerStyleURL = chrome.extension.getURL("spinnerstyle.css");
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = spinnerStyleURL;
    head.appendChild(link);
    spinnerDiv = document.createElement('div');
    spinnerDiv.setAttribute('style', 'display: block; width: 50px; height: 50px; position: fixed; top: 50%; left: 50%; margin-top: -25px; margin-left: -25px; border: none; z-index: 2147483643; background-color: rgba(0, 0, 0, 0.3); border-radius: 8px 0px 8px 8px;');
    spinnerDiv.setAttribute('id', 'waiting-spinner-desktop');
    var internalSpinner = document.createElement('div');
    internalSpinner.className += "vjs-loading-spinner";
    spinnerDiv.appendChild(internalSpinner);

    var closeImgURL = chrome.extension.getURL("assets/images/button-x.png");
    close_buttonDiv = document.createElement('div');
    close_buttonDiv.setAttribute('style', 'display: block; width: 20px; height: 20px;cursor: pointer; position: relative; margin-top: -10px; margin-left: 40px; border: none; z-index: 2147483645; background-image: url("'+closeImgURL+'"); background-repeat: no-repeat; background-position: center center; background-size: 20px 20px;');
    close_buttonDiv.setAttribute('id', 'close-spinner-desktop');
    close_buttonDiv.onclick = function() {
      removeAll();
    };
    body = document.getElementsByTagName('body')[0];
    body.setAttribute('style', (body.getAttribute('style') || '') + ' overflow: hidden;');
    body.appendChild(spinnerDiv);
    spinnerDiv.appendChild(close_buttonDiv);
    body.appendChild(iframe);
  } else if (request.action === 'remove') {
    removeAll();
  } else if (request.action === 'unspin') {
    spinnerDiv = document.getElementById('waiting-spinner-desktop');
    spinnerDiv.parentNode.removeChild(spinnerDiv);
  }

});
