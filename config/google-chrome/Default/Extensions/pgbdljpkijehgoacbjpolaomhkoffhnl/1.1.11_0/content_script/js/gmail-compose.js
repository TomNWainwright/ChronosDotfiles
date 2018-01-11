GmailCompose = {
  addButton: function(sdk, token) {

    // We prepare to edit the email when the user send it
    this.trackEmail(sdk, token);

    // This buttons enables or disables the tracking
    sdk.Compose.registerComposeViewHandler(function(composeView) {

      var emitter;
      var stream = Kefir.stream(function(inEmitter){
        emitter = inEmitter;
        return function(){};
      });

      composeView.addButton(stream); //add the label passing in the stream

      emitter.emit({
        title: "Tracking is currently on",
        iconUrl: chrome.extension.getURL('shared/img/icon_compose_tracked.png'),
        onClick: function(event) {
          if (window.hunter_tracking_activated == true) {
            window.hunter_tracking_activated = false;
            emitter.emit({
              title: "Tracking is currently off",
              iconUrl: chrome.extension.getURL('shared/img/icon_compose_not_tracked.png')
            });
          }
          else {
            window.hunter_tracking_activated = true;
            emitter.emit({
              title: "Tracking is currently on",
              iconUrl: chrome.extension.getURL('shared/img/icon_compose_tracked.png')
            });
          }
        }
      });
    });
  },

  trackEmail: function(sdk, token) {
    sdk.Compose.registerComposeViewHandler(function(composeView){
      composeView.on("presending", function(event) {

        // If the user doesn't want the email to be tracked, we do nothing.
        if (window.hunter_tracking_activated == true) {
          randomID = generateRandomID();
    			messageHTML = this.getBodyElement();
          messageHTMLString = messageHTML.innerHTML;

          // First, we search for URLs in the body. Gmail will make them clickable
          // automatically, but we have to do it oursleves before to make sure
          // they are also tracked.
          messageHTMLString = replaceURLWithHTMLLinks(messageHTMLString);
          var $html = $('<div />', { html: messageHTMLString });

          // Then we replace all the link destinations by tracked links
    			$html.find("a").each(function() {
            // If the link isn't already tracked
            url = $(this).attr("href");
            if (url.indexOf("https://mltrk.io/link/") == -1) {
              new_url = "https://mltrk.io/link/" + encodeURIComponent(url) + "/" + randomID;
              $(this).attr("href", new_url);
            }
    			});

          messageHTMLString = $html.html();

          // Finally, we add a one-pixel image that will be called when the email
          // is opened.
    			this.setBodyHTML(messageHTMLString + "<img src='https://mltrk.io/pixel/" + randomID + "?rid=" + randomID + "' width='1' height='1' border='0' />");
        }
      });

  		composeView.on("sent", function(event) {
        // If the user doesn't want the email to be tracked, we do nothing.
        if (window.hunter_tracking_activated == true) {
          $.ajax({
    			  type: "POST",
    			  url: hunter_domain + "/messages_sent",
    			  data: {
    					thread_id: event.threadID,
    					message_id: event.messageID,
    					user_email: sdk.User.getEmailAddress(),
              token: token
    				},
    			  dataType: "JSON"
    			});

          countUsage();
          chrome.storage.sync.set({ "last_tracked_email_date": Date.now() });
        }
      });
  	});
  }
}
