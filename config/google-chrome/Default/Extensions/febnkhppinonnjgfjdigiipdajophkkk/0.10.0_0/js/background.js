var ba = chrome.browserAction;
var bg = chrome.extension.getBackgroundPage();
var clipboard = new Clipboard();

var api = new API({
  endpoint  : settings.get('endpoint')
, deviceId  : settings.get('deviceId')
, maxLength : settings.get('maxLength')
, email     : settings.get('authEmail')
, hash      : settings.get('authHash')
});

bg.window.addEventListener('offline', function () {
  api.enabled && (setStatusWaiting(), api.stop());
}, false);

bg.window.addEventListener('online', function () {
  api.enabled && (setStatusWaiting(), api.start());
}, false);

api.on('enable', function() {
  console.log('api: enable');
  clipboard.start();
  setStatusActive();
});

api.on('disable', function() {
  console.log('api: disable');
  setStatusInactive();
  clipboard.stop();
});

api.on('connecting', function() {
  console.log('api: connecting');
  setStatusWaiting();
});

api.on('err', function(err) {
  console.log('api: err', err);
  if (err.message === 'no_credentials') {
    window.open('/options.html#signup');
  }
  if (err.message === 'wrong_email_or_hash' ||
      err.message === 'Unauthorized') {
    settings.set('authEmail', null);
    settings.set('authHash', null);
    api.clearAuthCredentials();
    api.disable();
  }
});

api.on('sync', function(msg) {
  console.log('api: sync');

  if (!msg.iv) {
    _gaq.push(['_trackEvent', 'sync', 'incoming_failed_no_iv']);
    throw new Error('no_iv');
  }

  if (!msg.ct) {
    _gaq.push(['_trackEvent', 'sync', 'incoming_failed_no_ct']);
    throw new Error('no_ct');
  }

  var cryptoKey = settings.get('cryptoKey');

  if (!cryptoKey) {
    _gaq.push(['_trackEvent', 'sync', 'incoming_failed_no_crypto_key']);
    throw new Error('no_crypto_key');
  }

  var plaintext = '';

  try {
    plaintext = Crypto.decrypt(cryptoKey, msg.iv, msg.ct);
  } catch (e) {
    if (e instanceof sjcl.exception.corrupt) {
      _gaq.push(['_trackEvent', 'sync', 'incoming_failed_corrupt']);
      api.clearAuthCredentials();
      api.disable();
    } else {
      _gaq.push(['_trackEvent', 'sync', 'incoming_failed_unknown']);
      console.error(e);
    }
    return;
  }

  clipboard.set(plaintext);

  notify(
    'Received new clipboard'
   , plaintext.length + ' chars'
  );
});

clipboard.on('change', function(clipboard) {
  api.sync(clipboard);
});

function notify(ttl, msg) {
  if (settings.get('notifyPopup')) {
    var opt = {
      type: "basic",
      title: ttl,
      message: msg,
      iconUrl: 'img/icon-48x48.png'
    };
    chrome.notifications.create("", opt, function(notificationId) {
      setTimeout(function() {
        chrome.notifications.clear(notificationId, function(){});
      }, 5000);
    });
  }

  if (settings.get('notifySound')) {
    var sound = new Audio();
    sound.src = 'sound.ogg';
    sound.play();
  }
}

function setStatusActive() {
  updateBrowserActivity({
    icon: 'active',
    title: 'Online'
  });
}

function setStatusInactive() {
  updateBrowserActivity({
    icon: 'inactive',
    title: 'Offline'
  });
}

function setStatusWaiting() {
  updateBrowserActivity({
    icon: 'waiting',
    title: 'Connecting'
  });
}

function updateBrowserActivity(options) {
  if (options.icon) {
    ba.setIcon({
      path: {
        "19": "img/icon-" + options.icon + ".png",
        "38": "img/icon-" + options.icon + "@2x.png"
      }
    });
  }

  if (options.title) {
    ba.setTitle({
      title: options.title + ' - Clipbrd'
    });
  }
}

ba.onClicked.addListener(function() {
  if (api.enabled) {
    settings.set('enabled', false);
    api.disable();
  } else {
    settings.set('enabled', true);
    api.enable();
  }
});

$(function() {
  settings.get('enabled') && api.enable();
});
