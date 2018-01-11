// Activate the notifications or not
//
document.querySelector('#activate-notifications').addEventListener('click', function(event) {
  chrome.storage.sync.get({ "notifications_activated" : false}, function(value) {
    if(value.notifications_activated) {
      chrome.storage.sync.set({ "notifications_activated": false });
      document.getElementById("activate-notifications").innerHTML = "<i class='fa fa-bell-o'></i> Activate notifications";
    }
    else {
      chrome.permissions.request({
        permissions: ['notifications']
      }, function(granted) {
        if (granted) {
          chrome.storage.sync.set({ "notifications_activated": true });
          document.getElementById("activate-notifications").innerHTML = "<i class='fa fa-bell-slash-o'></i> Disable notifications";
        }
      });
    }
  });
});

// Display the right button on load
//
chrome.storage.sync.get({ "notifications_activated" : false}, function(value) {
  if(value.notifications_activated) {
    document.getElementById("activate-notifications").innerHTML = "<i class='fa fa-bell-slash-o'></i> Disable notifications";
  }
  else {
    document.getElementById("activate-notifications").innerHTML = "<i class='fa fa-bell-o'></i> Activate notifications";
  }
});

// Display the connected account
//
chrome.storage.sync.get({ "last_email_connected" : false, "last_email_used" : false }, function(account) {
  // If there is no last account connected, we ask to connect
  if (account.last_email_connected) {
    // If there is a last account used, we check if it's connected or not
    if (account.last_email_used) {
      Account.getTokenFor(account.last_email_used, function(token) {
        if (token == null || token == "") {
          displayConnexionWarning(account.last_email_used);
        }
        else {
          displayConnectedAccount(account.last_email_connected);
        }
      });
    }
    else {
      displayConnectedAccount(account.last_email_connected);
    }
  }
  else {
    displayConnexionWarning();
  }
});

function displayConnectedAccount(email) {
  document.getElementById("activated-notification").style.display = "block";
  document.getElementById("connected-account").style.display = "block";
  document.getElementById("connected-account").innerHTML = email + "<span class='separator'>•</span><a href='https://mailtracker.hunter.io/messages?connexion_email=" + email + "&utm_source=chrome_extension&utm_medium=extension&utm_campaign=extension&utm_content=browser_popup' target='_blank'>Dashboard</a>";
}

function displayConnexionWarning(email = null) {
  if (email != null) {
    document.getElementById("not-connected-message").innerHTML = "Sign in with <strong>" + email + "</strong> to activate MailTracker.";
  }
  else {
    document.getElementById("not-connected-message").innerHTML = "Please connect your account to activate MailTracker";
  }
  document.getElementById("not-connected-notification").style.display = "block";
}
