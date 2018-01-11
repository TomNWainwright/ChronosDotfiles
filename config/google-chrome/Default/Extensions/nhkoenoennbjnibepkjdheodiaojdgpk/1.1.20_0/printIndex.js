"use strict";

// requirejs.config({
// 	paths: {
// 	},
// 	baseUrl: "",

// 	"shim": {
// 	},                
// });

// fix: text.js, Uncaught TypeError: require.nodeRequire is not a function
if (window.process)
	require.nodeRequire = require;

function getUrlParameter(sParam)
{
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');
	for (var i = 0; i < sURLVariables.length; i++) 
	{
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] == sParam) 
		{
			var v = sParameterName[1];
			v = decodeURIComponent(v);
			// http://stackoverflow.com/questions/2678551/when-to-encode-space-to-plus-or-20
			v = v.replace(/\+/g, " ");
			return v;
		}
	}
}

// requirejs(["purl"], function(purl) {
{
	var url = getUrlParameter("body");
	var title = getUrlParameter("title");

	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onload = function() {
		if (xhr.status === 0 || xhr.status === 200)
			onLoadedBody(xhr.responseText);
	};
	xhr.onerror = function() {
		console.error("error");
	};
	xhr.send();

	function onLoadedBody(bodyHtml) {
		document.getElementsByTagName("title")[0].innerHTML = title;
		document.getElementsByTagName("body")[0].innerHTML = bodyHtml;

		var images = document.getElementsByTagName("img");
		var loadedNum = 0;
		var bPrintShown = false;
		for (var i = 0; i < images.length; ++i) {
			var img = images[i];
			img.addEventListener("load", function(e) {
				loadedNum ++;
				if (loadedNum === images.length) {
					onNoteReady();
				}
			});
		}

		if (images.length) {
			setTimeout(function() {
				if (!bPrintShown)
					onNoteReady();
			}, 5000);
		}
		else
			onNoteReady();
		
		function onNoteReady() {
			setTimeout(function() {
				window.print();
			}, 500); // timeout is need edfor node
			bPrintShown = true;
		};
	}
}
