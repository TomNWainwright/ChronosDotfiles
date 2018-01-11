'use strict';

var Config = {

    apiServer: 'https://api.joinpiggy.com',

    wwwServer: 'https://www.joinpiggy.com',

    version: '3.0.32',

    apiToken: '12345',

    testType: '3a2',

    ajaxTimeouts: {
        loadExternalProvider: null,
        applyCouponUrl: null,
        resultUrl: null,
        clearCouponUrl: null,
        cashbackPixel: null
    },

    waitFor: {
        loadExternalProvider: null,
        applyCouponUrl: 1000,
        injectCoupon: 1000,
        resultUrl: null,
        clearCouponUrl: null,
        afterCodeProcessing: 1000,
        slider: 2000, // how long to wait until slider shows,
        backgroundPixel: 6500, // how long to wait for new tab
        doubleCheckingCoupons: 3000 // how long to show double checking message
    },

    defaultPreferences: {
        cashbackAlerts: false,
        dailyDeals: false,
        worksHere: false,
        azSimilarDeals: false
    }

    // Add user-specified options:
};chrome.storage.local.get({
    apiServer: '',
    wwwServer: '',
    emulateDevice: ''
}, function (items) {
    if (items.apiServer !== null && items.apiServer !== '') {
        Config.apiServer = items.apiServer;
    }

    if (items.wwwServer !== null && items.wwwServer !== '') {
        Config.wwwServer = items.wwwServer;
    }

    if (items.emulateDevice !== null && items.emulateDevice !== '') {
        Config.emulateDevice = items.emulateDevice;
    }

    document.dispatchEvent(new CustomEvent('extensionOptionsLoaded'));
});

if (typeof chrome.runtime.getManifest == 'function') {
    var manifest = chrome.runtime.getManifest();
    if (manifest.version) {
        Config.version = manifest.version;
    }
}