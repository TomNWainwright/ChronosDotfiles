window.Polymer = window.Polymer || {};
//window.Polymer.dom = 'shady';
window.Polymer.dom = 'shadow';

document.addEventListener('WebComponentsReady', function webcomponentsready() {
	console.log("WebComponentsReady");

	debugger;
	document.removeEventListener('WebComponentsReady', webcomponentsready, false);

	var refScript = document.getElementsByTagName('script')[0];

	var vendorScript = document.createElement('script');
	vendorScript.onload = function() {
		// fix: occasionally, chrome.runtime.getMinifest is empty, seems a timing game.
		// old: doLoadMain()
		// new:
		// function retry()
		// {
		// 	if (chrome.runtime && chrome.runtime.getMinifest && chrome.runtime.getPlatformInfo) {
		// 		doLoadMain();
		// 	}
		// 	else
		// 		setTimeout(retry, 10);			
		// }

		doLoadMain();
		// setTimeout(() => {
		// 	debugger;
		// 	// retry();
		// 	if (chrome.runtime.getManifest)
		// 		console.debug("getManifest is not null");
		// 	else
		// 		console.debug("getManifest is null");
		// 	debugger;
		// 	if (chrome.runtime.getManifest)
		// 		console.debug("getManifest is not null");
		// 	else
		// 		console.debug("getManifest is null");
				
		// 	doLoadMain();
		// }, 5000);
	};
                          
	vendorScript.src = './dist/vendor_lib.bundle.js';
	refScript.parentNode.insertBefore(vendorScript, refScript);
	

}, false);

function doLoadMain()
{
	var refScript = document.getElementsByTagName('script')[0];
	var script = document.createElement('script');
	script.src = './dist/main.bundle.js';
	refScript.parentNode.insertBefore(script, refScript);

}
