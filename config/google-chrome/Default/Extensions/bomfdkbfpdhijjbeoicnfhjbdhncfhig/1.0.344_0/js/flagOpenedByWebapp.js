/*
 *  flagOpenedByWebapp - this script is injected into pubview tabs to
 *  indicate that the tab was opened via a webapp. We have to use the
 *  same approach here as with the chrome-bridge javascript,
 *  e.g. insert a hidden <div> into the document body. This div is
 *  picked up by
 *  Paperpile.view.pubview.TopToolbar#tabWasOpenedFromWebapp, which is
 *  used to determine whether to show a "View in Paperpile" or "Back
 *  to Paperpile" button.
 *
 *  This roundabout approach to flagging a webapp-opened pubview tab
 *  is necessary in order to use chrome.tabs.open() to open pubview
 *  tabs behind the webapp tab on ctrl-click.
 */

function init() {
  var hiddenNode = document.createElement('div');
  hiddenNode.id = 'pp-opened-from-webapp';
  hiddenNode.style.display = 'none';
  document.body.appendChild(hiddenNode);
}

if (/loaded|complete|interactive/.test(document.readyState)) {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
