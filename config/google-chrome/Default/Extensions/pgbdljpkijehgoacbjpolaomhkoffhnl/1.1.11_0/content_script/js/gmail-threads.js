GmailThreads = {
  addIcons: function(sdk, token) {
    _this = this;

    // 1. We get all the IDs of the threads on the view
    _this.threadIds = new Array();
    _this.threadRowViews = new Array();
    sdk.Lists.registerThreadRowViewHandler(function(threadRowView) {
      _this.threadIds.push(threadRowView.getThreadID());
      _this.threadRowViews.push(threadRowView);
    });

    // 2. Every 1 second we fetch all the last IDs detected and integrate the buttons
    setInterval(function(){
      if (_this.threadIds.length) {
        var threadIds = _this.threadIds;
        var threadRowViews = _this.threadRowViews;
        _this.threadIds = [];
        _this.threadRowViews = [];

        $.getJSON(hunter_domain + "/message_status?token=" + token + "&thread_id=" + threadIds.join(","), function(response) {
          threadRowViews.forEach(function(threadRowView) {
            emails = response.data.messages.filter(o => o.thread_id === threadRowView.getThreadID());
            last_email = emails.sortBy(function(o){ return o.sent_at }).reverse()[0];

            if (emails.length > 0) {
              var iconUrl = _this.iconDisplayed(last_email.status);
              var statusInWords = _this.statusDisplayed(last_email);
            }

            var button = {
              iconUrl: iconUrl,
              hasDropdown: true,
              onClick: function(event) {
                // We have to redefine these variables inside the function since it can be called later
                emails = response.data.messages.filter(o => o.thread_id === threadRowView.getThreadID());
                last_email = emails.sortBy(function(o){ return o.sent_at }).reverse()[0];
                details_dom = "";

                event.dropdown.el.innerHTML = "\n\
                  <div class='hunter_status_dropdown' id='hunter_status_" + token + "'>\n\
                    <div class='hunter_status_title'>" + statusInWords + "</div>\n\
                    <div class='hunter_status_details'></div>\n\
                  </div>";

                if (emails.length > 0) {
                  console.log(last_email);
                  console.log(last_email.pixels_viewed.sortBy(function(o){ return o.time }).reverse());

                  last_email.pixels_viewed.sortBy(function(o){ return o.time }).reverse();
                  pixels_viewed = last_email.pixels_viewed.slice(0, 5);

                  _.each(pixels_viewed, function(pixel_viewed) {
                    $("#hunter_status_" + token + " .hunter_status_details").append("\n\
                      <p>\n\
                        <span class='hunter_status_device'>" + _this.deviceDisplayed(pixel_viewed) + "</span>\n\
                        <span class='hunter_status_time'>" + moment(pixel_viewed.time).fromNow().capitalize() + "</span>\n\
                      </p>");
                  });
                }

                if ($("#hunter_status_" + token + " .hunter_status_details").text() == "") {
                  $("#hunter_status_" + token + " .hunter_status_details").remove();
                }
              }
            };

            // We integrated the buttons
            threadRowView.addButton(button);
          });
        });
      }
    }, 500);


    // We open the popover on hover (the hover tiggers the click method)
    // setInterval() is used to be sure this event is declared when the icons are
    // correctly integrated. Once this is the case, we use clearInterval() to
    // stop the loop.
    //
    var intervalButtonThreadAction = setInterval(function(){
      if ($(".inboxsdk__thread_row .inboxsdk__button_icon").length) {
        //$(".inboxsdk__button_icon").off("mouseover mouseout")

        $(".inboxsdk__thread_row .inboxsdk__button_icon").mouseenter(function() {
          this_icon = $(this)
          if (!$(".hunter_status_dropdown").length) { this_icon.parent().click(); }
        }).mouseleave(function() {
          this_icon = $(this)
          timeoutId = setTimeout(function(){
            if ($(".hunter_status_dropdown").length) { this_icon.parent().click(); }
          }, 50);
        });
      }
    }, 100);
  },

  statusDisplayed: function(data) {
    if (typeof data.pixels_viewed !== "undefined") {
      switch (data.pixels_viewed.length) {
        case 1:   openedNumber = "one time"; break;
        default:  openedNumber = data.pixels_viewed.length + " times";
      }
    }
    switch (data.status) {
      case "not_tracked":   return "Email not tracked";
      case "tracked":       return "Email tracked but not opened yet";
      case "opened":        return "Email opened " + openedNumber;
      case "clicked":       return "Email opened " + openedNumber + " and clicked";
      default:              return "";
    }
  },

  iconDisplayed: function(status) {
    if (status == "opened" || status == "clicked")  { return chrome.extension.getURL('shared/img/icon_read.png'); }
    else                                            { return chrome.extension.getURL('shared/img/icon_tracked.png'); }
  },

  deviceDisplayed: function(pixel_viewed) {
    var md = new MobileDetect(pixel_viewed.user_agent);
    if (md.mobile() != null)        { return "<i class='fa fa-mobile'></i>" }
    else if (md.tablet() != null)   { return "<i class='fa fa-tablet'></i>" }
    else                            { return "<i class='fa fa-desktop'></i>" }
  }
}
