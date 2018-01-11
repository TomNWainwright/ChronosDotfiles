// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var ENTRY_PAGE = "cws-index.html";
// var ENTRY_PAGE = "cws-build.html";

function makeURL(toolchain, config) {
	return ENTRY_PAGE+'?tc=' + toolchain + '&config=' + config;
}

function createWindow(url, launchData) {
	console.log('loading ' + url);
	chrome.app.window.create(url, {
		width: 1024,
		height: 800,
		frame: 'true',
		id: "MicNote_" + chrome.runtime.id,
	}, function (myWindow) {
		// // myWindow.contentWindow.addEventListener("homeReady", function(e) {
		// myWindow.contentWindow.addEventListener('load', function(e) {
		// 	myWindow.contentWindow.onLaunchData(launchData);
		// });
		if (myWindow.contentWindow.onLaunchData)
			myWindow.contentWindow.onLaunchData(launchData);
		else // launch by doulbe-clicking file.
			myWindow.contentWindow.appLaunchData = launchData;
	});    
}

function onLaunched(launchData) {
	// Send and XHR to get the URL to load from a configuration file.
	// Normally you won't need to do this; just call:
	//
	// chrome.app.window.create('<your url>', {...});
	//
	// In the SDK we want to be able to load different URLs (for different
	// toolchain/config combinations) from the commandline, so we to read
	// this information from the file "run_package_config".
	var xhr = new XMLHttpRequest();
	xhr.open('GET', './run_package_config', true);
	xhr.onload = function() {
		var toolchain_config = this.responseText.split(' ');
		createWindow(makeURL.apply(null, toolchain_config), launchData);
	};
	xhr.onerror = function() {
		// Can't find the config file, just load the default.
		createWindow(ENTRY_PAGE, launchData);
	};
	xhr.send();
}

chrome.app.runtime.onLaunched.addListener(onLaunched);
