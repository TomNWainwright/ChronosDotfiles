// Open a Drive tab (or the existing one) when the browser button is clicked
chrome.browserAction.onClicked.addListener(function(tab) {
  openOrFocusDriveTab();
});

// open or focus a product tab. Default is desktop.
var openOrFocusDriveTab = function(product) {
  var destUrl = 'https://home.dissident.ai';
  if (product) {
    switch (product) {
      case "social":
        destUrl = 'https://social.dissident.ai';
        break;
      case "library":
        destUrl = 'https://thelibrary.dissident.ai';
        break;
    }
  }
  chrome.tabs.query({ url: destUrl+'/*' }, function(windowTabs) {
    if (windowTabs && windowTabs.length) {
      chrome.tabs.highlight({ windowId: windowTabs[0].windowId, tabs: windowTabs[0].index }, function(browserWindow){
        chrome.windows.update(browserWindow.id, { focused: true }, function (){});
      });
    } else {
      chrome.tabs.create({ url: destUrl});
    }
  });
};


// Add a contextual menu to collect files (opens an iframe via the content script)
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  chrome.storage.sync.get({
    saveformat: "png"
  }, function(config) {
    var formatConfig = config.saveformat;
    var item = {};
    if (info.menuItemId.indexOf('link') !== -1) {
      item.url = info.linkUrl || info.srcUrl || info.pageUrl;
      item.type = "link";
    }else {
      item.url = info.srcUrl || info.linkUrl || info.pageUrl;
      item.type = info.mediaType || (!!info.pageUrl? (info.menuItemId === "save-audio-forced" ? 'audio':'webpage') : '');
    }
    if (item.type === "webpage") {
      item.exportType = formatConfig;
    }

    if (item.url) {
      // Context menu on a file
      item.name = decodeURIComponent(item.url.split("/").pop()) || 'webcontent';
      chrome.tabs.sendMessage(tab.id, {
        action: 'add',
        item:   item,
        edit:   info.menuItemId.match(/^edit/) !== null
      }, function(response) {});
    }
  });
});

//GraphQL query generator to upload the file
var createUploadQuery = function(connectionId, folderId, url, name, mime, convertFile) {
  return JSON.stringify({
    "query": "mutation CreateLeaf($connectionId: ID!, $parentNodeId: ID!, $name: String!, $mime: String!, $url: String, $size: String, $useMultipartFile: Boolean, $convertFile: String, $isFrom: String) {\
      createLeaf(connectionId: $connectionId, parentNodeId: $parentNodeId, name: $name, mime: $mime, fromUrl: $url, size: $size, useMultipartFile: $useMultipartFile, convertFile: $convertFile, isFrom: $isFrom) {\
        ... on NodeAndUser {\
          node {\
            id\
          }\
          __typename\
        }\
        ... on Ongoing {\
          ongoing\
          __typename\
        }\
        __typename\
      }\
    }",
    "variables": {
      "connectionId": connectionId,
      "parentNodeId": folderId || "root",
      "name": name || "untitled",
      "mime": mime,
      "url": url,
      "useMultipartFile":false,
      "size":null,
      "convertFile": convertFile,
      "isFrom": "extension"
    },
    "operationName":"CreateLeaf"
  });
}
// random init of a counter, to number the notifications without overlap between restarts of the extension (very unlikely)
var notificationCounter = Math.floor(Math.random() * 1073741824);

// sends graphQL file upload request and close modal on success
var uploadGql = function(destinationConnection, file, type) {
  var url = 'https://api.dissident.ai/graphql';
  var requestBody = createUploadQuery(destinationConnection, file.parentId, file.url, file.name, file.mime, file.convertFile || null);
  var myHeaders = new Headers({
    "Content-Type": "application/json",
  });
  var shortName = file.name.length <= 20? file.name : file.name.substr(0,20)+"...";
  fetch(url, {
    method: "POST",
    credentials: "include",
    headers: myHeaders,
    body: requestBody
  })
  .then(raw => {
    if (raw.status >= 400) {
      return Promise.reject("error sending the file");
    } else {
      return raw.json();
    }
  })
  .then(res => {
    var data = res.data;
    if ((data && data.createLeaf && data.createLeaf.node && data.createLeaf.node.id) || data.createLeaf.ongoing) {
      // upload went well
      return;
    } else {
      return Promise.reject("error saving the file");
    }
  })
  .then(() => {
    var message = "the file "+shortName+" was saved successfully!";
    if (type) {
      switch (type) {
        case 'audio':
          message = "the track "+shortName+" was saved successfully!";
          break;
        case 'video':
          message = "the video "+shortName+" was saved successfully!";
          break;
        case 'image':
          message = "the image "+shortName+" was saved successfully!";
          break;
        case 'webpage':
          message = "the page "+shortName+" was saved successfully!";
          break;
        case 'torrent':
          message = "the download of "+shortName+" started successfully!";
          break;
      }
    }
    chrome.notifications.create("desktopExtensionUploadComplete"+notificationCounter,{
      type: "basic",
      iconUrl: "assets/images/desktop-logo-64-complete.png",
      title: "Saved to Dissident",
      message: message,
      isClickable: true
    });
    notificationCounter++;
  }, (e) => {
    var message = "Error: "+shortName+" was not saved.";
    if (type) {
      switch (type) {
        case 'torrent':
          message = "Error: the download of "+shortName+" could not be started.";
          break;
      }
    }
    //there was an error during upload
    chrome.notifications.create("desktopExtensionUploadFailed"+notificationCounter,{
      type: "basic",
      iconUrl: "assets/images/desktop-logo-64-failed.png",
      title: "Failed to Save to Dissident",
      message: message,
      isClickable: true,
      buttons: [{
        title: "Retry",
      }]
    });
    notificationCounter++;
    console.error(e);
  });
}

//__INITIALISATION__
// Listen to event from external webpages
chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
  if (request.action) {// pipe to the page script
    chrome.tabs.sendMessage(sender.tab.id, {
      action:   request.action,
      external: request
    }, function(response) {});
  } else if (request.upload) {// background upoad request
    var file = request.upload.file;
    var destinationConnection = request.upload.destinationConnection;
    var type = request.upload.type;
    uploadGql(destinationConnection, file, type);
    chrome.tabs.sendMessage(sender.tab.id, { 'action': 'remove' }, function(response) {});
  } else if (request.goto) {// request to go to a product tab
    var product = request.goto.product.toLowerCase();
    openOrFocusDriveTab(product);
  } else if (request.message) {
    if (request.message == "version") {
      sendResponse({version: chrome.app.getDetails().version});
    }
  }
});
// init notification behavior
// retry on failed notif
chrome.notifications.onButtonClicked.addListener((notifId, buttonIdx) => {
  if (notifId.indexOf("desktopExtensionUploadFailed") === 0 && buttonIdx === 0) {
    uploadGql(destinationConnection, file);
  }
});
// clicking on the body of the notif takes you to the product
chrome.notifications.onClicked.addListener((notifId) => {
  if (notifId.indexOf("desktopExtensionUploadComplete") === 0 || notifId.indexOf("desktopExtensionUploadFailed") === 0) {
    openOrFocusDriveTab();
  }
});

// Create Chrome context menus for every type
var contexts = ['page', 'link', 'image', 'audio', 'video'];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  if (context === "page") {
    chrome.contextMenus.create({
      id: 'save-audio-forced',
      title: 'Save audio to Desktop',
      contexts: [context],
      documentUrlPatterns: ["*://*/*.mp3","*://*/*.wav","*://*/*.ogg","*://*/*.flac","*://*/*.aac","*://*/*.MP3","*://*/*.WAV"]
    });
    chrome.contextMenus.create({
      id: 'save-page-pdf',
      title: 'Save page to Desktop',
      contexts: [context]
    });
  } else if (context === "link") {
    chrome.contextMenus.create({
      id: 'save-link-magnet',
      title: 'Download to Desktop',
      contexts: [context],
      targetUrlPatterns: ["magnet:*"]
    });
    chrome.contextMenus.create({
      id: 'save-' + context,
      title: "Save link's target to Desktop",
      contexts: [context],
      targetUrlPatterns: ["http://*/*", "https://*/*", "ftp://*/*", "file://*/*" ]
    });
  } else {
    chrome.contextMenus.create({
      id: 'save-' + context,
      title: 'Save ' + context + ' to Desktop',
      contexts: [context],
    });

    if (context === 'image') {
        chrome.contextMenus.create({
        id: 'edit-' + context,
        title: 'Edit and save ' + context + ' to Desktop',
        contexts: [context]
      });
    }
  }
}
