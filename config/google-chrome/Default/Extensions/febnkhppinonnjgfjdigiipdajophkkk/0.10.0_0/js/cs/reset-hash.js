document.body.setAttribute('data-clipbrd', 'installed');

window.addEventListener('message', function(message) {
  // We only accept messages from ourselves
  if (message.source != window)
    return;

  if (message.data.type && message.data.type == 'reset_hash') {
    var url = chrome.extension.getURL('/options.html');
    var hash = message.data.hash.substring(1);
    var params = hash.split('&').map(function(part) {
      return part.split('=')[1];
    });

    window.location.assign(url+'#reset/'+params[0]+'/'+params[1]);
  }
}, false);