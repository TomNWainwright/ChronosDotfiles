if (chrome) {
    var browser = chrome;
}
var DEBUG = ('no' === 'yes');
var debug_info = {};

var retailer_id = 0;
var coupons = [];
var current_retailer;
var disabled_status = 0;
var promo = {};
var wishlist_url = "https://www.priceblink.com/webcpns/addwishlistitem.php";
var iframe_url = DEBUG ? "localhost:8008/" : "www.priceblink.com/iframe3/";
// Permanently disabled
var is_hidden = false;
// Temporarily disabled for 1 hour
var is_minimized = false;
// Temporarily disabled for 24 hours and no price comp either
var is_minimized_24 = false;
var products = [];
var NOT_DISABLED = 0;
var TEMP_DISABLED = 1;
var PERM_DISABLED = 2;
var TEMP_DISABLED_NO_PRICE_COMP = 3;
var disable_type = NOT_DISABLED;

// For coupon overlays and sent as part of universal scrape
var coupon_overlay_xpath = "";
var coupon_code_count = 0;
// We don't want to expand coupons in these cases
var coupon_code_exception_rids = [];

var toolbarHeight = 36;

function allStorageSet(items, callback) {
  var storage = (browser.storage || {}).sync;
  var fn = (typeof callback === 'function') ? callback : (function () {});
  if (typeof items === 'object') {
    storage && storage.set(items, fn);
    var keys = Object.keys(items);
    keys.forEach(function (key) {
      localStorage.setItem(key, JSON.stringify(items[key]));
    });
  }
}

function allStorageGet(callback, key) {
  var storage = (browser.storage || {}).sync;
  var fn = (typeof callback === 'function') ? callback : (function () {});

  function parseLocalStorage() {
    var merged = {};
    for (var i = 0; i < localStorage.length; i++) {
      try {
        merged[localStorage.key(i)] = JSON.parse(localStorage.getItem(localStorage.key(i)));
      } catch (e) {}
    }
    return merged;
  }

  if (storage) {
    storage.get(function (local) {
      var merged = parseLocalStorage();
      var keys = Object.keys(local);
      keys.forEach(function (key) {
        local[key] && (merged[key] = local[key]);
      });
      fn(key ? local[key] : local);
    });
  } else {
    var merged = parseLocalStorage();
    fn(key ? merged[key] : merged);
  }
}

function getSiteSpecificClass() {
    return 'pb-retailer-' + window.location.hostname.replace('www.', '').replace(/\./g, '-');
}

var siteSpecificClass = getSiteSpecificClass();

// Kick off the process
init();

function init() {
    var url = document.location.href;
    if (document.location.protocol == "https:")
        iframe_url = "https://" + iframe_url;
    else
        iframe_url = "https://" + iframe_url;

    if (url.indexOf(".dell.com") != -1) {
        browser.runtime.sendMessage({
            action: 'getCoupons',
            url: document.location.href,
            retailer_id: getDell()
        }, setCoupons);
    } else {
        browser.runtime.sendMessage({
            action: 'getRetailer',
            url: document.location.href,
            caller: 'main'
        }, setCoupons);
    }

    // Listen for the minimize event to temporarily disable toolbar
    var minimizeListener = function (evt) {
        var dt = new Date();

        // Minimize for 24 hours
        dt = new Date(dt.getTime() + (24 * 60 * 60 * 1000));
        browser.runtime.sendMessage({
            action: 'disableCoupons',
            url: document.location.href,
            retailer: {id: current_retailer.id, dt: dt.getTime()}});

        // Shift the page back to top
        eraseSpaceForToolbar();
    }
    document.addEventListener("PB_Minimize_Event", minimizeListener, false, true);

    // Listen for retailer disable events to permanently disable toolbar
    var disableListener = function (evt) {
        eraseSpaceForToolbar();
        browser.runtime.sendMessage({
            action: 'disableCoupons',
            url: document.location.href,
            retailer: {id: current_retailer.id}
        });
    }
    window.addEventListener("PB_Disable_Event", disableListener, false, true);

    // Listen for toolbar restore event after being temporarily disabled
    var restoreListener = function (evt) {
        browser.runtime.sendMessage({action: 'restoreCoupons', url: document.location.href, retailer_id: current_retailer.id});
    }
    window.addEventListener("PB_Restore_Event", restoreListener, false, true);

    // Listen for toolbar highlighted retailer event
    var highlightListener = function (evt) {
        browser.runtime.sendMessage({action: 'highlightRetailer', url: document.location.href, coupons: coupons});
    }
    document.addEventListener("PB_Highlight_Event", highlightListener, false, true);
    document.addEventListener("PB_Open_Options_Event", function (evt) {
        browser.runtime.sendMessage({action: 'openOptionsPage', url: document.location.href});
    }, false, true);
    document.addEventListener("PB_OpenUrl_Event", function (e) {
      const url = e.detail.replace('openUrl', '');
      browser.runtime.sendMessage({
        action: 'openUrl',
        url: url,
      });
    }, false, true);
}

function eraseSpaceForToolbar() {
    var htmlNode = document.body.parentNode;
    htmlNode.style.removeProperty("margin-top");
}

function injectSpaceForToolbar() {
    var htmlNode = document.body.parentNode;
    htmlNode.style.setProperty("margin-top", "36px", "important");
}

function getXPathContent(xpath) {
    if (xpath == undefined || xpath == "") return "";

    var xpath = "normalize-space(" + xpath + ")";
    var doc = document;
    var result = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
    return clean(result.stringValue);
}

function setCoupons(obj) {
    if (!obj) return;
    coupons = obj.coupons;
    disabled_status = obj.disabled_status;
    current_retailer = obj.retailer;
    promo = obj.promo;
    coupon_overlay_xpath = obj.coupon_overlay_xpath;

    if (obj.disabled_status == TEMP_DISABLED)
        is_minimized = true;
    else if (obj.disabled_status == PERM_DISABLED)
        is_hidden = true;
    else if (obj.disabled_status == TEMP_DISABLED_NO_PRICE_COMP)
        is_minimized_24 = true;

    coupon_code_xpath = obj.coupon_code_xpath;
    coupon_code_exception_rids = obj.coupon_code_exception_rids.rids;

    beginParse();

    // Added 10/11/12 for displaying coupons inline for G
    // Also fires price comparison when new search is issued under instant search
    if (document.location.href.indexOf("www.google.com") != -1) {

        var g_interval = null;
        var url = document.location.href;

        // This is for when the first search happens directly from a link or omnibox
        setTimeout(injectCoupons, 1000);

        g_interval = setInterval(function () {
            if (url != document.location.href) {
                // URL has changed so let's display our coupons,
                // but let's make sure they don't already exist
                // Set the url to new one
                url = document.location.href;

                // We introduce a delay in certain cases where instant results happen too fast
                setTimeout(beginInjection, 1000);
            } else {
                // URL hasn't changed
            }

        }, 500);
    }
}

function beginInjection() {
    // This means the iframe exists so we need to remove it
    if (document.getElementById("pb-div")) {
        document.body.removeChild(document.getElementById("pb-div"));
        var styles = document.getElementsByTagName('link');
        for (var i = 0; i < styles.length; i++) {
            if (styles[i].href.indexOf("iframe3/css/toolbar-injected.css") > -1) {
                styles[i].parentNode.removeChild(styles[i]);
                break;
            }
        }
    }

    injectCoupons();

    // Kick off the scrape
    beginParse();
}

function injectCoupons() {
    if (coupon_overlay_xpath == "") return;

    var result = document.evaluate(coupon_overlay_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var urls = [];

    // No scrape results
    if (result.snapshotLength == 0) return;

    // Grab the links from the page
    for (var i = 0; i < result.snapshotLength; i++) {
        var node = result.snapshotItem(i);
        var url = node.getAttribute("href");

        // This is necessary because of encoded url redirects
        url = url.split("//");
        url = "http://" + url[url.length - 1];

        urls.push(url);
    }

    // Pass the urls to the background and find out what's supported
    browser.runtime.sendMessage({action: 'getCouponsForMultipleURLs', url: document.location.href, urls: urls}, function (obj) {
        var r = obj.coupons;
        var result = document.evaluate(coupon_overlay_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        injectCSS("coupon_overlay.css");

        // Loop through the results again and find matches based on supported coupon retailers
        for (var i = 0; i < result.snapshotLength; i++) {
            var node = result.snapshotItem(i);
            var url = node.getAttribute("href");
            url = url.split("//");
            url = "http://" + url[url.length - 1];

            for (var j = 0; j < r.length; j++) {
                if (doUrlsMatch(url, r[j].domain)) {
                    var div = document.createElement("div");
                    var span = document.createElement("span");
                    span.innerHTML = r[j].short_label;
                    span.setAttribute("class", "pb-coupon-overlay");

                    // This is a relative url
                    if (node.getAttribute("href").indexOf("/") == 0)
                        div.setAttribute("onClick", "location.href='" + r[j].link_prefix + escape("http://" + document.URL.split("/")[2] + node.getAttribute("href")) + "'");
                    else
                        div.setAttribute("onClick", "location.href='" + r[j].link_prefix + escape(node.getAttribute("href")) + "'");

                    div.setAttribute("class", "pb-coupon-div");
                    div.setAttribute("title", r[j].label + "\n" + r[j].restrictions + "\n\nTo get this discount, click this button and then look for the coupon in the PriceBlink bar.");
                    div.appendChild(span);

                    // Put it right next to the hyperlink
                    node.parentNode.appendChild(div);
                }
            }
        }
    });
}

// Based on url let's see if the retailer exists in our parser
function doUrlsMatch(page_url, parser_url) {
    page_url = "/" + page_url.split("/")[2];

    var index = page_url.indexOf("/" + parser_url);

    if (index != -1) {
        return true;
    }

    index = page_url.indexOf("." + parser_url);

    if (index != -1) {
        return true;
    }

    return false;
}

function setProducts(obj) {
    // We made the call but we don't have any alternatives to offer. Need to make sure there are no coupons as well.
    if ((obj.products[0].retailers == undefined || obj.products[0].retailers.length == 0) && (coupons[0].coupons.length == 0 || is_hidden))
        return;
    products = obj.products;
    current_retailer = obj.retailer;

    debug_info = obj.debug;

    injectScript();
}

function beginParse() {
    var r = current_retailer;

    // Params object
    var params = {};

    // Setup the scrape functions
    var title = new Function(r.title)();
    params.title = title;

    // No title scrape so show coupons
    if (title == '' && !is_hidden && (coupons[0].coupons.length > 0 || (coupons[0].users_coupons != null && coupons[0].users_coupons.length > 0))) {
        injectScript();
        return;
    }


    // Let's grab the asin for Amazon pages
    var asin = "";
    var sellerid = "";
    if (document.location.href.match(/https?:\/\/([a-z0-9]+[.])*amazon[.]com/g)) {

      asin = getXPathContent("//input[@id='ASIN' and @type='hidden']/@value");
      params.asin = asin;

      sellerid = getXPathContent("//input[@id='merchantID' and @type='hidden']/@value");
      params.sellerid = sellerid;

    }

    var price = "";
    if (r.price != undefined) {
        price = new Function(r.price)().replace('$', '').replace(',', '');
        params.price = price;
    } else {
        params.price = "";
    }

    var mpn = "";
    if (r.mpn != undefined) {
        mpn = new Function(r.mpn)();
        params.mpn = mpn;
    } else {
        params.mpn = "";
    }

    var model = "";
    if (r.model != undefined) {
        model = new Function(r.model)();
        params.model = model;
    } else {
        params.model = "";
    }

    var brand = "";
    if (r.brand != undefined) {
        brand = new Function(r.brand)();
        params.brand = brand;
    } else {
        params.brand = "";
    }

    var sku = "";
    if (r.sku != undefined) {
        sku = new Function(r.sku)();
        params.sku = sku;
    } else {
        params.sku = "";
    }

    var upc = "";
    if (r.upc != undefined) {
        upc = new Function(r.upc)();
        params.upc = upc;
    } else {
        params.upc = "";
    }

    var isbn = "";
    if (r.isbn != undefined) {
        isbn = new Function(r.isbn)();
        params.isbn = isbn;
    } else {
        params.isbn = "";
    }

    var ship = "";
    if (r.ship != undefined) {
        ship = new Function(r.ship)();
        params.ship = ship;
    } else {
        params.ship = "";
    }

    var rating = "";
    if (r.rating != undefined) {
        rating = new Function(r.rating)();
        params.rating = rating;
    } else {
        params.rating = "";
    }

    var in_stock = "";
    if (r.in_stock != undefined) {
        in_stock = new Function(r.in_stock)();
        params.in_stock = in_stock;
    } else {
        params.in_stock = "";
    }

    var c1 = "";
    if (r.c1 != undefined) {
        c1 = new Function(r.c1)();
        params.c1 = c1;
    } else {
        params.c1 = "";
    }

    var c2 = "";
    if (r.c2 != undefined) {
        c2 = new Function(r.c2)();
        params.c2 = c2;
    } else {
        params.c2 = "";
    }

    var c3 = "";
    if (r.c3 != undefined) {
        c3 = new Function(r.c3)();
        params.c3 = c3;
    } else {
        params.c3 = "";
    }

    var c4 = "";
    if (r.c4 != undefined) {
        c4 = new Function(r.c4)();
        params.c4 = c4;
    } else {
        params.c4 = "";
    }

    var c5 = "";
    if (r.c5 != undefined) {
        c5 = new Function(r.c5)();
        params.c5 = c5;
    } else {
        params.c5 = "";
    }

    // We're doing the SE functionality for Amazon results in GS
    if ((document.URL.indexOf("www.google.com/shopping") > -1) || (document.URL.indexOf("www.google.co.uk/shopping") > -1)) {
        scrapeGS(upc, c3, c4);
    }
    // Get the products from the catalog
    else if (title != '' && (sku != '' || mpn != '' || model != '' || upc != '' || isbn != '')) {
        //browser.runtime.sendMessage({action: 'getProducts', params: params}, setProducts);
        browser.runtime.sendMessage({action: 'step1', params: params, url: document.location.href}, setProducts);
        // Just in case we accidentally grab a title and slip through the logic above
    } else if (!is_hidden && (coupons[0].coupons.length > 0 || (coupons[0].users_coupons != null && coupons[0].users_coupons.length > 0))) {
        injectScript();
    }
}

var scrapeGS = function (upc, details_link, loc) {
    // UPC isn't here so let's grab details link
    if (upc == "") {
        // Check for the details link and follow
        if (details_link != "") {
            var iframe = document.createElement("iframe");
            iframe.id = "gs-iframe";
            iframe.style.visibility = "hidden";
            iframe.style.display = "none";

            iframe.addEventListener("load", function (event) {
                var doc = iframe.contentDocument;
                var new_upc = current_retailer.upc.replace("return getXPathContent(\"", "").replace("\")", "");
                var result = doc.evaluate("normalize-space(" + new_upc + ")", doc, null, XPathResult.ANY_TYPE, null);
                var params = {
                    rid: current_retailer.id,
                    upc: result.stringValue,
                    c3: loc,
                    title: "",
                    price: "",
                    model: "",
                    mpn: "",
                    brand: "",
                    sku: "",
                    isbn: "",
                    ship: "",
                    rating: "",
                    in_stock: "",
                    c1: "",
                    c2: "",
                    c4: "",
                    c5: ""
                };
                browser.runtime.sendMessage({action: 'step1', params: params, url: document.location.href}, setProducts);
                document.body.removeChild(document.getElementById("gs-iframe"));
            });

            iframe.src = unescape(details_link);
            document.body.appendChild(iframe);
        }
        // Case where UPC is on main page
    } else {
        var params = {
            rid: current_retailer.id,
            upc: upc,
            c3: loc,
            title: "",
            price: "",
            model: "",
            mpn: "",
            brand: "",
            sku: "",
            isbn: "",
            ship: "",
            rating: "",
            in_stock: "",
            c1: "",
            c2: "",
            c4: "",
            c5: ""
        };
        browser.runtime.sendMessage({action: 'step1', params: params, url: document.location.href}, setProducts);
    }
}

var injectScript = function () {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.text = "window.addEventListener('message', PB_receiveMessage, false);function PB_receiveMessage(e){var pb_iframe=document.getElementById('pb-iframe');var pb_div=document.getElementById('pb-div');if(e.data=='highlight'){var e = document.createEvent('Events');e.initEvent('PB_Highlight_Event', true, false);document.dispatchEvent(e);} else if(e.data=='options'){var e = document.createEvent('Events');e.initEvent('PB_Open_Options_Event', true, false);document.dispatchEvent(e);} else if(e.data=='maximize'){pb_iframe.style.height=pb_div.style.height='100%';}else if(e.data=='minimize'){pb_iframe.style.height=pb_div.style.height='36px';}else if(e.data=='close'){document.body.className=document.body.className.replace('priceblink-body " + siteSpecificClass + "', '');PB_disable();var e = document.createEvent('Events');e.initEvent('PB_Minimize_Event', true, false);document.dispatchEvent(e);}else if(e.data=='restore'){var e = document.createEvent('Events');e.initEvent('PB_Restore_Event', true, false);document.dispatchEvent(e);document.location.reload(true);}else if(e.data=='hide'){document.body.className=document.body.className.replace('priceblink-body " + siteSpecificClass + "', '');pb_div.style.display='none';var e = document.createEvent('Events');e.initEvent('PB_Disable_Event', true, false);document.dispatchEvent(e);}else if(e.data && ('' + e.data).indexOf('openUrl') === 0) {var ev = new CustomEvent('PB_OpenUrl_Event', {detail: e.data});document.dispatchEvent(ev);}}function PB_disable(){pb_iframe.src='" + iframe_url + "toolbar_minimized.html';document.getElementById('pb-div').style.width='25px'}";
    document.getElementsByTagName("head").item(0).appendChild(script);
    if (!is_minimized && !is_minimized_24) {
        injectSpaceForToolbar();
        injectCSS('toolbar-injected.css');
    }

    // Don't shift the page if the toolbar is minimized
    if (!is_minimized || (products.length > 0 && products[0].retailers != undefined)) {
        if (!is_minimized_24) { // For split test
            // We may already have bumped with the early injection
            if (document.body.className.indexOf("priceblink-body") == -1)
                document.body.className += " priceblink-body " + siteSpecificClass;
        }
    }

    injectIframe();
}

// Append the stylesheet to the document
var injectCSS = function (stylesheet) {

    // First check to make sure the CSS doesn't already exist
    var css_exists = false;

    // Loop through CSS
    var styles = document.getElementsByTagName('link');
    for (var i = 0; i < styles.length; i++) {
        if (styles[i].href.indexOf("iframe/css/" + stylesheet) != -1) {
            css_exists = true;
            break;
        }
    }

    // CSS doesn't exist so create it
    if (!css_exists) {
        var css = document.createElement("link");
        css.type = "text/css";
        css.rel = "stylesheet";
        css.href = iframe_url + "css/" + stylesheet;
        document.getElementsByTagName("head").item(0).appendChild(css);
    }
}

var injectIframe = function () {
    var iframe = document.createElement("iframe");
    var div = document.createElement("div");
    var isInIH = ('PriceBlink' === 'InvisibleHand');

    var htmlUrl = iframe_url;
    // In cases where the iframe is minimized but we're doing a products comparison we need to display the full toolbar
    if (is_minimized && products.length > 0 && products[0].retailers != undefined) {
        if(isInIH) {
            iframe.src = htmlUrl + "toolbar.html?tax=1&partnerid=0";
        } else {
            iframe.src = htmlUrl + "toolbar.html?tax=1";
        }
        iframe.width = "100%";
        iframe.style.left = 0;
        div.style.width = "100%";
        // Display minimized iframe
    } else if (is_minimized || is_minimized_24) {
        if(isInIH) {
            iframe.src = htmlUrl + "toolbar_minimized.html?tax=1&partnerid=0";
        } else {
            iframe.src = htmlUrl + "toolbar_minimized.html?tax=1";
        }
        iframe.width = "25px";
        div.style.width = "25px";
        eraseSpaceForToolbar();
        // Display full iframe
    } else {
        if(isInIH) {
            iframe.src = htmlUrl + "toolbar.html?tax=1&partnerid=0";
        } else {
            iframe.src = htmlUrl + "toolbar.html?tax=1";
        }
        iframe.width = "100%";
        iframe.style.left = 0;
        div.style.width = "100%";
    }

    div.id = "pb-div";
    div.style.height = "36px";
    div.style.cssFloat = "right";
    div.style.position = "fixed";
    div.style.top = 0;
    div.style.right = 0;
    div.style.zIndex = "1000000";

    iframe.height = "36px";
    iframe.id = "pb-iframe";
    iframe.border = "none";
    iframe.frameBorder = "0";
    iframe.scrolling = "no";
    iframe.style.display = "block";
    //iframe.style.position = "fixed";
    iframe.style.height = "36px";
    //iframe.style.top = 0;
    //iframe.style.right = 0;
    iframe.style.border = "none";
    //iframe.style.zIndex = "1000000";

    div.appendChild(iframe);
    document.querySelector('html').insertBefore(div, document.body);

    iframe.onload = function () {
        // If the toolbar is minimized and we're not on a products page don't do anything
        if (is_minimized && products.length == 0) return;

        // Determine if this is a checkout page
        coupon_code_count = parseInt(getXPathContent(coupon_code_xpath));

        // Don't auto-expand coupons on this site
        for (var i = 0; i < coupon_code_exception_rids.length; i++) {
            if (current_retailer.id == coupon_code_exception_rids[i]) {
                coupon_code_count = 0;
                break;
            }
        }

        // Test to see if we can auto-expand the coupons drop-down on a checkout page
        if (coupon_code_count > 0 && coupons[0].coupons.length > 0) {
            // First time expanded
            allStorageGet(function (local) {
               if (!local.expanded_at) {
                   // Already expanded but let's check when
                   coupons[0].auto_expand = "true";
                   var now = new Date().getTime();
                   allStorageSet({"expanded_at": now});
               } else {
                   var offset = 1 * 60 * 15 * 1000; // 15 min
                   var then = parseInt(local.expanded_at);
                   var now = new Date().getTime();

                   // Timer has expired so expand and reset
                   if (then + offset < now) {
                       coupons[0].auto_expand = "true";
                       var now = new Date().getTime();
                       allStorageSet({"expanded_at": now});
                       // Timer is still active so don't expand
                   } else {
                       coupons[0].auto_expand = "false";
                   }
               }
               inject();
            });
        } else {
          inject();
        }

        function inject() {
          // Escape single quotes and double escape double quotes
          if (coupons[0]) {
            coupons[0].disabled_status = disabled_status;
          }
          var cstr = JSON.stringify(coupons).replace(/'/g, "\\'").replace(/\"/g, "\\\"");
          var script = document.createElement("script");
          script.type = "text/javascript";

          // Display coupons only
          if (products.length == 0) {
            script.text = "var pb_iframe=document.getElementById('pb-iframe');pb_iframe.contentWindow.postMessage('" + cstr + "', '*');";
          } else {
            // Display coupons and products
            var pstr = JSON.stringify(products).replace(/'/g, "\\'").replace(/\"/g, "\\\"");
            script.text = "var pb_iframe=document.getElementById('pb-iframe');pb_iframe.contentWindow.postMessage('" + cstr + "|||" + pstr + "', '*');";
          }

          var head = document.getElementsByTagName("head").item(0);
          head.appendChild(script);
          head.removeChild(script);
        }

    }

    if (DEBUG) {
        return;
        var div = document.createElement("div");
        var str = "<strong>Time: " + debug_info.time + "ms</strong><br />";
        str += "<strong>Method: " + debug_info.method + "</strong>"
        str += "<br /><a href='" + debug_info.search_url + "' target='_blank'>" + debug_info.search_url + "</a>";
        str += "<br /><a href='" + debug_info.prices_url + "' target='_blank'>" + debug_info.prices_url + "</a>";
        str += "<br /><br />";

        var retailers = products[0].retailers;

        for (var i = 0; i < retailers.length; i++) {
            str += "<strong>" + retailers[i].retailer_name + " | " + retailers[i].price + "</strong> -- ";
            str += "<a href='" + retailers[i].url + "' target='_blank'>" + retailers[i].url + "</a>";
            str += "<hr />";
        }

        div.innerHTML = str;

        document.body.insertBefore(div, document.body.firstChild);
    }

}

// Trip spaces and remove html entities
function clean(str) {
    return str.replace(/&nbsp;/g, '').replace(/&amp;/g, '').replace(/^\s+|\s+$/g, "");
}

// Determine Home or SMB
function getDell() {
    var xpath = "//META[@name='SEGMENT']/@content";
    var result = getXPathContent(xpath);

    if (result == 'dhs' || result == 'gen') {
        return 8;
    } else if (result == 'bsd') {
        return 36;
    } else {
        return null;
    }
}

function calcChecksum(upc) {
    upc = upc.split('');
    var esum = Number(upc[1]) + Number(upc[3]) + Number(upc[5]) + Number(upc[7]) + Number(upc[9]);
    var osum = Number(upc[0]) + Number(upc[2]) + Number(upc[4]) + Number(upc[6]) + Number(upc[8]) + Number(upc[10]);
    var sum = esum + 3 * osum;

    sum = sum % 10;

    if (sum == 0)
        return 0;
    else
        return (10 - sum);
}

// Listen for messages from background
function onRequest(request, sender, callback) {
    // Sent from background page, but initiated from coupons_popup after coupons are turned back on
    if (request.action == "turnCouponsBackOn") {
        is_hidden = false;
        beginParse();
        // Sent from background, but initiated from coupons_popup to retrieve the "View All Coupons" link depending on selected tab
    } else if (request.action == "getViewAllCouponsLink") {
        var c = coupons[0].coupons;
        callback({url: c[c.length - 1].url});
        // Look for notifications right after we get coupons
    } else if (request.action == "universalScrape") {
        var count = getXPathContent(request.data[0].order_confirmation_xpath);
        if (count > 0) {
            callback({retailer_id: current_retailer.id});
        }
        // Need page URL for universal wishlist browser action
    } else if (request.action == "getPageURL") {
        var current_page_title = escape(getXPathContent("//title"));
        callback({
            url: wishlist_url + "?title=" + current_page_title + "&itemurl=" + escape(document.location.href),
            retailer: current_retailer
        });
    } else if (request.action == "getWishlistURL") {

        // Handle the case where there's not a scrape supported site
        if (products.length == 0)
            callback({url: null, retailer: current_retailer});
        else
            callback({
                url: products[0].addtowishlist + "&itemurl=" + escape(document.location.href),
                retailer: current_retailer
            });

    } else if (request.action == "getRetailer") {
        callback({retailer: current_retailer});
    }
}
browser.runtime.onMessage.addListener(onRequest);

// Vanilla implementation of Event Delegation
// http://bdadam.com/blog/plain-javascript-event-delegation.html
function eventOn(elSelector, eventName, selector, fn) {
    var element = document.querySelector(elSelector);

    element.addEventListener(eventName, function(event) {
        var possibleTargets = element.querySelectorAll(selector);
        var target = event.target;

        for (var i = 0, l = possibleTargets.length; i < l; i++) {
            var el = target;
            var p = possibleTargets[i];

            while(el && el !== element) {
                if (el === p) {
                    return fn.call(p, event);
                }

                el = el.parentNode;
            }
        }
    });
}

// https://www.adorama.com/l/Lenses/Canon~DSLR-Cinema-Lenses
// Make sure that clicking `ADD TO CART` will make the popup window at the correct position.
eventOn('html', 'click', 'body.pb-retailer-adorama-com .button.add-to-cart', function() {
    console.log('clicked');
    var i = 0;
    var body = document.body;
    var timer = setInterval(function() {
        var $popup = document.querySelector(
            'body.priceblink-body.pb-retailer-adorama-com .popup800 .popupBorder'
        );
        if ($popup) {
            $popup.setAttribute('style', 'top: ' + (50 + body.scrollTop) + 'px');
            clearInterval(timer);
        }
        if (i++ > 50) {
            clearInterval(timer);
        }
    }, 100);
});
