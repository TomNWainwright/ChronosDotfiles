"use strict";

var Handlebars = require("handlebars");
exports["Piggy"] = exports["Piggy"] || {};
exports["Piggy"]["templates"] = exports["Piggy"]["templates"] || {};
exports["Piggy"]["templates"]["activate-cashback-auto-minimize"] = Handlebars.template({ "compiler": [7, ">= 4.0.0"], "main": function (container, depth0, helpers, partials, data) {
        var helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function",
            alias4 = container.escapeExpression;

        return "<div id=\"activate-cashback-slide-down-minimizing\" class=\"container activate-cashback\">\n    <div class=\"already-saved-top\">\n        <div class=\"header-image\">\n            <img src=\"" + alias4((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/backpack.png\"/>\n        </div>\n        <div class=\"header-content\">\n        	<a href=\"#\" class=\"close\"><img src=\"" + alias4((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/close.png\"/></a>\n            <p class=\"cash_saved\">$ " + alias4((helper = (helper = helpers.savings || (depth0 != null ? depth0.savings : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "savings", "hash": {}, "data": data }) : helper)) + "</p>\n            <p class=\"amount_saved\">You've already saved</p>\n        </div>\n    </div>\n    <div class=\"activate-cashback-bottom\">\n    	<p class=\"text\">Click to view coupons and activate</p>\n    	<p class=\"orange\">" + alias4((helper = (helper = helpers.cashback || (depth0 != null ? depth0.cashback : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "cashback", "hash": {}, "data": data }) : helper)) + " Cash Back</p>\n    	<a href=\"#\" class=\"button green_button\">View Deals</a>\n    	<a href=\"#\" class=\"minimizing\">Minimizing in <span id=\"countdown\">5</span></a>\n    </div>\n</div>";
    }, "useData": true });
exports["Piggy"]["templates"]["checkout"] = Handlebars.template({ "1": function (container, depth0, helpers, partials, data) {
        var stack1;

        return (stack1 = (helpers["switch"] || depth0 && depth0["switch"] || helpers.helperMissing).call(depth0 != null ? depth0 : container.nullContext || {}, depth0 != null ? depth0.domainNotSupported : depth0, { "name": "switch", "hash": {}, "fn": container.program(2, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "";
    }, "2": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            options,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            buffer = "                        " + ((stack1 = (helpers["case"] || depth0 && depth0["case"] || alias2).call(alias1, "www.amazon.com", { "name": "case", "hash": {}, "fn": container.program(3, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "") + "\n                        " + ((stack1 = (helpers["case"] || depth0 && depth0["case"] || alias2).call(alias1, "www.joinpiggy.com", { "name": "case", "hash": {}, "fn": container.program(5, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "") + "\n                        ";
        stack1 = (helper = (helper = helpers["default"] || (depth0 != null ? depth0["default"] : depth0)) != null ? helper : alias2, options = { "name": "default", "hash": {}, "fn": container.program(7, data, 0), "inverse": container.noop, "data": data }, typeof helper === "function" ? helper.call(alias1, options) : helper);
        if (!helpers["default"]) {
            stack1 = helpers.blockHelperMissing.call(depth0, stack1, options);
        }
        if (stack1 != null) {
            buffer += stack1;
        }
        return buffer + "\n";
    }, "3": function (container, depth0, helpers, partials, data) {
        return "Piggy's Active";
    }, "5": function (container, depth0, helpers, partials, data) {
        return "Piggy is Ready";
    }, "7": function (container, depth0, helpers, partials, data) {
        return "Piggy's Asleep";
    }, "9": function (container, depth0, helpers, partials, data) {
        return "                    Piggy is Ready\n";
    }, "11": function (container, depth0, helpers, partials, data) {
        var stack1;

        return (stack1 = (helpers["switch"] || depth0 && depth0["switch"] || helpers.helperMissing).call(depth0 != null ? depth0 : container.nullContext || {}, depth0 != null ? depth0.domainNotSupported : depth0, { "name": "switch", "hash": {}, "fn": container.program(12, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "";
    }, "12": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            options,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            buffer = ((stack1 = (helpers["case"] || depth0 && depth0["case"] || alias2).call(alias1, "www.amazon.com", { "name": "case", "hash": {}, "fn": container.program(13, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "") + "\n" + ((stack1 = (helpers["case"] || depth0 && depth0["case"] || alias2).call(alias1, "www.joinpiggy.com", { "name": "case", "hash": {}, "fn": container.program(15, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "") + "\n";
        stack1 = (helper = (helper = helpers["default"] || (depth0 != null ? depth0["default"] : depth0)) != null ? helper : alias2, options = { "name": "default", "hash": {}, "fn": container.program(18, data, 0), "inverse": container.noop, "data": data }, typeof helper === "function" ? helper.call(alias1, options) : helper);
        if (!helpers["default"]) {
            stack1 = helpers.blockHelperMissing.call(depth0, stack1, options);
        }
        if (stack1 != null) {
            buffer += stack1;
        }
        return buffer;
    }, "13": function (container, depth0, helpers, partials, data) {
        var helper;

        return "                <div class=\"domain-not-supported\">\n                    <img class=\"piggy-logo\" src=\"" + container.escapeExpression((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/piggy-logo.png\">\n                    <div class=\"js_messageReady current-info\">\n                        <p class=\"text-left\"><strong>Coupons rarely work at Amazon.</strong></p>\n                        <p class=\"text-left\">\n                            Piggy will check your cart for items that have coupons, and will only alert you when there are codes for your items.\n                        </p>\n                        <p class=\"text-left\">\n                            That's why you may not see Piggy alert you every time you checkout at Amazon.com®\n                        </p>\n                    </div>\n                </div>\n";
    }, "15": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {};

        return "                <div class=\"domain-not-supported\">\n                    <img class=\"piggy-logo\" src=\"" + container.escapeExpression((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/piggy-logo.png\">\n                    <div class=\"js_messageReady current-info\">\n                        <p class=\"text-left\"><strong>Ready to Find You the Best Deal!</strong></p>\n                        <p class=\"text-left\">\n                            The next time you check out at one of your favorite stores, Piggy will alert \n                            you of any coupons or available deals.\n                        </p>\n                    </div>\n" + ((stack1 = helpers.unless.call(alias1, (stack1 = depth0 != null ? depth0.user : depth0) != null ? stack1.auth : stack1, { "name": "unless", "hash": {}, "fn": container.program(16, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "") + "                </div>\n";
    }, "16": function (container, depth0, helpers, partials, data) {
        return "                    <div class=\"js_notAdded\">\n                        <p class=\"f600 domain\">Login to Earn Bonus Cash Back</p>\n                        <a href=\"#\" class=\"button blue_invert_button js_footerAccount js_showAccount\">Create Your Free Account</a>\n                    </div>\n";
    }, "18": function (container, depth0, helpers, partials, data) {
        var helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function",
            alias4 = container.escapeExpression;

        return "                <div class=\"domain-not-supported\">\n                    <img class=\"piggy-logo\" src=\"" + alias4((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/piggy-logo.png\">\n                    <div class=\"js_notAdded\">\n                        <p class=\"text-left\"><strong>This website doesn't work with us.</strong></p>\n                        <p class=\"text-left\">Piggy has temporarily deactivated itself, but we're ready to save you money the next time you visit a website that works with Piggy.</p>\n                        <p class=\"f600 domain\">" + alias4((helper = (helper = helpers.domainNotSupported || (depth0 != null ? depth0.domainNotSupported : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "domainNotSupported", "hash": {}, "data": data }) : helper)) + "</p>\n                        <a href=\"#\" class=\"js_requestSite button blue_invert_button\">Request to Add This Site</a>\n                        <a href=\"mailto:help@joinpiggy.com\" target=\"_blank\" class=\"block-centered grey_link\">Report a problem</a>\n                    </div>\n                    <div class=\"js_added\">\n                        <p class=\"text-left\">Thanks for your input!</p>\n                        <p class=\"text-left\">We've added this to the list and will try to get our engineers on it ASAP!</p>\n                        <p class=\"text-left uppercase f600 love\"><i class=\"fa fa-heart\" aria-hidden=\"true\"></i> Piggy</p>\n                        <p>&nbsp;</p>\n                        <a href=\"mailto:help@joinpiggy.com\" target=\"_blank\" class=\"block-centered grey_link\">Report a problem</a>\n                    </div>\n                </div>\n";
    }, "20": function (container, depth0, helpers, partials, data) {
        var stack1,
            alias1 = depth0 != null ? depth0 : container.nullContext || {};

        return "    <div class=\"js_codes piggy-is-ready-bottom\">\n        <div class=\"feedback\">\n            <div class=\"js_sendFeedback did-it-work\">\n                <p class=\"text-center\">You copied the coupon <strong class=\"coupon-code\">COUPONCODE</strong>.</p>\n                <p class=\"text-center\">Did it work?</p>\n                <div class=\"thumbs\">\n                    <a href=\"#\"><i class=\"js_feedbackPositive pull-right fa fa-thumbs-up\"></i></a>\n                    <a href=\"#\"><i class=\"js_feedbackNegative pull-left fa fa-thumbs-down\"></i></a>\n                </div>\n            </div>\n" + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.isCheckoutPage : depth0, { "name": "if", "hash": {}, "fn": container.program(21, data, 0), "inverse": container.program(43, data, 0), "data": data })) != null ? stack1 : "") + "        </div>\n" + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.couponCodes : depth0, { "name": "if", "hash": {}, "fn": container.program(62, data, 0), "inverse": container.program(68, data, 0), "data": data })) != null ? stack1 : "") + "    </div>\n";
    }, "21": function (container, depth0, helpers, partials, data) {
        var stack1;

        return (stack1 = helpers["if"].call(depth0 != null ? depth0 : container.nullContext || {}, depth0 != null ? depth0.autotryEnabled : depth0, { "name": "if", "hash": {}, "fn": container.program(22, data, 0), "inverse": container.program(24, data, 0), "data": data })) != null ? stack1 : "";
    }, "22": function (container, depth0, helpers, partials, data) {
        return "                <div class=\"js_messageReady current-info\">\n                    <p class=\"little-text\">Auto-Try Coupons is ready. Piggy will apply all codes and automatically pick the best deal for you!</p>\n                    <div class=\"text-center\">\n                        <a href=\"#\" class=\"button orange_button js_autotry\">Auto-Try Coupons</a>\n                    </div>\n                </div>\n";
    }, "24": function (container, depth0, helpers, partials, data) {
        var stack1;

        return (stack1 = helpers["if"].call(depth0 != null ? depth0 : container.nullContext || {}, depth0 != null ? depth0.cashback : depth0, { "name": "if", "hash": {}, "fn": container.program(25, data, 0), "inverse": container.program(41, data, 0), "data": data })) != null ? stack1 : "";
    }, "25": function (container, depth0, helpers, partials, data) {
        var stack1,
            alias1 = depth0 != null ? depth0 : container.nullContext || {};

        return "                <div class=\"js_messageReady current-info\">\n                    <p class=\"little-text\">This site doesn't have Auto-Try Coupons, but " + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.couponCodes : depth0, { "name": "if", "hash": {}, "fn": container.program(26, data, 0), "inverse": container.program(28, data, 0), "data": data })) != null ? stack1 : "") + "!</p>\n                    <div class=\"text-center\">\n" + ((stack1 = (helpers["switch"] || depth0 && depth0["switch"] || helpers.helperMissing).call(alias1, depth0 != null ? depth0.domain : depth0, { "name": "switch", "hash": {}, "fn": container.program(30, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "") + "                    </div>\n                </div>\n";
    }, "26": function (container, depth0, helpers, partials, data) {
        return "we found coupons for you";
    }, "28": function (container, depth0, helpers, partials, data) {
        return "you can still earn cashback";
    }, "30": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            options,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            buffer = (stack1 = (helpers["case"] || depth0 && depth0["case"] || alias2).call(alias1, "www.ebay.com", { "name": "case", "hash": {}, "fn": container.program(31, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "";
        stack1 = (helper = (helper = helpers["default"] || (depth0 != null ? depth0["default"] : depth0)) != null ? helper : alias2, options = { "name": "default", "hash": {}, "fn": container.program(39, data, 0), "inverse": container.noop, "data": data }, typeof helper === "function" ? helper.call(alias1, options) : helper);
        if (!helpers["default"]) {
            stack1 = helpers.blockHelperMissing.call(depth0, stack1, options);
        }
        if (stack1 != null) {
            buffer += stack1;
        }
        return buffer;
    }, "31": function (container, depth0, helpers, partials, data) {
        var stack1;

        return (stack1 = helpers["if"].call(depth0 != null ? depth0 : container.nullContext || {}, (stack1 = depth0 != null ? depth0.user : depth0) != null ? stack1.auth : stack1, { "name": "if", "hash": {}, "fn": container.program(32, data, 0), "inverse": container.program(37, data, 0), "data": data })) != null ? stack1 : "";
    }, "32": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {};

        return "                                    <a href=\"#\" class=\"button " + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.cashbackHasFired : depth0, { "name": "if", "hash": {}, "fn": container.program(33, data, 0), "inverse": container.program(35, data, 0), "data": data })) != null ? stack1 : "") + " js_activateButton js_triggerCashback\">Activate " + container.escapeExpression((helper = (helper = helpers.cashback || (depth0 != null ? depth0.cashback : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(alias1, { "name": "cashback", "hash": {}, "data": data }) : helper)) + " Cashback</a>\n";
    }, "33": function (container, depth0, helpers, partials, data) {
        return "grey_button";
    }, "35": function (container, depth0, helpers, partials, data) {
        return "orange_button";
    }, "37": function (container, depth0, helpers, partials, data) {
        return "                                    <a href=\"#\" class=\"button orange_button js_activateButton js_showAccount\">Sign In to Activate Cashback</a>\n";
    }, "39": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {};

        return "                                <a href=\"#\" class=\"button " + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.cashbackHasFired : depth0, { "name": "if", "hash": {}, "fn": container.program(33, data, 0), "inverse": container.program(35, data, 0), "data": data })) != null ? stack1 : "") + " js_activateButton js_triggerCashback\">Activate " + container.escapeExpression((helper = (helper = helpers.cashback || (depth0 != null ? depth0.cashback : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(alias1, { "name": "cashback", "hash": {}, "data": data }) : helper)) + " Cashback</a>\n";
    }, "41": function (container, depth0, helpers, partials, data) {
        return "                <div class=\"js_messageReady current-info\">\n                    <p class=\"little-text\">This site doesn't have coupons or cashback.</p>\n                </div>\n                ";
    }, "43": function (container, depth0, helpers, partials, data) {
        var stack1,
            alias1 = depth0 != null ? depth0 : container.nullContext || {};

        return "            <div class=\"js_messageReady current-info\">\n                <p class=\"little-text\">\n                    " + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.autotryEnabled : depth0, { "name": "if", "hash": {}, "fn": container.program(44, data, 0), "inverse": container.program(46, data, 0), "data": data })) != null ? stack1 : "") + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.couponCodes : depth0, { "name": "if", "hash": {}, "fn": container.program(48, data, 0), "inverse": container.program(51, data, 0), "data": data })) != null ? stack1 : "") + "\n                </p>\n                <div class=\"text-center\">\n" + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.cashback : depth0, { "name": "if", "hash": {}, "fn": container.program(53, data, 0), "inverse": container.program(60, data, 0), "data": data })) != null ? stack1 : "") + "                </div>\n            </div>\n";
    }, "44": function (container, depth0, helpers, partials, data) {
        return "You are not yet at checkout, but ";
    }, "46": function (container, depth0, helpers, partials, data) {
        return "This site doesn't have Auto-Try Coupons, but ";
    }, "48": function (container, depth0, helpers, partials, data) {
        var stack1;

        return "we found coupons for you! " + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : container.nullContext || {}, depth0 != null ? depth0.autotryEnabled : depth0, { "name": "if", "hash": {}, "fn": container.program(49, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "");
    }, "49": function (container, depth0, helpers, partials, data) {
        return "Piggy will remind you again when you get to checkout.";
    }, "51": function (container, depth0, helpers, partials, data) {
        return "you can still earn cashback! Activate now to lock in your savings.";
    }, "53": function (container, depth0, helpers, partials, data) {
        var stack1;

        return (stack1 = (helpers["switch"] || depth0 && depth0["switch"] || helpers.helperMissing).call(depth0 != null ? depth0 : container.nullContext || {}, depth0 != null ? depth0.domain : depth0, { "name": "switch", "hash": {}, "fn": container.program(54, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "";
    }, "54": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            options,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            buffer = (stack1 = (helpers["case"] || depth0 && depth0["case"] || alias2).call(alias1, "www.ebay.com", { "name": "case", "hash": {}, "fn": container.program(55, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "";
        stack1 = (helper = (helper = helpers["default"] || (depth0 != null ? depth0["default"] : depth0)) != null ? helper : alias2, options = { "name": "default", "hash": {}, "fn": container.program(58, data, 0), "inverse": container.noop, "data": data }, typeof helper === "function" ? helper.call(alias1, options) : helper);
        if (!helpers["default"]) {
            stack1 = helpers.blockHelperMissing.call(depth0, stack1, options);
        }
        if (stack1 != null) {
            buffer += stack1;
        }
        return buffer;
    }, "55": function (container, depth0, helpers, partials, data) {
        var stack1;

        return (stack1 = helpers["if"].call(depth0 != null ? depth0 : container.nullContext || {}, (stack1 = depth0 != null ? depth0.user : depth0) != null ? stack1.auth : stack1, { "name": "if", "hash": {}, "fn": container.program(39, data, 0), "inverse": container.program(56, data, 0), "data": data })) != null ? stack1 : "";
    }, "56": function (container, depth0, helpers, partials, data) {
        return "                                <a href=\"#\" class=\"button orange_button js_activateButton js_showAccount\">Sign In to Activate Cashback</a>\n";
    }, "58": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {};

        return "                            <a href=\"#\" class=\"button " + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.cashbackHasFired : depth0, { "name": "if", "hash": {}, "fn": container.program(33, data, 0), "inverse": container.program(35, data, 0), "data": data })) != null ? stack1 : "") + " js_activateButton js_triggerCashback\">Activate " + container.escapeExpression((helper = (helper = helpers.cashback || (depth0 != null ? depth0.cashback : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(alias1, { "name": "cashback", "hash": {}, "data": data }) : helper)) + " Cashback</a>\n";
    }, "60": function (container, depth0, helpers, partials, data) {
        return "                    <a href=\"#\" class=\"js_disabled button grey_button\">No Cashback Available</a>\n";
    }, "62": function (container, depth0, helpers, partials, data) {
        var stack1;

        return "        <p class=\"popular-coupons\">Popular Coupons</p>\n        <div class=\"scroller js_scroller\">\n" + ((stack1 = helpers.each.call(depth0 != null ? depth0 : container.nullContext || {}, depth0 != null ? depth0.couponCodes : depth0, { "name": "each", "hash": {}, "fn": container.program(63, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "") + "        </div>\n";
    }, "63": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function",
            alias4 = container.escapeExpression;

        return "            <div class=\"coupon with-copy\">\n                <div class=\"top\">\n                    <p class=\"code\">" + alias4((helper = (helper = helpers.code || (depth0 != null ? depth0.code : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "code", "hash": {}, "data": data }) : helper)) + "</p>\n                    <p class=\"expiry\">" + alias4((helper = (helper = helpers.expires || (depth0 != null ? depth0.expires : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "expires", "hash": {}, "data": data }) : helper)) + "</p>\n                    <a class=\"js_copyCode piggy-slideright-coupon no_desc\" data-copy=\"" + alias4((helper = (helper = helpers.code || (depth0 != null ? depth0.code : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "code", "hash": {}, "data": data }) : helper)) + "\" href=\"#\"></a>\n                </div>\n                <div class=\"bottom\">\n                    <p class=\"offer\">" + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.description : depth0, { "name": "if", "hash": {}, "fn": container.program(64, data, 0), "inverse": container.program(66, data, 0), "data": data })) != null ? stack1 : "") + "</p>\n                    <p class=\"offer-description\"></p>\n                </div>\n            </div>\n";
    }, "64": function (container, depth0, helpers, partials, data) {
        var helper;

        return container.escapeExpression((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, { "name": "description", "hash": {}, "data": data }) : helper));
    }, "66": function (container, depth0, helpers, partials, data) {
        return "No description";
    }, "68": function (container, depth0, helpers, partials, data) {
        var stack1;

        return (stack1 = helpers["if"].call(depth0 != null ? depth0 : container.nullContext || {}, depth0 != null ? depth0.cashback : depth0, { "name": "if", "hash": {}, "fn": container.program(69, data, 0), "inverse": container.program(71, data, 0), "data": data })) != null ? stack1 : "";
    }, "69": function (container, depth0, helpers, partials, data) {
        var helper;

        return "        <p class=\"popular-coupons\">Popular Coupons</p>\n        <div class=\"no-coupons\">\n            <p class=\"text\">No coupon codes?</p>\n            <p class=\"text\">You can still earn cashback on your purchases!</p>\n            <img class=\"pot-of-gold\" src=\"" + container.escapeExpression((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/pot-of-money.png\">\n        </div>\n";
    }, "71": function (container, depth0, helpers, partials, data) {
        return "        <p class=\"popular-coupons\">Popular Coupons</p>\n        <div class=\"no-coupons\">\n            <p class=\"text\">Sorry, no coupon codes or cashback available.</p>\n        </div>\n        ";
    }, "73": function (container, depth0, helpers, partials, data) {
        return "Piggy";
    }, "75": function (container, depth0, helpers, partials, data) {
        return "Coupons";
    }, "77": function (container, depth0, helpers, partials, data) {
        return " checked";
    }, "79": function (container, depth0, helpers, partials, data) {
        var helper;

        return "    <div class=\"footer-green\">\n        <p><a href=\"#\" class=\"js_triggerCashback js_cashbackLoaded\">" + container.escapeExpression((helper = (helper = helpers.cashback || (depth0 != null ? depth0.cashback : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, { "name": "cashback", "hash": {}, "data": data }) : helper)) + " Cashback Activated!</a></p>\n    </div>\n";
    }, "81": function (container, depth0, helpers, partials, data) {
        var stack1;

        return "    <div class=\"js_onActivated footer-blue\">\n        <p>\n" + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : container.nullContext || {}, depth0 != null ? depth0.cashback : depth0, { "name": "if", "hash": {}, "fn": container.program(82, data, 0), "inverse": container.program(91, data, 0), "data": data })) != null ? stack1 : "") + "        </p>\n    </div>\n";
    }, "82": function (container, depth0, helpers, partials, data) {
        var stack1;

        return (stack1 = (helpers["switch"] || depth0 && depth0["switch"] || helpers.helperMissing).call(depth0 != null ? depth0 : container.nullContext || {}, depth0 != null ? depth0.domain : depth0, { "name": "switch", "hash": {}, "fn": container.program(83, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "";
    }, "83": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            options,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            buffer = (stack1 = (helpers["case"] || depth0 && depth0["case"] || alias2).call(alias1, "www.ebay.com", { "name": "case", "hash": {}, "fn": container.program(84, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "";
        stack1 = (helper = (helper = helpers["default"] || (depth0 != null ? depth0["default"] : depth0)) != null ? helper : alias2, options = { "name": "default", "hash": {}, "fn": container.program(89, data, 0), "inverse": container.noop, "data": data }, typeof helper === "function" ? helper.call(alias1, options) : helper);
        if (!helpers["default"]) {
            stack1 = helpers.blockHelperMissing.call(depth0, stack1, options);
        }
        if (stack1 != null) {
            buffer += stack1;
        }
        return buffer;
    }, "84": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {};

        return "                        <a href=\"#\" class=\"" + ((stack1 = helpers["if"].call(alias1, (stack1 = depth0 != null ? depth0.user : depth0) != null ? stack1.auth : stack1, { "name": "if", "hash": {}, "fn": container.program(85, data, 0), "inverse": container.program(87, data, 0), "data": data })) != null ? stack1 : "") + " js_cashbackMessage\">\n                            Get " + container.escapeExpression((helper = (helper = helpers.cashback || (depth0 != null ? depth0.cashback : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(alias1, { "name": "cashback", "hash": {}, "data": data }) : helper)) + " Cashback Here\n                        </a>\n";
    }, "85": function (container, depth0, helpers, partials, data) {
        return "js_triggerCashback";
    }, "87": function (container, depth0, helpers, partials, data) {
        return "js_showAccount";
    }, "89": function (container, depth0, helpers, partials, data) {
        var helper;

        return "                        <a href=\"#\" class=\"js_triggerCashback js_cashbackMessage\">\n                            Get " + container.escapeExpression((helper = (helper = helpers.cashback || (depth0 != null ? depth0.cashback : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, { "name": "cashback", "hash": {}, "data": data }) : helper)) + " Cashback Here\n                        </a>\n";
    }, "91": function (container, depth0, helpers, partials, data) {
        return "                <a href=\"#\" class=\"js_disabled\">Never Overpay Again</a>\n";
    }, "93": function (container, depth0, helpers, partials, data) {
        return "Account";
    }, "95": function (container, depth0, helpers, partials, data) {
        return "Login";
    }, "compiler": [7, ">= 4.0.0"], "main": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function",
            alias4 = container.escapeExpression,
            alias5 = container.lambda;

        return "<div id=\"stores-recognized-auto\" class=\"container trying-codes\">\n    <div class=\"piggy-is-ready-top\">\n        <div class=\"header-image\">\n            <img class=\"laptop-piggy\" src=\"" + alias4((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/laptop-piggy.png\"/>\n        </div>\n        <div class=\"header-content\">\n            <a href=\"#\" class=\"close js_close\"><img src=\"" + alias4((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/close.png\"/></a>\n            <p class=\"js_title piggy-is-ready\">\n" + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.domainNotSupported : depth0, { "name": "if", "hash": {}, "fn": container.program(1, data, 0), "inverse": container.program(9, data, 0), "data": data })) != null ? stack1 : "") + "            </p>\n            <p class=\"js_quote piggy-is-funny\"></p>\n        </div>\n    </div>\n" + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.domainNotSupported : depth0, { "name": "if", "hash": {}, "fn": container.program(11, data, 0), "inverse": container.program(20, data, 0), "data": data })) != null ? stack1 : "") + "    <div class=\"js_share embed-panel\">\n        <div class=\"clearfix bg-white\">\n            <a href=\"#\" class=\"js_shareGoBack back-link\">&laquo; Back to " + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.domainNotSupported : depth0, { "name": "if", "hash": {}, "fn": container.program(73, data, 0), "inverse": container.program(75, data, 0), "data": data })) != null ? stack1 : "") + "</a>\n            <h2 class=\"text-center\">Share with friends!</h2>\n            <ul class=\"share-links\">\n                <li><a class=\"facebook\" href=\"https://www.facebook.com/sharer/sharer.php?u=" + alias4((helpers.urlencode || depth0 && depth0.urlencode || alias2).call(alias1, (stack1 = depth0 != null ? depth0.links : depth0) != null ? stack1.share : stack1, { "name": "urlencode", "hash": {}, "data": data })) + "\" target=\"_blank\"><i class=\"fa fa-facebook\"></i>Share via Facebook</a></li>\n                <li><a class=\"twitter\" href=\"https://twitter.com/share?text=Piggy+-+Coupons+%26+Cashback!&url=" + alias4((helpers.urlencode || depth0 && depth0.urlencode || alias2).call(alias1, (stack1 = depth0 != null ? depth0.links : depth0) != null ? stack1.share : stack1, { "name": "urlencode", "hash": {}, "data": data })) + "\" target=\"_blank\"><i class=\"fa fa-twitter\"></i>Share via Twitter</a></li>\n                <li><a class=\"email\" href=\"mailto:?subject=Have%20you%20heard%20of%20Piggy%3F&body=Hey,%0A%0AI%20found%20this%20amazing%20new%20browser%20extension%20you%20need%20to%20check%20out.%20It%20will%20save%20you%20time%20money%20by%20automatically%20trying%20coupon%20codes%20on%20your%20favorite%20online%20stores,%20plus%20you%20get%20cash%20back%20from%20thousands%20of%20websites.%0A%0AGo%20to%20" + alias4((helpers.urlencode || depth0 && depth0.urlencode || alias2).call(alias1, (stack1 = depth0 != null ? depth0.links : depth0) != null ? stack1.share : stack1, { "name": "urlencode", "hash": {}, "data": data })) + "%20to%20learn%20more\" target=\"_blank\"><i class=\"fa fa-envelope-o\"></i>Share via Email</a></li>\n            </ul>\n            <div class=\"share-link\">\n            <p>Share Link:</p>\n                <div class=\"box\">\n                    <a href=\"" + alias4(alias5((stack1 = depth0 != null ? depth0.links : depth0) != null ? stack1.share : stack1, depth0)) + "\" target=\"_blank\">" + alias4(alias5((stack1 = depth0 != null ? depth0.links : depth0) != null ? stack1.share : stack1, depth0)) + "</a>\n                </div>\n            </div>\n            <a href=\"#\" class=\"js_copyLink pull-right copy-link\">\n                Copy Link\n            </a>\n        </div>\n    </div>\n    <div class=\"js_account embed-panel\">\n        <div class=\"clearfix bg-white\">\n            <a href=\"#\" class=\"js_accountGoBack back-link\">&laquo; Back to " + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.domainNotSupported : depth0, { "name": "if", "hash": {}, "fn": container.program(73, data, 0), "inverse": container.program(75, data, 0), "data": data })) != null ? stack1 : "") + "</a>\n            <div class=\"js_login login\">\n                <h2 class=\"text-center\">Login</h2>\n                <p class=\"login-or-register\">Login or <a href=\"" + alias4(alias5((stack1 = depth0 != null ? depth0.links : depth0) != null ? stack1.register : stack1, depth0)) + "\" tabindex=\"-1\" target=\"_blank\">Create an Account</a> here to claim your earned rebates</p>\n                <p class=\"js_loginError login-error\"></p>\n                <form id=\"loginForm\" class=\"js_loginForm form-horizontal\">\n                    <input type=\"email\" class=\"login-email form-control\" id=\"js_loginEmail\" placeholder=\"Email\">\n                    <input type=\"password\" style=\"display:none\"/><!-- Fix chrome bug -->\n                    <input type=\"password\" class=\"login-pw form-control\" id=\"js_loginPassword\" placeholder=\"Password\">\n                    <button type=\"submit\" class=\"js_loginSubmit button green_button\">Claim Earnings</button>\n                </form>\n                <div class=\"facebook-login\">\n                    <p>Or</p>\n                    <a href=\"" + alias4(alias5((stack1 = depth0 != null ? depth0.links : depth0) != null ? stack1.auth : stack1, depth0)) + "\" target=\"_blank\" class=\"js_facebookAuth btn btn-facebook\"><i class=\"fa fa-facebook-official\"></i>Login via Facebook</a>\n                </div>\n                </form>\n            </div>\n            <div class=\"js_earnings earnings\">\n                <h2 class=\"text-center\">You're doing great!</h2>\n                <h2 class=\"text-center no-margin\">Keep it up!</h2>\n                <div class=\"clearfix savings-rebates\">\n                    <div class=\"savings\">\n                        <h3>$<span class=\"js_savingsAmount\">" + alias4(alias5((stack1 = depth0 != null ? depth0.user : depth0) != null ? stack1.savings : stack1, depth0)) + "</span></h3>\n                        <h4>Savings</h4>\n                    </div>\n                    <div class=\"rebates\">\n                        <h3>$<span class=\"js_earningsAmount\">" + alias4(alias5((stack1 = depth0 != null ? depth0.user : depth0) != null ? stack1.earnings : stack1, depth0)) + "</span></h3>\n                        <h4>Rebates</h4>\n                    </div>\n                </div>\n                <div class=\"js_settings settings-options\">\n                    <div class=\"option isswitch\">\n                        <span>Cash back alerts</span>\n                        <label class=\"switch\">\n                        <input type=\"checkbox\" name=\"js_setting_cashback_alerts\" value=\"cashbackAlerts\"" + ((stack1 = helpers["if"].call(alias1, (stack1 = (stack1 = depth0 != null ? depth0.user : depth0) != null ? stack1.preferences : stack1) != null ? stack1.cashbackAlerts : stack1, { "name": "if", "hash": {}, "fn": container.program(77, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "") + ">\n                        <div class=\"slider round\"></div>\n                        </label>\n                    </div>\n                    <div class=\"option isswitch\">\n                        <span>Daily deals emails</span>\n                        <label class=\"switch\">\n                        <input type=\"checkbox\" name=\"js_setting_daily_deals_emails\" value=\"dailyDeals\"" + ((stack1 = helpers["if"].call(alias1, (stack1 = (stack1 = depth0 != null ? depth0.user : depth0) != null ? stack1.preferences : stack1) != null ? stack1.dailyDeals : stack1, { "name": "if", "hash": {}, "fn": container.program(77, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "") + ">\n                        <div class=\"slider round\"></div>\n                        </label>\n                    </div>\n                </div>\n\n                <div class=\"hr\"></div>\n\n                <div class=\"clearfix savings-rebates-links\">\n                    <a href=\"" + alias4(alias5((stack1 = depth0 != null ? depth0.links : depth0) != null ? stack1.account : stack1, depth0)) + "\" target=\"_blank\" class=\"bottom-grey-link\">View your account</a>\n                    <a href=\"#\" class=\"js_logout bottom-grey-link\">Sign Out</a>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"js_faq embed-panel\">\n        <div class=\"clearfix bg-white\">\n            <a href=\"#\" class=\"js_faqGoBack back-link\">&laquo; Back to " + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.domainNotSupported : depth0, { "name": "if", "hash": {}, "fn": container.program(73, data, 0), "inverse": container.program(75, data, 0), "data": data })) != null ? stack1 : "") + "</a>\n            <h2 class=\"text-center\">FAQ</h2>\n            <div class=\"faq-accordion\">\n                Loading...\n			</div>\n        </div>\n    </div>\n" + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.cashbackHasFired : depth0, { "name": "if", "hash": {}, "fn": container.program(79, data, 0), "inverse": container.program(81, data, 0), "data": data })) != null ? stack1 : "") + "    <div class=\"footer-links\">\n        <ul>\n            <li><a href=\"#\" class=\"js_footerShare\">Share</a></li>\n            <li><a href=\"#\" class=\"js_footerAccount js_showAccount\">" + ((stack1 = helpers["if"].call(alias1, (stack1 = depth0 != null ? depth0.user : depth0) != null ? stack1.auth : stack1, { "name": "if", "hash": {}, "fn": container.program(93, data, 0), "inverse": container.program(95, data, 0), "data": data })) != null ? stack1 : "") + "</a></li>\n            <li><a href=\"#\" class=\"js_footerFAQ\">FAQ</a></li>\n            <li><a href=\"mailto:help@joinpiggy.com\" target=\"_blank\">Support</a></li>\n        </ul>\n    </div>\n</div>";
    }, "useData": true });
exports["Piggy"]["templates"]["codes-applied-blue"] = Handlebars.template({ "compiler": [7, ">= 4.0.0"], "main": function (container, depth0, helpers, partials, data) {
        var helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function",
            alias4 = container.escapeExpression;

        return "<div id=\"codes-applied-blue\" class=\"blue container_codes_applied\">\n    <div class=\"top\">\n        <a href=\"#\" class=\"close-icon\"></a>\n        <div class=\"content\">\n            <p class=\"congratulations\">Congratulations!</p>\n            <div class=\"text-block\">\n                <p>Just added Coupons and you saved:</p> \n            </div>\n            <p class=\"saved_amount\">$" + alias4((helper = (helper = helpers.saved_big || (depth0 != null ? depth0.saved_big : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "saved_big", "hash": {}, "data": data }) : helper)) + "<sup>" + alias4((helper = (helper = helpers.saved_small || (depth0 != null ? depth0.saved_small : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "saved_small", "hash": {}, "data": data }) : helper)) + "</sup></p>\n        </div>\n    </div>\n    <div class=\"bottom\">\n        <p class=\"write_a_review\">Write a review and keep Piggy free</p>\n        <a href=\"#\" class=\"uppercase button oval_button scarlet_button write-review\">Write a Review</a>\n        <a href=\"#\" class=\"reload-cart block-centered green_link\">Not now, back to cart</a>\n    </div>\n</div>";
    }, "useData": true });
exports["Piggy"]["templates"]["codes-applied-green"] = Handlebars.template({ "compiler": [7, ">= 4.0.0"], "main": function (container, depth0, helpers, partials, data) {
        var helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function",
            alias4 = container.escapeExpression;

        return "<div class=\"green container_codes_applied\">\n    <div class=\"top\">\n        <a href=\"#\" class=\"close-icon\"></a>\n        <div class=\"content\">\n            <p class=\"congratulations\">Congratulations!</p>\n            <div class=\"text-block\">\n                <p>Just added Coupons and you saved:</p> \n            </div>\n            <p class=\"saved_amount\">$" + alias4((helper = (helper = helpers.saved_big || (depth0 != null ? depth0.saved_big : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "saved_big", "hash": {}, "data": data }) : helper)) + "<sup>" + alias4((helper = (helper = helpers.saved_small || (depth0 != null ? depth0.saved_small : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "saved_small", "hash": {}, "data": data }) : helper)) + "</sup></p>\n        </div>\n    </div>\n    <div class=\"bottom\">\n        <p class=\"write_a_review\">Write a review and keep Piggy free</p>\n        <a href=\"#\" class=\"button oval_button orange_button write-review\">Write a Review</a>\n        <a href=\"#\" class=\"reload-cart block-centered green_link\">Not now, back to cart</a>\n    </div>\n</div>\n";
    }, "useData": true });
exports["Piggy"]["templates"]["domain-not-supported"] = Handlebars.template({ "compiler": [7, ">= 4.0.0"], "main": function (container, depth0, helpers, partials, data) {
        var helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function",
            alias4 = container.escapeExpression;

        return "<div id=\"domain-not-supported\" class=\"container-white\">\n    <a href=\"#\" class=\"close\"><img src=\"" + alias4((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/close-blue.png\"/></a>\n    <img class=\"piggy-logo\" src=\"" + alias4((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/piggy-logo.png\"/>\n    <div class=\"js_notAdded\">\n        <div class=\"middle\">\n            <p class=\"text-left\">We respect your privacy, and since we did not recognize this domain, we have gone dormant until you visit a store we support.</p>\n            <p class=\"f600 domain\">" + alias4((helper = (helper = helpers.domain || (depth0 != null ? depth0.domain : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "domain", "hash": {}, "data": data }) : helper)) + "</p>\n        </div>\n        <div class=\"bottom\">\n            <a href=\"#\" class=\"js_requestSite button blue_invert_button\">Request to Add This Site</a>\n            <a href=\"mailto:help@joinpiggy.com\" target=\"_blank\" class=\"block-centered grey_link\">Report a problem</a>\n        </div>\n    </div>\n    <div class=\"js_added\">\n        <div class=\"middle\">\n            <p class=\"text-left\">Thanks for your input!</p>\n            <p class=\"text-left\">We've added this to the list and will try to get our engineers on it ASAP!</p>\n        </div>\n        <div class=\"bottom\">\n            <p class=\"uppercase f600 love\"><i class=\"fa fa-heart\" aria-hidden=\"true\"></i> Piggy</p>\n            <a href=\"mailto:help@joinpiggy.com\" target=\"_blank\" class=\"block-centered grey_link\">Report a problem</a>\n        </div>\n    </div>\n</div>";
    }, "useData": true });
exports["Piggy"]["templates"]["no-coupons-no-cashback"] = Handlebars.template({ "compiler": [7, ">= 4.0.0"], "main": function (container, depth0, helpers, partials, data) {
        var helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function",
            alias4 = container.escapeExpression;

        return "<div id=\"no-coupons-no-cashback\" class=\"container sad-piggy\">\n    <div class=\"sad-piggy-top\">\n    	<a href=\"#\" class=\"close\"><img src=\"" + alias4((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/close.png\"/></a>\n        <img src=\"" + alias4((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/sad-piggy.png\"/>\n    </div>\n    <div class=\"sad-piggy-bottom\">\n        <p class=\"text\">Coupons are not working here,<br />but we saved you time!<br /><br /><i class=\"fa fa-heart\" aria-hidden=\"true\"></i> Piggy</p>\n    	<a href=\"#\" class=\"reload-cart block-centered grey_link\">Back to Cart</a>\n    </div>\n</div>";
    }, "useData": true });
exports["Piggy"]["templates"]["none-worked-but-cashback"] = Handlebars.template({ "compiler": [7, ">= 4.0.0"], "main": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function";

        return "<div id=\"none-worked-but-cashback\" class=\"white container_codes_applied\">\n    <div class=\"top\">\n    	<a href=\"#\" class=\"close-icon\"></a>\n        <div class=\"content\">\n            <p class=\"congratulations\">Congratulations!</p>\n            <div class=\"text-block\">\n                <p>saved your time and applied</p> \n            </div>\n            <p class=\"saved_amount\">" + container.escapeExpression((helper = (helper = helpers.cashback || (depth0 != null ? depth0.cashback : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "cashback", "hash": {}, "data": data }) : helper)) + "</p>\n            <p class=\"cashback\">CASH BACK</p>\n        </div>\n    </div>\n    <div class=\"bottom\">\n        <p class=\"text-center saved_you_time\">" + ((stack1 = (helper = (helper = helpers.storeName || (depth0 != null ? depth0.storeName : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "storeName", "hash": {}, "data": data }) : helper)) != null ? stack1 : "") + " doesn't have any coupons for your purchase, but Piggy saved you time! Plus, we activated cash back for this order!</p>\n        <a href=\"#\" class=\"reload-cart button oval_button green_button\">Back to Cart</a>\n    </div>\n</div>\n";
    }, "useData": true });
exports["Piggy"]["templates"]["similar-deals"] = Handlebars.template({ "1": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function",
            alias4 = container.escapeExpression;

        return "        <div class=\"deal clearfix\">\n            <div>\n	            <div class=\"deal-right\">\n	                <div class=\"product-text\">\n	                    <a href=\"" + alias4((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "url", "hash": {}, "data": data }) : helper)) + "\" target=\"_blank\">\n                            <p class=\"price\">" + alias4((helper = (helper = helpers.price || (depth0 != null ? depth0.price : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "price", "hash": {}, "data": data }) : helper)) + "</p>\n	                    </a> \n                        <a class=\"store\" href=\"" + alias4((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "url", "hash": {}, "data": data }) : helper)) + "\" target=\"_blank\">\n                            <p>" + alias4((helper = (helper = helpers.merchant || (depth0 != null ? depth0.merchant : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "merchant", "hash": {}, "data": data }) : helper)) + "</p>\n                        </a>\n	                    <a class=\"product\" href=\"" + alias4((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "url", "hash": {}, "data": data }) : helper)) + "\" target=\"_blank\">\n                            <p class=\"title\">" + alias4((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "title", "hash": {}, "data": data }) : helper)) + "</p>\n                            <p class=\"sub-title\">" + alias4((helper = (helper = helpers.shipping || (depth0 != null ? depth0.shipping : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "shipping", "hash": {}, "data": data }) : helper)) + "</p>\n	                    </a>\n	                </div>\n	            </div>\n	            <div class=\"deal-left\">\n                    <a href=\"" + alias4((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "url", "hash": {}, "data": data }) : helper)) + "\" target=\"_blank\"><img src=\"" + alias4((helper = (helper = helpers.image || (depth0 != null ? depth0.image : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "image", "hash": {}, "data": data }) : helper)) + "\" height=\"88\"/></a>\n        		</div>\n            </div>\n" + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.cashback : depth0, { "name": "if", "hash": {}, "fn": container.program(2, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "") + "        </div>\n";
    }, "2": function (container, depth0, helpers, partials, data) {
        var helper;

        return "            <div class=\"deal-bottom\">\n                <p>" + container.escapeExpression((helper = (helper = helpers.cashback || (depth0 != null ? depth0.cashback : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, { "name": "cashback", "hash": {}, "data": data }) : helper)) + "</p>\n            </div>\n";
    }, "compiler": [7, ">= 4.0.0"], "main": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {};

        return "<div id=\"similar-deals-container\" class=\"container\">\n    <div class=\"similar-deals-top\">\n        <p>Similar Deals from Piggy's Partners:</p>\n        <a href=\"#\" class=\"close\"><img src=\"" + container.escapeExpression((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/close.png\"/></a>\n    </div>\n    <div class=\"bottom\">\n" + ((stack1 = helpers.each.call(alias1, depth0 != null ? depth0.products : depth0, { "name": "each", "hash": {}, "fn": container.program(1, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "") + "    </div>\n</div>";
    }, "useData": true });
exports["Piggy"]["templates"]["try-codes-activate"] = Handlebars.template({ "1": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function";

        return "    <p class=\"small\">" + ((stack1 = (helper = (helper = helpers.storeName || (depth0 != null ? depth0.storeName : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "storeName", "hash": {}, "data": data }) : helper)) != null ? stack1 : "") + " has</p>\n    <p class=\"uppercase medium\">" + container.escapeExpression((helper = (helper = helpers.codeCount || (depth0 != null ? depth0.codeCount : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "codeCount", "hash": {}, "data": data }) : helper)) + " Codes</p>\n    <p class=\"uppercase\">To Auto-Try</p>\n    <a href=\"#\" class=\"js_tryCodes button blue_button\">Try Codes</a>\n    <a href=\"#\" class=\"js_seeCodes teal_link\">See coupon codes</a>\n";
    }, "3": function (container, depth0, helpers, partials, data) {
        var stack1;

        return (stack1 = helpers["if"].call(depth0 != null ? depth0 : container.nullContext || {}, depth0 != null ? depth0.cashback : depth0, { "name": "if", "hash": {}, "fn": container.program(4, data, 0), "inverse": container.program(18, data, 0), "data": data })) != null ? stack1 : "";
    }, "4": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function";

        return "    <p class=\"small\">" + ((stack1 = (helper = (helper = helpers.storeName || (depth0 != null ? depth0.storeName : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "storeName", "hash": {}, "data": data }) : helper)) != null ? stack1 : "") + " offers</p>\n    <p class=\"uppercase medium-bold\">" + container.escapeExpression((helper = (helper = helpers.cashback || (depth0 != null ? depth0.cashback : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "cashback", "hash": {}, "data": data }) : helper)) + "</p>\n    <p class=\"uppercase\">Cash Back</p>\n" + ((stack1 = (helpers["switch"] || depth0 && depth0["switch"] || alias2).call(alias1, depth0 != null ? depth0.domain : depth0, { "name": "switch", "hash": {}, "fn": container.program(5, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "") + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.codeCount : depth0, { "name": "if", "hash": {}, "fn": container.program(14, data, 0), "inverse": container.program(16, data, 0), "data": data })) != null ? stack1 : "");
    }, "5": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            options,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            buffer = (stack1 = (helpers["case"] || depth0 && depth0["case"] || alias2).call(alias1, "www.ebay.com", { "name": "case", "hash": {}, "fn": container.program(6, data, 0), "inverse": container.noop, "data": data })) != null ? stack1 : "";
        stack1 = (helper = (helper = helpers["default"] || (depth0 != null ? depth0["default"] : depth0)) != null ? helper : alias2, options = { "name": "default", "hash": {}, "fn": container.program(11, data, 0), "inverse": container.noop, "data": data }, typeof helper === "function" ? helper.call(alias1, options) : helper);
        if (!helpers["default"]) {
            stack1 = helpers.blockHelperMissing.call(depth0, stack1, options);
        }
        if (stack1 != null) {
            buffer += stack1;
        }
        return buffer;
    }, "6": function (container, depth0, helpers, partials, data) {
        var stack1;

        return (stack1 = helpers["if"].call(depth0 != null ? depth0 : container.nullContext || {}, (stack1 = depth0 != null ? depth0.user : depth0) != null ? stack1.auth : stack1, { "name": "if", "hash": {}, "fn": container.program(7, data, 0), "inverse": container.program(9, data, 0), "data": data })) != null ? stack1 : "";
    }, "7": function (container, depth0, helpers, partials, data) {
        return "                <a href=\"#\" class=\"js_activateCashback button blue_button\">Activate</a>\n";
    }, "9": function (container, depth0, helpers, partials, data) {
        return "                <a href=\"#\" class=\"js_openPiggy button blue_button cashback-w-auth\">Sign In to Activate</a>\n";
    }, "11": function (container, depth0, helpers, partials, data) {
        var stack1;

        return (stack1 = helpers["if"].call(depth0 != null ? depth0 : container.nullContext || {}, depth0 != null ? depth0.cashbackHasFired : depth0, { "name": "if", "hash": {}, "fn": container.program(12, data, 0), "inverse": container.program(7, data, 0), "data": data })) != null ? stack1 : "";
    }, "12": function (container, depth0, helpers, partials, data) {
        return "                <a href=\"#\" class=\"js_activateCashback button green_button\">Activated!</a>\n";
    }, "14": function (container, depth0, helpers, partials, data) {
        var helper;

        return "    <a href=\"#\" class=\"js_openPiggy teal_link\">See " + container.escapeExpression((helper = (helper = helpers.codeCount || (depth0 != null ? depth0.codeCount : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, { "name": "codeCount", "hash": {}, "data": data }) : helper)) + " Codes</a>\n";
    }, "16": function (container, depth0, helpers, partials, data) {
        return "    <a href=\"#\" class=\"js_openPiggy teal_link\">Open Piggy</a>\n";
    }, "18": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {};

        return "    <p class=\"small\">" + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.storeName : depth0, { "name": "if", "hash": {}, "fn": container.program(19, data, 0), "inverse": container.program(21, data, 0), "data": data })) != null ? stack1 : "") + " has</p>\n    <p class=\"uppercase medium\">" + container.escapeExpression((helper = (helper = helpers.codeCount || (depth0 != null ? depth0.codeCount : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(alias1, { "name": "codeCount", "hash": {}, "data": data }) : helper)) + " Codes</p>\n    <p class=\"uppercase\">To Try</p>\n    <a href=\"#\" class=\"js_openPiggy button blue_button\">See Codes</a>\n    ";
    }, "19": function (container, depth0, helpers, partials, data) {
        var stack1, helper;

        return (stack1 = (helper = (helper = helpers.storeName || (depth0 != null ? depth0.storeName : depth0)) != null ? helper : helpers.helperMissing, typeof helper === "function" ? helper.call(depth0 != null ? depth0 : container.nullContext || {}, { "name": "storeName", "hash": {}, "data": data }) : helper)) != null ? stack1 : "";
    }, "21": function (container, depth0, helpers, partials, data) {
        return "This store";
    }, "compiler": [7, ">= 4.0.0"], "main": function (container, depth0, helpers, partials, data) {
        var stack1,
            helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function",
            alias4 = container.escapeExpression;

        return "<div id=\"try-codes-activate-option\" class=\"try-codes container-white\">\n    <a href=\"#\" class=\"js_close close\"><img src=\"" + alias4((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/close-blue.png\"/></a>\n    <img class=\"piggy-logo\" src=\"" + alias4((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/piggy-logo.png\"/>\n" + ((stack1 = helpers["if"].call(alias1, depth0 != null ? depth0.autotryEnabled : depth0, { "name": "if", "hash": {}, "fn": container.program(1, data, 0), "inverse": container.program(3, data, 0), "data": data })) != null ? stack1 : "") + "</div>";
    }, "useData": true });
exports["Piggy"]["templates"]["trying-codes"] = Handlebars.template({ "compiler": [7, ">= 4.0.0"], "main": function (container, depth0, helpers, partials, data) {
        var helper,
            alias1 = depth0 != null ? depth0 : container.nullContext || {},
            alias2 = helpers.helperMissing,
            alias3 = "function",
            alias4 = container.escapeExpression;

        return "<div id=\"trying-codes\" class=\"container already-saved\">\n    <div class=\"already-saved-top\">\n        <div class=\"header-image\">\n            <img src=\"" + alias4((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/backpack.png\"/>\n        </div>\n        <div class=\"header-content\">\n            <a href=\"#\" class=\"js_close close\"><img src=\"" + alias4((helper = (helper = helpers.extPath || (depth0 != null ? depth0.extPath : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "extPath", "hash": {}, "data": data }) : helper)) + "/img/close.png\"/></a>\n            <p class=\"cash_saved\">$ " + alias4((helper = (helper = helpers.savings || (depth0 != null ? depth0.savings : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "savings", "hash": {}, "data": data }) : helper)) + "</p>\n            <p class=\"amount_saved\">You've already saved</p>\n        </div>\n    </div>\n    <div class=\"already-saved-bottom\">\n        <p class=\"text\">Trying code <span class=\"js_tryingCount\">" + alias4((helper = (helper = helpers.trying_count || (depth0 != null ? depth0.trying_count : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "trying_count", "hash": {}, "data": data }) : helper)) + "</span> of " + alias4((helper = (helper = helpers.codes_count || (depth0 != null ? depth0.codes_count : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "codes_count", "hash": {}, "data": data }) : helper)) + "...</p>\n        <p class=\"text\"><span class=\"js_currentCode\">" + alias4((helper = (helper = helpers.current_code || (depth0 != null ? depth0.current_code : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "current_code", "hash": {}, "data": data }) : helper)) + "</span></p>\n        <div class=\"progress_bar\">\n            <div style=\"width:" + alias4((helper = (helper = helpers.progress_percent || (depth0 != null ? depth0.progress_percent : depth0)) != null ? helper : alias2, typeof helper === alias3 ? helper.call(alias1, { "name": "progress_percent", "hash": {}, "data": data }) : helper)) + "%;\" class=\"js_progressBar current_progress\"></div>\n        </div>\n    </div>\n</div>\n";
    }, "useData": true });