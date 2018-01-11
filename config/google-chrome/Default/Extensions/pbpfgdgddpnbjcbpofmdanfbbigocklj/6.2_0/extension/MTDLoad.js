// MTDLoad.js
// Copyright (c) 2017 Ryan Dolan (dangered wolf)

"use strict";

var InjectScript2 = document.createElement("script");
InjectScript2.src = "https://cdn.ravenjs.com/3.19.1/raven.min.js";
InjectScript2.type = "text/javascript";
document.head.appendChild(InjectScript2);

var s={},C="Storage",s="script",u="sources/",S=".css",d=document,H=d.head,x="ModernDeck",X="moderndeck",Y="MTDinject",l=d.createElement("link"),a=d.createElement("div"),w="https://rawgit.com/dangeredwolf/"+x+"/stable/"+x+"/",j=d.createElement(s),r=chrome.runtime,W=window,B="set",G="get",n="send";l.rel="stylesheet",l.href=w+u+X+".css",H.appendChild(l),a.setAttribute("type",w),a.id="MTDURLExchange",H.appendChild(a),console.log("MTDRemoteLoad 1.0\nBootstrapping "+Y+" and "+X+S),j.src=w+u+"MTDinject.js",j.type="text/java"+s,H.appendChild(j),r.sendMessage(G+C),r.onMessage.addListener(function(a){a.name==n+C&&(s=a.storage)}),W.addEventListener("message",function(a){var b=a.data;a.source==W&&b.type&&(b.type==B+C?r.sendMessage({name:B+C,content:b.message}):b.type==G+C&&W.postMessage({type:n+C,message:s},"*"))});
