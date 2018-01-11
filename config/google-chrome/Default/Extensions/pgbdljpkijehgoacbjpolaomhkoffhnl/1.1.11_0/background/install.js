// Open a tab when it's installed
//
chrome.runtime.onInstalled.addListener(function (object) {
  if (object.reason == "install") {
    chrome.tabs.create({ url: "https://mailtracker.hunter.io/get-started?utm_source=chrome_extension&utm_medium=extension&utm_campaign=extension&utm_content=new_install" });
  }
});
