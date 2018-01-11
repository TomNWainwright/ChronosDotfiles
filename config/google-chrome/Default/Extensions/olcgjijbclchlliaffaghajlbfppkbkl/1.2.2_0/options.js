function save_options() {
  var server = document.getElementById('server').value;
  chrome.storage.local.set({ 'Cserver' : server }, function() {
    var status = document.getElementById('status');
    status.textContent = chrome.i18n.getMessage('SaveOption');
    setTimeout(function() {
		status.textContent = ''; }, 750);
  });
}

function restore_options() {
  chrome.storage.local.get({
    'Cserver' : 'sci-hub.tw'
  }, function(items) {
    document.getElementById('server').value = items.Cserver;
  });
}

function localizeHtmlPage() {
    document.getElementById('title').textContent = chrome.i18n.getMessage('Customize');
	document.getElementById('content').textContent = chrome.i18n.getMessage('Customize');
	document.getElementById('save').textContent = chrome.i18n.getMessage('Saves');
}
window.onload = function() {
  localizeHtmlPage();
  restore_options();
}
document.getElementById('save').addEventListener('click', save_options);