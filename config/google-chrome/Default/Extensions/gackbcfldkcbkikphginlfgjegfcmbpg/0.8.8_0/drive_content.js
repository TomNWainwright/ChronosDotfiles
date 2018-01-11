// Add a class to Drive body to declare that the extension is installed
var addClasses = function(receiver) {
  console.log("page detected");
  if (receiver) {
    console.log("adding class");
    receiver.className += 'has-chrome-extension';
    if (chrome.runtime.id) {
      receiver.dataset.extensionId = chrome.runtime.id;
    }
  }
}
var receiver = document.getElementById('app-root');
if (receiver) {
  addClasses(receiver);
} else {
  setTimeout(function() {
    receiver = document.getElementById('app-root');
    addClasses(receiver);
  }, 5000)
};
