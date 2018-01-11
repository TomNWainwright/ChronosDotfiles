// Saves options to chrome.storage.sync.
function save_options() {
  var saveformat = document.getElementById("saveformat").value;
  chrome.storage.sync.set({
    saveformat: saveformat,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('save');
    save.textContent = 'Saved!';
    setTimeout(function() {
      status.textContent = 'Save';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value saveformat = 'png'.
  chrome.storage.sync.get({
    saveformat: 'png',
  }, function(items) {
    document.getElementById('saveformat').value = items.saveformat;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
