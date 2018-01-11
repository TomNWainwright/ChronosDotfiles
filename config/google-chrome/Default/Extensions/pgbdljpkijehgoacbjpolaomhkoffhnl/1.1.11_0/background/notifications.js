// Refresh inverval in seconds
//
function getRefreshInterval(fn) {
  chrome.storage.sync.get({ "last_tracked_email_date" : 0 }, function(value) {
    time_since_last_email = Date.now() - value.last_tracked_email_date; // in milliseconds

    if (time_since_last_email < 1000 * 60 * 60)  { // last hour
       fn(5); // every 5 seconds
    }
    else if (time_since_last_email < 1000 * 60 * 60 * 24) { // last day
       fn(30); // every 30 seconds
    }
    else if (time_since_last_email < 1000 * 60 * 60 * 24 * 7) { // last week
       fn(60); // every minute
    }
    else {
       fn(60 * 5); // every 5 minutes
    }
  });
}

function sendBasicNotification(title, message, contextMessage) {
  notificationId = 'open-notification-' + Date.now();
  chrome.notifications.create(
    notificationId, {
      type: 'basic',
      iconUrl: chrome.extension.getURL("shared/img/icon320.png"),
      title: title,
      message: message,
      contextMessage: contextMessage,
      eventTime: Date.now()
    },
    function() {
      setTimeout(function(){ chrome.notifications.clear(notificationId) }, 10000);
    }
  );
}

function sendListNotification(title, listItems) {
  notificationId = 'open-notification-' + Date.now();
  chrome.notifications.create(
    notificationId, {
      type: 'list',
      iconUrl: chrome.extension.getURL("shared/img/icon320.png"),
      title: title,
      message: "",
      eventTime: Date.now(),
      items: listItems
    },
    function() {
      setTimeout(function(){ chrome.notifications.clear(notificationId) }, 10000);
    }
  );
}

function sendNotifications() {
  getRefreshInterval(function(interval) {
    chrome.storage.sync.get({ 'last_email_used': false, 'notifications_activated': false }, function(value){
      if (value.notifications_activated && value.last_email_used) {
        Account.getTokenFor(value.last_email_used, function(token) {
          $.ajax({
            type: "GET",
            url: hunter_domain + "/activity?token="+token+"&seconds=" + interval,
            dataType : 'json',
            success: function(json){

              // Rewrite the JSON for testing purposes
              // -- Case with 1 emails read
              // json = JSON.parse('{"data":[{"tracking_id":"HqtD21GghvL6sJoVqEug","time":"2017-02-23T18:11:56.271Z","type":"pixel","message_subject":"This is the title of the email sent","message_recipients":"Antoine Finkelstein \u003cantoine@hunter.io\u003e","message_from":"Antoine Finkelstein \u003cantoine@hunter.io\u003e"}]}');
              // -- Case with 2 emails read
              // json = JSON.parse('{"data":[{"tracking_id":"HqtD21GghvL6sJoVqEug","time":"2017-02-23T18:11:56.271Z","type":"pixel","message_subject":"This is the title of the email sent","message_recipients":"Antoine Finkelstein \u003cantoine@hunter.io\u003e","message_from":"Antoine Finkelstein \u003cantoine@hunter.io\u003e"}, {"tracking_id":"HqtD21GghvL6sJoVqEug","time":"2017-02-23T18:11:56.271Z","type":"pixel","message_subject":"How are you?","message_recipients":"François Grante \u003cfrancois@hunter.io\u003e","message_from":"Antoine Finkelstein \u003cantoine@hunter.io\u003e"}]}');
              // -- Case with the same email read 2 times
              // json = JSON.parse('{"data":[{"tracking_id":"HqtD21GghvL6sJoVqEug","time":"2017-02-23T18:11:56.271Z","type":"pixel","message_subject":"This is the title of the email sent","message_recipients":"Antoine Finkelstein \u003cantoine@hunter.io\u003e","message_from":"Antoine Finkelstein \u003cantoine@hunter.io\u003e"}, {"tracking_id":"HqtD21GghvL6sJoVqEug","time":"2017-02-23T18:11:56.271Z","type":"pixel","message_subject":"This is the title of the email sent","message_recipients":"Antoine Finkelstein \u003cantoine@hunter.io\u003e","message_from":"Antoine Finkelstein \u003cantoine@hunter.io\u003e"}]}');

              // We remove the duplicates: we display only one time the same email opened several times
              var emails = _.uniq(json.data, 'message_recipients');

              if (emails.length == 1) {
                email = emails[0];
                sendBasicNotification(
                  "Email opened",
                  email.message_subject,
                  email.message_recipients
                );
              }
              else if (emails.length > 1) {
                listItems = new Array;
                _.each(emails, function(pixel_viewed) {
                  listItems.push({ title: pixel_viewed.message_subject, message: pixel_viewed.message_recipients })
                });
                sendListNotification(
                  emails.length + " emails opened",
                  listItems
                );
              }
            }
          });
        });
      }
    });

    setTimeout(function(){ sendNotifications(); }, interval * 1000);
  });
}

// We launch the loop the first time
sendNotifications();
