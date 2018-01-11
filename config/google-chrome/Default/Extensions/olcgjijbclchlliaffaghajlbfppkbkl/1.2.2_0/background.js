var tabsid = new Array();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.greeting == "complete")
	{
		sendResponse({farewell: "OK"});
		chrome.browserAction.setIcon({path: 'icon48.png'});
		if (tabsid.indexOf(sender.tab.id) < 0)
			tabsid.push(sender.tab.id);
	}
	else
		chrome.browserAction.setIcon({path: 'icon19.png'});
	//console.log(tabsid);
});

chrome.tabs.onActivated.addListener(function(activeInfo){
	if (tabsid.indexOf(activeInfo.tabId) >= 0)
		chrome.browserAction.setIcon({path: 'icon48.png'});
	else
		chrome.browserAction.setIcon({path: 'icon19.png'});
	//console.log(activeInfo.tabId);
});

function onClickHandler(info, tab) {
	if (info.menuItemId == 'Sci-HubContextMenuitem') {
		if ( /10\.[0-9]{4,5}\/[^\s]+[^\.\s\)]+/.test(info.selectionText) || /[0-9]{8}/.test(info.selectionText) || info.selectionText.indexOf('dx.doi.org') >= 0 || info.selectionText.length >= 20 ) {
			chrome.storage.local.get({
				'Cserver' : 'sci-hub.tw'
				}, function(items) {
					var pubmed = "http://";
					if ( /[0-9]{8}/.test(info.selectionText) ) {
						pubmed = "http://www.ncbi.nlm.nih.gov.";
					};
					chrome.tabs.create({ url: pubmed + items.Cserver + '/' + info.selectionText });
				}
			);
		};
	};
};
chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.contextMenus.create({
	type: 'normal',
	title: chrome.i18n.getMessage('Sci_HubSearch') + ': %s',
	id: 'Sci-HubContextMenuitem',
	contexts:['selection']
});