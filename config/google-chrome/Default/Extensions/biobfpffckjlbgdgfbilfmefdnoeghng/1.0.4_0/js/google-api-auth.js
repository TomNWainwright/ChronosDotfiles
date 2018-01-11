var AUTH_TOKEN;

function showAuthFailNotification(error) {
    chrome.notifications.create(
        'auth-error', {
            'type': 'basic',
            'iconUrl': 'img/evelopers-logo.png', // Relative to Chrome dir or remote URL must be whitelisted in manifest.
            'title': 'Todos backed with sheet',
            'message': 'Fail to obtain authentication from google',
            'isClickable': false,
        }
    );
}

function getAuthToken(initCallBack) {
    chrome.identity.getAuthToken({ 'interactive': false }, function(token) {
        if (chrome.runtime.lastError) {
            chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
                if (chrome.runtime.lastError) {
                    showAuthFailNotification(chrome.runtime.lastError);
                } else {
                    AUTH_TOKEN = token;
                    initCallBack();
                }
            });
        } else {
            AUTH_TOKEN = token;
            initCallBack();
        }
    });
}