GmailConversation = {
  addSideInformation: function(sdk, token) {
    var _this = this;

    sdk.Conversations.registerThreadViewHandler(function(threadView) {
      var mailTrackerSideBar = document.createElement("div");
      mailTrackerSideBar.setAttribute("id", "hunter_conversation_sidebar");
      const sidebar = threadView.addSidebarContentPanel({
        el: mailTrackerSideBar,
        title: "",
        iconUrl: ""
      });

      sidebar.once('activate', () => {
        _this.addContent(threadView.getThreadID(), token);
        _this.preventAutoTrack(threadView.getThreadID(), token);
      });
    })
  },

  addContent: function(threadId, token) {
    var _this = this;

    console.log(document.getElementById("hunter_conversation_sidebar"));

    $("#hunter_conversation_sidebar").html('\n\
      <h1>\n\
        <img src="' + chrome.extension.getURL('shared/img/icon_tracked.png') + '" id="hunter_conversation_sidebar_icon" />\n\
        MailTracker\n\
      </h1>\n\
      <div id="hunter_conversation_status">\n\
        <span class="hunter_conversation_blank_status">Loading MailTracker...</span>\n\
      </div>\n\
      <div id="hunter_conversation_content"></div>\n\
    ');

    $.getJSON(hunter_domain + "/message_status?token=" + token + "&thread_id=" + threadId, function(data) {
      if (data.data.messages.length > 0) {

        // Select the last email
        data.data.messages.sortBy(function(o){ return o.sent_at }).reverse();
        last_email = data.data.messages[0];

        // Put a green icon if the last email has been opened
        if (last_email.status == "opened" || last_email.status == "clicked") {
          $("#hunter_conversation_sidebar_icon").attr("src", chrome.extension.getURL('shared/img/icon_read.png'))
        }

        // Display the main status of the last email
        var statusInWords = _this.statusDisplayed(last_email, data.data.messages.length);
        $("#hunter_conversation_status").html(statusInWords);

        // Order the tracked pixel and display the events
        last_email.pixels_viewed.sortBy(function(o){ return o.time }).reverse();
        _.each(last_email.pixels_viewed, function(pixel_viewed) {
          device = _this.deviceDisplayed(pixel_viewed);
          city = _this.locationDisplayed(pixel_viewed);
          $("#hunter_conversation_content").append("\n\
            <p>\n\
              <span class='hunter_conversation_device'>" + device + "</span>\n\
              <span class='hunter_conversation_time'>" + moment(pixel_viewed.time).fromNow().capitalize() + "</span>\n\
              <br>\n\
              " + city + "\n\
            </p>");
        });
      }
      else {
        $("#hunter_conversation_status").html("<span class='hunter_conversation_blank_status'>Nothing tracked.</span>");
      }
    });
  },

  deviceDisplayed: function(pixel_viewed) {
    var md = new MobileDetect(pixel_viewed.user_agent);
    if (md.mobile() != null)        { return "<i class='fa fa-mobile'></i>" }
    else if (md.tablet() != null)   { return "<i class='fa fa-tablet'></i>" }
    else                            { return "<i class='fa fa-desktop'></i>" }
  },

  statusDisplayed: function(data, emails_sent_number) {
    if (typeof data.pixels_viewed !== "undefined") {
      switch (data.pixels_viewed.length) {
        case 1:   openedNumber = "one time"; break;
        default:  openedNumber = data.pixels_viewed.length + " times";
      }
    }
    if (emails_sent_number > 1)   { noun = "Last email"; }
    else                          { noun = "Email"; }

    switch (data.status) {
      case "not_tracked":   return "<span class='hunter_conversation_blank_status'>" + noun + " not tracked.</span>";
      case "tracked":       return "<span class='hunter_conversation_blank_status'>" + noun + " tracked but not opened yet.</span>";
      case "opened":        return noun + " opened " + openedNumber;
      case "clicked":       return noun + " opened " + openedNumber + " and clicked";
      default:              return "";
    }
  },

  locationDisplayed: function(pixel_viewed) {
    location_array = new Array;

    if (pixel_viewed.gmail == false) {
      if (pixel_viewed.city != null && pixel_viewed.city != "") {
        location_array.push(pixel_viewed.city);
      }

      if (pixel_viewed.country != null && pixel_viewed.country != "") {
        location_array.push(getCountryName(pixel_viewed.country));
      }

      return "<span class='hunter_conversation_city'>" + location_array.join(", ") + "<span>";
    }

    return "";
  },

  preventAutoTrack: function(threadId, token) {
    $.getJSON("https://mailtracker.hunter.io/ignore_opens?token=" + token + "&thread_id=" + threadId, function(data) {
      // The URL is pinged to indicate we don't want to save tracking here (auto tracking)
    });
  }
}
