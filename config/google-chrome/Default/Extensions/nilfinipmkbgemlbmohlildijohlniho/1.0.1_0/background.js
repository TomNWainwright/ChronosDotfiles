/** Array of details for chrome.tabs.executeScript. */
var pendingScriptDetails = [];
var executingTabId;

/**
 * Executes the list of scripts.
 */
function executeScripts() {
  if (pendingScriptDetails.length) {
    var scriptDetail = pendingScriptDetails.pop();
    if (scriptDetail.url) {
      chrome.tabs.update(executingTabId, scriptDetail);
    } else if (scriptDetail.code) {
      var jqueryFile = {file: 'jquery-1.7.2.min.js'};
      chrome.tabs.executeScript(executingTabId, jqueryFile, function() {
        chrome.tabs.executeScript(executingTabId, scriptDetail);
      });
    }
  }
};

/**
 * Listens to the tabs updated event.
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (executingTabId == tabId && changeInfo.status == 'complete') {
    executeScripts();
  }
});

/**
 * Listens to the events from the popup.
 */
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  pendingScriptDetails = request.scriptDetails;
  executingTabId = request.tabId;
  executeScripts();
});