var url = "https://www.googleapis.com/drive/v3/files?orderBy=viewedByMeTime+desc&pageSize=1&fields=files%2FwebViewLink,files%2Fname";
var method = 'GET';
var latestDocumentUrl;
var defaultTitle = 'Document not ready yet!';
var tabs = {}; // this object will hold a map of the open tabs and their URL, this is in order to get the URLs of the tabs when they are closed

// upon INSTALLATION - authenticate and update the icon to the latest document
chrome.runtime.onInstalled.addListener(function() {
  changeIconStatusAndName(false);
  getTokenAndUpdateRecentDocument(true);
});

// upon browser start - authenticate and update the icon to the latest document
chrome.windows.onCreated.addListener(function() {
  getTokenAndUpdateRecentDocument(true);
});

function getTokenAndUpdateRecentDocument(retry) {
  chrome.identity.getAuthToken({ 'interactive': true}, function (access_token) {
    if (chrome.runtime.lastError) {
      return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Authorization','Bearer ' + access_token);

    xhr.onload = function () {
      if (this.status === 401 && retry) {
        chrome.identity.removeCachedAuthToken( { 'token': access_token },getTokenAndUpdateRecentDocument(false));
        return;
      }

      updateRecentDocument(this.responseText);
    }
    xhr.send();
  });
}

function updateRecentDocument(responseText){
    if (responseText){
      var jsonResponse = JSON.parse(responseText);
      if (jsonResponse && jsonResponse.files && jsonResponse.files.length >= 1){
        latestDocumentUrl = jsonResponse.files[0].webViewLink;
        var latestDocumentName = jsonResponse.files[0].name;
        // when we have the latest document - update the icon to enabled
        changeIconStatusAndName(true,latestDocumentName);
      }
    }
}

// upon CLICK of the browser action - navigate to the latest document
chrome.browserAction.onClicked.addListener(function(tab) {
  if (latestDocumentUrl){
    chrome.tabs.create({
        url: latestDocumentUrl
    });
  }
});

function changeIconStatusAndName(enabled,title){
  chrome.tabs.getCurrent(function(tabId){
    var titleToSet;
    if (enabled){
      chrome.browserAction.enable(tabId);
      titleToSet = title
    }
    else{
      chrome.browserAction.disable(tabId);
      titleToSet = defaultTitle;
    }

    chrome.browserAction.setTitle({title : 'Go to : ' + titleToSet});

  })
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    tabs[tabId] = tab.url;
});

// When a tab is closed, check if it is docs.google / sheets.google / drive.google and update the last document accordingly
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    if (isDocument(tabs[tabId])){
      getTokenAndUpdateRecentDocument(true);
    }
    
    // Remove information for non-existent tab
    delete tabs[tabId];
});


function isDocument(url){
  if (url){
    lowerCaseUrl = url.toLowerCase();
    if (lowerCaseUrl.includes("docs.google.com") || lowerCaseUrl.includes("drive.google.com") || lowerCaseUrl.includes("sheets.google.com")){
      return true;
    }
  }
  return false;
}
