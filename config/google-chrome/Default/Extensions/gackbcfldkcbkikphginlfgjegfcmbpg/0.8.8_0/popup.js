const focusTab = function(url) {
  chrome.tabs.query({ url: `${url}/*` }, function(windowTabs) {
    if (windowTabs && windowTabs.length) {
      chrome.tabs.highlight({ windowId: windowTabs[0].windowId, tabs: windowTabs[0].index }, function(browserWindow){
        chrome.windows.update(browserWindow.id, { focused: true }, function (){});
      });
    } else {
      chrome.tabs.create({url: url});
    }
  });
};

const openOrFocusDriveTab = function(url) {
  chrome.storage.local.get("tabs", function(result) {
    if (result && result.tabs) {
      focusTab(url);
    } else {
      chrome.permissions.contains({
        permissions: ['tabs']
      }, function(contains) {
        if (contains) {
          focusTab(url);
          // The extension has the permissions.
        } else {
          chrome.permissions.request({
            permissions: ['tabs']
          }, function(granted) {
            // store if granted or denied
            chrome.storage.local.set({tabs: granted?"granted":"denied"});
            focusTab(url);
          });
        }
      });
    }
  });
};
document.getElementById("desktop").addEventListener("click", function(){
  openOrFocusDriveTab("https://home.dissident.ai");
});
document.getElementById("social").addEventListener("click", function(){
  openOrFocusDriveTab("https://social.dissident.ai");
});
document.getElementById("library").addEventListener("click", function(){
  openOrFocusDriveTab("https://thelibrary.dissident.ai");
});
