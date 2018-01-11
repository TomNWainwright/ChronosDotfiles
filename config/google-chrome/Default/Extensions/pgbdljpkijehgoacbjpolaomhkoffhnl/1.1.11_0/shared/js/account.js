var Account = {
  updateTrackedGoogleAccount: function(account) {

    var obj = {};
    obj["token:" + account.email] = account;
    chrome.storage.sync.set(obj);
    chrome.storage.sync.set({ "last_email_connected": account.email });
  },

  getTokenFor: function(email, fn) {
    var obj = {};
    obj["token:" + email] = false;

    chrome.storage.sync.get(obj, function(value) {
      if (value != false) {
        token = value["token:" + email]["token"];
      } else {
        token = "";
      }

      fn(token)
    });
  }
}
