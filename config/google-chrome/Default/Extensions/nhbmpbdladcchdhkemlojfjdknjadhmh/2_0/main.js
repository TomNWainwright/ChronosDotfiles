chrome.app.runtime.onLaunched.addListener(() => {
  // crosh built-in: chrome-extension://nkoccljplnhpfnfiajclkommnmllphnl/
  // Secure Shell: chrome-extension://pnhechapfaindjhompbnflcldabbghjo/
  // Ssh dev: chrome-extension://okddffdblfhhnmhodogpojmfkjmhinfp/
  window.open(
      'chrome-extension://pnhechapfaindjhompbnflcldabbghjo/html/crosh.html', '',
      'chrome=no,close=yes,resize=yes,scrollbars=yes,minimizable=yes,' +
      'width=735,height=440,background');
  // Note: "background" here (and in the manifest) are to workaround
  // https://crbug.com/708870.  Once that hits stable, we can drop it.
});
