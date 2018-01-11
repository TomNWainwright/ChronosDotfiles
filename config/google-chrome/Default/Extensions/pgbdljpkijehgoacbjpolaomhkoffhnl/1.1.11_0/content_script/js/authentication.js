function extractAuthentication() {
  account = document.getElementById("google_account_info").innerHTML;

  Account.updateTrackedGoogleAccount(JSON.parse(account));
}

if (location.protocol + '//' + location.host + location.pathname == hunter_domain + "/messages") {
  extractAuthentication();
}
