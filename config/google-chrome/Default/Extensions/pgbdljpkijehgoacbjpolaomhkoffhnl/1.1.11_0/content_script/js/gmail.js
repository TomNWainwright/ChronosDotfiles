Gmail = {
  launchMailTracker: function(sdk) {
    _this = this;
    email = sdk.User.getEmailAddress().toLowerCase();

    // We start the integration in Gmail if the Google account is connected.
    // If not we ask the user to do so.
    Account.getTokenFor(email, function(token) {
      if (token == null || token == "") {

        var obj = {};
        obj["google_connect_wait_until:" + email] = 0;
        chrome.storage.sync.get(obj, function(date) {
          if (Date.now() > date["google_connect_wait_until:" + email]) {
            _this.askConnectGoogle(email);
          }
        });
      }
      else {
        chrome.storage.sync.get({ 'usage_count': 0, 'is_review_given': false }, function(value){
          if (value.usage_count >= 10 && !value.is_review_given) {
            _this.askFeedback();
          }

          GmailCompose.addButton(sdk, token);
          GmailThreads.addIcons(sdk, token);
          GmailConversation.addSideInformation(sdk, token);
        });
      }
    });
  },

  askConnectGoogle: function(email) {
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();

    $("body").append('<div id="hunter_popup_overlay"></div>');

    $("#hunter_popup_overlay")
      .css({
        'opacity' : 0.4,
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'background-color': 'black',
        'width': '100%',
        'height': '100%',
        'z-index': 11000
    });

    $("body").append('\n\
      <div id="hunter_popup_container">\n\
        <span id="hunter_popup_close">&times;</span>\n\
        <img src="' + chrome.extension.getURL('shared/img/mailtracker_logo.png') + '">\n\
        <h1>Please activate your account for <strong>' + email + '</strong></h1>\n\
        <a id="signin_cta" href="' + hunter_domain + '/signin?utm_source=chrome_extension&utm_medium=extension&utm_campaign=extension&utm_content=connect_popup">Activate Mailtracker</a>\n\
        <div class="hunter_later_links">\n\
          <span id="hunter_ask_later">Remind me next week</span>\n\
          <span id="hunter_never_ask">Never for this account</span>\n\
        </div>\n\
      </div>\n\
    ');

    $("#hunter_popup_container")
      .css({
        'position': 'fixed',
        'top': windowHeight / 2 - 200,
        'left': windowWidth / 2 - 300,
        'width': '520px',
        'z-index': 11001
    });

    $("#hunter_popup_close, #hunter_popup_overlay").on("click", function() {
      $("#hunter_popup_overlay, #hunter_popup_container").fadeOut();
    });

    $("#hunter_ask_later").on("click", function() {
      var obj = {};
      obj["google_connect_wait_until:" + email] = Date.now() + 86400 * 7 * 1000;
      chrome.storage.sync.set(obj, function() {
        $("#hunter_popup_overlay, #hunter_popup_container").fadeOut();
      });
    });

    $("#hunter_never_ask").on("click", function() {
      var obj = {};
      obj["google_connect_wait_until:" + email] = Date.now() + 86400 * 365 * 3 * 1000;
      chrome.storage.sync.set(obj, function() {
        $("#hunter_popup_overlay, #hunter_popup_container").fadeOut();
      });
    });
  },

  askFeedback: function(email) {
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();

    chrome.storage.sync.set({ 'is_review_given': true });
    $("body").append('<div id="hunter_popup_overlay"></div>');

    $("#hunter_popup_overlay")
      .css({
        'opacity' : 0.4,
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'background-color': 'black',
        'width': '100%',
        'height': '100%',
        'z-index': 11000
    });

    $("body").append('\n\
      <div id="hunter_popup_container">\n\
        <span id="hunter_popup_close">&times;</span>\n\
        <img src="' + chrome.extension.getURL('shared/img/mailtracker_logo.png') + '">\n\
        <h1>Are you satisfied by MailTracker?</strong></h1>\n\
        <div class="hunter_feedback_buttons">\n\
          <a id="hunter_feedback_yes">Yes</a>\n\
          <a id="hunter_feedback_no">No</a>\n\
        </div>\n\
      </div>\n\
    ');

    $("#hunter_popup_container")
      .css({
        'position': 'fixed',
        'top': windowHeight / 2 - 200,
        'left': windowWidth / 2 - 300,
        'width': '520px',
        'z-index': 11001
    });

    $("#hunter_feedback_yes").on("click", function() {
      $("#hunter_popup_container h1").text("MailTracker is a free tool. We would be extremely thankful if you rate it in the Chrome Web Store!");
      $(".hunter_feedback_buttons").html("<a href='https://chrome.google.com/webstore/detail/mailtracker-for-gmail/pgbdljpkijehgoacbjpolaomhkoffhnl/reviews' target='_blank'>Add a review</a>");
    });

    $("#hunter_feedback_no").on("click", function() {
      $("#hunter_popup_container h1").text("Thank you for your feedback.");
      $(".hunter_feedback_buttons").remove();
      $("#hunter_popup_overlay, #hunter_popup_container").delay(2000).fadeOut();
    });

    $("#hunter_popup_close, #hunter_popup_overlay").on("click", function() {
      $("#hunter_popup_overlay, #hunter_popup_container").fadeOut();
    });
  }
}

InboxSDK.load("1.0", "sdk_bonjour_1f71e0f4ac").then(function(sdk){
  Gmail.launchMailTracker(sdk);

  chrome.storage.sync.set({ "last_email_used": sdk.User.getEmailAddress() });
});
