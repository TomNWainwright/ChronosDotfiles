'use strict';

/******/(function (modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/var installedModules = {};

	/******/ // The require function
	/******/function __webpack_require__(moduleId) {

		/******/ // Check if module is in cache
		/******/if (installedModules[moduleId])
			/******/return installedModules[moduleId].exports;

		/******/ // Create a new module (and put it into the cache)
		/******/var module = installedModules[moduleId] = {
			/******/exports: {},
			/******/id: moduleId,
			/******/loaded: false
			/******/ };

		/******/ // Execute the module function
		/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		/******/ // Flag the module as loaded
		/******/module.loaded = true;

		/******/ // Return the exports of the module
		/******/return module.exports;
		/******/
	}

	/******/ // expose the modules object (__webpack_modules__)
	/******/__webpack_require__.m = modules;

	/******/ // expose the module cache
	/******/__webpack_require__.c = installedModules;

	/******/ // __webpack_public_path__
	/******/__webpack_require__.p = "";

	/******/ // Load entry module and return exports
	/******/return __webpack_require__(0);
	/******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	var _stringify = __webpack_require__(1);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _promise = __webpack_require__(4);

	var _promise2 = _interopRequireDefault(_promise);

	var _cofund = __webpack_require__(73);

	var _cofund2 = _interopRequireDefault(_cofund);

	var _object = __webpack_require__(78);

	var _object2 = _interopRequireDefault(_object);

	var _string = __webpack_require__(79);

	var _string2 = _interopRequireDefault(_string);

	var _url = __webpack_require__(80);

	var _url2 = _interopRequireDefault(_url);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}

	/* global chrome */
	/* global Config */
	/* global $ */

	var Events = {

		CONFIG_RECEIVED: 'cr',
		_triggers: [],

		addListener: function addListener(event, callback) {
			if (typeof callback !== 'function') return this;
			if (!this._triggers[event]) this._triggers[event] = [];

			this._triggers[event].push(callback);
			return this;
		},
		removeListener: function removeListener(event, callback) {
			if (!this._triggers[event] || this._triggers[event].indexOf(callback) === -1) return this;

			var idx = this._triggers[event].indexOf(callback);
			this._triggers[event].splice(idx, 1);
			return this;
		},
		triggerEvent: function triggerEvent(event, data) {
			if (!this._triggers[event] || !Array.isArray(this._triggers[event])) return false;

			this._triggers[event].forEach(function (v) {
				v(data);
			});
		}
	};

	var Background = {

		extId: null,
		user: null,
		preferences: null,
		savings: 0,
		suppressedDomains: [],

		/**
   * Check if coupons and rules are available for the current site
   */
		lookupConfig: function lookupConfig(sender) {

			var self = this;
			var tabId = sender.tab.id;
			var tabUrl = sender.tab.url;
			var host = _url2.default.getHost(tabUrl);
			var auth = this.getUser() && this.getUser().hasOwnProperty('auth') ? this.getUser().auth : null;

			this.requestConfig(host).then(function (data) {

				var ruleset = data.ruleset;
				var codes = data.codes;
				var codeDetails = data.hasOwnProperty('codeDetails') ? data.codeDetails : null;
				var cashback = data.hasOwnProperty('cashback') ? data.cashback : null;
				var cookieDomain = data.hasOwnProperty('cookieDomain') ? data.cookieDomain : null;
				var flags = data.hasOwnProperty('flags') ? data.flags : null;
				var earnings = data.hasOwnProperty('earnings') ? data.earnings : null;
				var savings = data.hasOwnProperty('savings') ? data.savings : null;

				if (self.suppressedDomains.indexOf(cookieDomain ? cookieDomain : host) !== -1) {
					window.__cfSuppressNext = true; // keep suppressing on this domain
				}
				if (typeof window.__cfIgnoreNextSuppression !== 'undefined') {
					delete window.__cfSuppressNext; // stop suppressing due to source
				}
				if (typeof window.__cfSuppressNext !== 'undefined') {
					if (_cofund2.default.Flags.hasFlag(_cofund2.default.Flags.CHECK_PROMPT_SUPPRESSION, flags)) {
						// Do not prompt the user that we exist until they click (P) icon
						cashback = _cofund2.default.Cashback.setSuppressionFlag(cashback, 'suppress');
						if (self.suppressedDomains.indexOf(cookieDomain ? cookieDomain : host) === -1) {
							self.suppressedDomains.push(cookieDomain ? cookieDomain : host);
						}
					}
				}
				if (tabUrl.indexOf(Config.wwwServer + '/int') == -1) {
					if (typeof window.__cfSuppressNext !== 'undefined') {
						delete window.__cfSuppressNext;
					}
					if (typeof window.__cfIgnoreNextSuppression !== 'undefined') {
						delete window.__cfIgnoreNextSuppression;
					}
				}
				if (codes instanceof Array && ruleset instanceof Object || cashback instanceof Object) {
					// Back to the tab to save the config in a cookie...
					chrome.tabs.sendMessage(tabId, {
						action: 'saveConfig',
						ruleset: ruleset,
						codes: codes,
						codeDetails: codeDetails,
						cashback: cashback,
						cookieDomain: cookieDomain,
						flags: flags
					});
					// Check if the current page is a checkout page
					chrome.tabs.sendMessage(tabId, {
						action: 'testForCheckout',
						url: tabUrl
					});
				} else {
					// Indicate that we have tested
					chrome.tabs.sendMessage(tabId, {
						action: 'setStateConfigReceived'
					});
				}

				//Trigger event config received
				Events.triggerEvent(Events.CONFIG_RECEIVED, { tabId: tabId });

				if (auth && earnings) {
					// Update earnings
					self.setUser({
						auth: self.getUser().auth,
						apiKey: self.getUser().apiKey,
						earnings: earnings
					});
				}
				// Update savings
				if (savings) {
					self.setSavings(savings);
				}
			}).catch(function (e) {
				return console.log(e);
			});
		},

		requestConfig: function requestConfig(host) {
			var _this = this;

			var auth = this.getUser() && this.getUser().hasOwnProperty('auth') ? this.getUser().auth : null;

			return new _promise2.default(function (resolve, reject) {

				$.ajax({
					url: Config.apiServer + '/ext/config?host=' + encodeURIComponent(host) + '&cb=' + encodeURIComponent(Math.random(10000)) + '&app_uid=' + encodeURIComponent(_this.getExtId()) + '&v=' + Config.version + (auth ? '&auth=' + auth : ''),
					dataType: 'json',
					beforeSend: function beforeSend(xhr) {
						if (Config.hasOwnProperty('emulateDevice')) {
							xhr.setRequestHeader('X-Piggy-Device', Config.emulateDevice);
						}
					},
					cache: false,
					success: function success(data) {
						resolve(data);
					},
					error: function error(x, s, e) {
						reject({ x: x, s: s, e: e });
					}
				});
			});
		},

		clearBadge: function clearBadge(sender) {

			var tabId = sender.tab.id;

			chrome.tabs.get(tabId, function (tab) {

				chrome.browserAction.setIcon({
					path: 'icons/tail/v1/gray_19.png',
					tabId: tabId
				}, function () {
					if (chrome.runtime.lastError) {}
				});
			});
		},

		/**
   * Set the badge display
   */
		setBadge: function setBadge(sender, ruleset, codes, cashback) {

			var tabId = sender.tab.id;

			if (!(codes instanceof Array) || codes.length === 0 && cashback instanceof Array) {
				this.clearBadge(sender);
				return;
			}
			if (cashback instanceof Object && cashback.suppressPrompts) {
				this.clearBadge(sender);
				return;
			}

			/* removed
   // Show the green badge if piggy works here
   if ((codes.length > 0) || (cashback && cashback.hasOwnProperty('pay'))) {
       chrome.browserAction.setIcon({path:"icons/p/lightgreen-icon-19.png", tabId:sender.tab.id});
   }
   */

			// Change badge background color to green
			chrome.tabs.get(tabId, function (tab) {

				chrome.browserAction.setBadgeBackgroundColor({
					color: [67, 189, 59, 155],
					tabId: tabId
				});

				chrome.browserAction.setIcon({
					path: 'icons/tail/v1/color_18.png',
					tabId: tabId
				}, function () {
					if (chrome.runtime.lastError) {}
				});

				if (_cofund2.default.Flags.hasFlag(_cofund2.default.Flags.CODE_COUNT_SUPPRESS, ruleset.flags)) {
					chrome.browserAction.setBadgeText({
						text: '',
						tabId: tabId
					});
					return;
				}

				/*
    // Notify that codes are available via the badge
    chrome.browserAction.setBadgeBackgroundColor({
        color: [67,189,59,155],
        tabId: tabId
    });
     chrome.browserAction.setBadgeText({
        text: (codes.length > 0 ? codes.length.toString() : (cashback && cashback.hasOwnProperty('pay') ? '$$' : '')),
        tabId: tabId
    });
    */
			});
		},

		setPopup: function setPopup(tabId, popup) {

			chrome.browserAction.setPopup({
				tabId: tabId,
				popup: popup
			});
		},

		broadcast: function broadcast(tabId) {

			chrome.tabs.sendMessage(tabId, {
				action: 'initStorage',
				extId: this.extId,
				user: this.user,
				preferences: this.preferences,
				savings: this.savings
			});
		},

		broadcastAll: function broadcastAll() {

			var self = this;

			chrome.tabs.query({}, function (tabs) {
				for (var i in tabs) {
					self.broadcast(tabs[i].id);
				}
			});
		},

		/**
   * Preloads storage for faster access across isolated environments
   */
		initStorage: function initStorage(tabId, callback) {

			var self = this;

			// Check if we have a value already
			chrome.storage.local.get(['_cofund.id', '_cofund.auth', '_cofund.hasReviewed', '_cofund.appKey', '_cofund.earnings', '_cofund.preferences', '_cofund.savings', '_cofund.reviewTimeLimit'], function (data) {
				// Extension id
				if (data.hasOwnProperty('_cofund.id')) {
					self.extId = data['_cofund.id'];
					_cofund2.default.Info.setExtId(self.extId);
				} else {
					var randomId = self._getRandomId();
					chrome.storage.local.set({ '_cofund.id': randomId }, function () {});
					console.log('Extension id assigned', randomId);
					self.extId = randomId;
					_cofund2.default.Info.setExtId(self.extId);
				}
				if (data.hasOwnProperty('_cofund.hasReviewed')) {
					_cofund2.default.Info.hasReviewed = data['_cofund.hasReviewed'];
				} else {
					chrome.storage.local.set({ '_cofund.hasReviewed': false });
				}
				if (data.hasOwnProperty('_cofund.reviewTimeLimit')) {
					_cofund2.default.Info.reviewTimeLimit = data['_cofund.reviewTimeLimit'];
				} else {
					chrome.storage.local.set({ '_cofund.reviewTimeLimit': 0 });
				}
				if (data.hasOwnProperty('_cofund.auth') && data.hasOwnProperty('_cofund.appKey') && data.hasOwnProperty('_cofund.earnings')) {
					self.user = {
						auth: data['_cofund.auth'],
						appKey: data['_cofund.appKey'],
						earnings: data['_cofund.earnings']
					};
					_cofund2.default.Info.setUser(self.user);
				}
				if (data.hasOwnProperty('_cofund.preferences')) {
					self.preferences = $.extend(Config.defaultPreferences, JSON.parse(data['_cofund.preferences']));
					_cofund2.default.Info.setPreferences(self.preferences);
				}
				if (data.hasOwnProperty('_cofund.savings')) {
					self.savings = parseFloat(data['_cofund.savings']);
					_cofund2.default.Info.setSavings(self.savings);
				}
				if (tabId) {
					self.broadcast(tabId);
				}
				if (callback) {
					callback(self.extId, self.user, self.preferences, self.savings);
				}
			});
		},

		getExtId: function getExtId() {

			return this.extId;
		},

		getUser: function getUser() {

			return this.user;
		},

		/**
   * Login
   */
		setUser: function setUser(data) {

			var self = this;

			chrome.storage.local.set({
				'_cofund.auth': data.auth,
				'_cofund.appKey': data.app_key,
				'_cofund.earnings': data.earnings
			}, function () {
				self.user = {
					auth: data.auth,
					appKey: data.app_key,
					earnings: data.earnings
				};
				self.broadcastAll();
			});
		},

		/**
   * Logout
   */
		clearUser: function clearUser() {

			var self = this;

			chrome.storage.local.remove(['_cofund.auth', '_cofund.appKey', '_cofund.earnings'], function () {
				self.user = {
					auth: null,
					appKey: null,
					earnings: null
				};
				self.broadcastAll();
			});
		},

		getPreferences: function getPreferences() {

			return this.preferences;
		},

		setPreferences: function setPreferences(preferences) {

			var self = this;
			var fullPreferences = $.extend(Config.defaultPreferences, preferences);

			chrome.storage.local.set({
				'_cofund.preferences': (0, _stringify2.default)(fullPreferences)
			}, function () {
				self.preferences = fullPreferences;
				self.broadcastAll();
			});
		},

		getSavings: function getSavings() {

			return this.savings;
		},

		setSavings: function setSavings(savings) {

			var self = this;

			chrome.storage.local.set({
				'_cofund.savings': parseFloat(savings)
			}, function () {
				self.savings = parseFloat(savings);
				self.broadcastAll();
			});
		},

		addSavings: function addSavings(savings, storeId, offerId, codes, url) {

			var self = this;
			var host = _url2.default.getHost(url);

			chrome.storage.local.set({
				'_cofund.savings': this.savings + parseFloat(savings)
			}, function () {
				self.savings += parseFloat(savings);
				self.broadcastAll();
				// Send a copy to the server
				$.ajax({
					type: 'POST',
					url: Config.apiServer + '/ext/savedYouMoney?app_uid=' + self.getExtId() + '&v=' + Config.version,
					data: {
						s: storeId,
						o: offerId,
						savings: savings,
						codes: codes.join(';'),
						domain: host,
						auth: self.getUser() ? self.getUser().auth : ''
					}
				});
			});
		},

		clearSuppressedDomains: function clearSuppressedDomains() {

			this.suppressedDomains = [];
		},

		_getRandomId: function _getRandomId() {

			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		}

	};

	/**
  * Start here:
  * Called whenever a tab changes or background processing is required:
  */
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		switch (request.action) {
			case 'start':
				if (!sender.hasOwnProperty('tab') || !sender.tab) {
					return;
				}
				if (sender.tab.url === 'newtab') {
					return;
				}

				var suppressionDecision = 'continue';
				if (Background.suppressedDomains.indexOf(request.ruleset && request.ruleset.hasOwnProperty('cookieDomain') ? request.ruleset.cookieDomain : _url2.default.getHost(sender.tab.url)) !== -1) {
					suppressionDecision = 'suppress';
				}
				request.cashback = _cofund2.default.Cashback.setSuppressionFlag(request.cashback, suppressionDecision);

				Background.initStorage(sender.tab.id, function () {

					var state = request.state;
					if (!state) {
						// Only do this once per session
						Background.lookupConfig(sender);
						Background.setBadge(sender, request.ruleset, request.codes, request.cashback);
					} else {
						Background.setBadge(sender, request.ruleset, request.codes, request.cashback);

						//Trigger event config received
						Events.triggerEvent(Events.CONFIG_RECEIVED, { tabId: sender.tab.id, state: state });
					}

					// Test for checkout
					chrome.tabs.sendMessage(sender.tab.id, {
						action: 'testForCheckout',
						url: sender.tab.url
					});
				});
				// Notify the tab of suppression decision
				sendResponse({
					suppressionDecision: suppressionDecision
				});
				break;
			case 'setBadge':
				Background.setBadge(sender, request.ruleset, request.codes, request.cashback);
				break;
			case 'setPopup':
				Background.setPopup(sender.tab.id, request.popup);
				break;
			case 'loadExternalProvider':
				if (typeof InstallTrigger !== 'undefined') {
					// Moz detect
					chrome.tabs.executeScript(sender.tab.id, {
						file: chrome.extension.getURL('providers/' + request.name + '.js')
					}, function () {
						if (chrome.runtime.lastError) {
							_cofund2.default.Events.logProviderError('Error loading ExternalProvider: ' + chrome.runtime.lastError.message);
						}
					});
				} else {
					$.ajax({
						url: Config.apiServer + '/ext/provider?name=' + request.name,
						beforeSend: function beforeSend(xhr) {
							if (Config.hasOwnProperty('emulateDevice')) {
								xhr.setRequestHeader('X-Piggy-Device', Config.emulateDevice);
							}
						},
						cache: false,
						success: function success(data) {
							var data = 'if ((typeof $ === \'undefined\') && (typeof jQuery !== \'undefined\')) { var $ = jQuery; }\n' + data;
							chrome.tabs.executeScript(sender.tab.id, {
								code: data
							}, function () {
								if (chrome.runtime.lastError) {
									_cofund2.default.Events.logProviderError('Error loading ExternalProvider: ' + chrome.runtime.lastError.message);
								}
							});
						},
						error: function error(x, s, e) {
							console.log(x, s, e);
						}
					});
				}
				break;
			case 'firePixel':
				$.ajax({
					type: 'GET',
					url: request.url,
					cache: false,
					timeout: Config.ajaxTimeouts.cashbackPixel,
					success: function success(response, status, $xhr) {
						_cofund2.default.Events.logCashbackFired();
					},
					error: function error(response) {
						_cofund2.default.Events.logCashbackFireFailed();
					}
				});
				break;
			case 'firePixelCrossDomain':
				chrome.tabs.create({
					url: request.url,
					active: false
				}, function (tab) {

					//Add listener to event config received from new tab
					Events.addListener(Events.CONFIG_RECEIVED, function listener(_ref) {
						var tabId = _ref.tabId,
						    state = _ref.state;

						if (tabId === tab.id) {

							//Remove listener
							Events.removeListener(Events.CONFIG_RECEIVED, listener);

							//Fire cashback for new tab
							chrome.tabs.sendMessage(tab.id, { action: 'enforceFirePixel' });

							//Set state to codes presented to prevent popup popout
							if (!state) chrome.tabs.sendMessage(tab.id, { action: 'setStateCodesPresented' });

							chrome.tabs.update(tab.id, { active: true });
							sendResponse();
						}
					});
				});
				return true;
				break;
			case 'openTab':
				chrome.tabs.create({
					url: request.url,
					active: false
				}, function (tab) {
					if (Config.waitFor.backgroundPixel) {
						setTimeout(function () {
							chrome.tabs.remove(tab.id);
						}, Config.waitFor.backgroundPixel);
					}
				});
				break;
			case 'getExtId':
				return Background.getExtId();
			case 'getUser':
				return Background.getUser();
			case 'setUser':
				if (request.hasOwnProperty('user')) {
					Background.setUser(request.user);
				}
				break;
			case 'clearUser':
				Background.clearUser();
				break;
			case 'getPreferences':
				return Background.getPreferences();
			case 'setPreferences':
				if (request.hasOwnProperty('preferences')) {
					Background.setPreferences(request.preferences);
				}
				break;
			case 'getSavings':
				return Background.getSavings();
			case 'setSavings':
				Background.setSavings(request.savings);
				break;
			case 'addSavings':
				if (request.hasOwnProperty('savings')) {
					Background.addSavings(request.savings, request.storeId || 0, request.offerId || 0, request.codes, sender.tab.url);
				}
				break;
			case 'checkReview':
				sendResponse(!_cofund2.default.Info.hasReviewed && Date.now() > _cofund2.default.Info.reviewTimeLimit);
				break;
			case 'reviewLater':
				// Ask a review after 3 days
				chrome.storage.local.set({ '_cofund.reviewTimeLimit': Date.now() + 1000 * 60 * 60 * 24 * 3 });
				break;
			case 'addReview':
				chrome.tabs.create({ url: Config.apiServer + '/ext/reviews' }, function () {
					chrome.storage.local.set({ '_cofund.hasReviewed': true }, function () {
						_cofund2.default.Info.hasReviewed = true;
					});
					// Report a Review
					$.ajax({
						type: "POST",
						url: Config.wwwServer + '/api/logreview',
						data: {
							token: Config.apiToken,
							app_uid: Background.getExtId(),
							v: Config.version,
							auth: Background.getUser() && Background.getUser().hasOwnProperty('auth') ? Background.getUser().auth : null,
							has_reviewed: 1
						}
					});
				});
				break;
			case 'sendCodeFeedback':
				if (request.feedback === 'positive') {
					$.ajax({
						url: Config.wwwServer + '/offerlike?app_uid=' + Background.getExtId() + '&code=' + request.code + '&offer_id=' + request.offerId,
						type: 'GET',
						cache: false
					});
				} else {
					$.ajax({
						url: Config.wwwServer + '/offerdislike?app_uid=' + Background.getExtId() + '&code=' + request.code + '&offer_id=' + request.offerId,
						type: 'GET',
						cache: false
					});
				}
				break;
			case 'seeDeals':
				chrome.tabs.create({ url: request.url }, function (tab) {
					chrome.tabs.sendMessage(sender.tab.id, {
						action: 'fireCashback'
					});
				});
				break;
			case 'loadFAQ':
				$.ajax({
					url: Config.apiServer + '/ext/faqs',
					dataType: 'json',
					success: function success(data) {
						sendResponse(data);
					}
				});
				return true; // this is important!
				break;
			case 'login':
				$.ajax({
					url: Config.wwwServer + '/api/login?token=' + Config.apiToken + '&app_uid=' + Background.getExtId() + '&v=' + Config.version,
					type: 'POST',
					data: {
						email: request.email,
						password: request.password
					},
					success: function success(data) {
						if (data && data.hasOwnProperty('ok') && data.ok === true && data.hasOwnProperty('auth') && data.hasOwnProperty('app_key')) {
							Background.user = {
								auth: data.auth,
								appKey: data.app_key,
								earnings: data.earnings
							};
							Background.savings = parseFloat(data.savings);
							_cofund2.default.Info.setUser(Background.user);
							_cofund2.default.Info.setSavings(Background.savings);
							Background.setUser(Background.user);
							Background.setSavings(Background.savings);
							sendResponse({
								result: 'ok'
							});
						} else {
							sendResponse({
								result: 'not_authorized'
							});
						}
					},
					error: function error() {
						sendResponse({
							result: 'not_authorized'
						});
					}
				});
				return true;
				break;
			case 'requestAddSite':
				$.get(Config.apiServer + '/ext/addStoreRequest?domain_name=' + request.domain + '&store_title=' + request.domain + '&app_uid=' + Background.getExtId() + '&v=' + Config.version, function (response) {
					sendResponse({
						result: 'ok'
					});
				});
				return true;
				break;
			case 'cofundEvent':
				if (_cofund2.default.Events.hasOwnProperty(request.method)) {
					_cofund2.default.Events[request.method].call(_cofund2.default.Events, {
						message: request.parameters || null,
						cashback: request.cashback || {}
					});
				}
				break;
			case 'cofundSessionUpdate':
				_cofund2.default.Session.update(request.triggers, request.cashback);
				break;
			case 'cofundSessionUpdateOne':
				_cofund2.default.Session.updateOne(request.trigger, request.val, request.cashback);
				break;
			case 'amazonCoupons':

				var settings = {
					"url": Config.apiServer + '/ext/amazoncoupons?app_uid=' + Background.getExtId() + '&v=' + Config.version,
					"method": "POST",
					"data": {
						source: request.isCartPage ? 'cart' : 'product',
						items: request.isCartPage ? request.product : [request.product]
					}
				};
				$.ajax(settings);
				return true;
				break;

		}
	});

	chrome.tabs.onCreated.addListener(function (tab) {
		setTimeout(function () {
			chrome.tabs.get(tab.id, function (tab) {
				var host = _url2.default.getHost(tab.url);
				var isHostFound = false;
				for (var i in Background.suppressedDomains) {
					if (host.indexOf(Background.suppressedDomains[i]) !== -1) {
						isHostFound = true;
					}
				}
				if (!isHostFound) {
					Background.clearSuppressedDomains();
					chrome.tabs.query({}, function (tabs) {
						for (var i in tabs) {
							chrome.tabs.sendMessage(tabs[i].id, {
								action: 'clearSuppressionFlags'
							});
						}
					});
				}
			});
		}, 500);
	});

	chrome.browserAction.onClicked.addListener(function (tab) {
		chrome.tabs.sendMessage(tab.id, {
			action: 'showActiveModal'
		});
		Background.clearSuppressedDomains();
		chrome.tabs.query({}, function (tabs) {
			for (var i in tabs) {
				chrome.tabs.sendMessage(tabs[i].id, {
					action: 'clearSuppressionFlags'
				});
			}
		});
	});

	setTimeout(function () {
		chrome.webRequest.onBeforeRequest.addListener(function (details) {
			var url = details.url.toLowerCase();
			// If detected, block all unsolicited Piggy prompts for the next loaded site
			if (url.indexOf('afsrc=1') !== -1 || url.indexOf('linksynergy') !== -1 || url.indexOf('affiliate.rakuten.com') !== -1 || url.indexOf('partnerid=linkshare') !== -1 || url.indexOf('apmebf.com') !== -1 || url.indexOf('www.anrdoezrs.net') !== -1 || url.indexOf('www.commission-junction.com') !== -1 || url.indexOf('www.dpbolvw.net') !== -1 || url.indexOf('www.jdoqocy.com') !== -1 || url.indexOf('www.kqzyfj.com') !== -1 || url.indexOf('www.qksrv.net') !== -1 || url.indexOf('www.tkqlhce.com') !== -1 || url.indexOf('www.qksz.net') !== -1 || url.indexOf('www.emjcd.com') !== -1 || url.indexOf('www.afcyhf.com') !== -1 || url.indexOf('www.awltovhc.com') !== -1 || url.indexOf('www.ftjcfx.com') !== -1 || url.indexOf('www.lduhtrp.net') !== -1 || url.indexOf('www.tqlkg.com') !== -1 || url.indexOf('www.awxibrm.com') !== -1 || url.indexOf('www.cualbr.com') !== -1 || url.indexOf('www.rnsfpw.net') !== -1 || url.indexOf('www.vofzpwh.com') !== -1 || url.indexOf('www.yceml.net') !== -1 || url.indexOf('www.cj.com') !== -1) {
				if (typeof window.__cfIgnoreNextSuppression === 'undefined') {
					window.__cfSuppressNext = true;
				}
			}
			// If coming via one of our sites, never suppress
			if (url.indexOf(Config.wwwServer + '/int') !== -1) {
				window.__cfIgnoreNextSuppression = true;
			}
		}, {
			urls: ["*://*/*"],
			types: ['main_frame']
		});
	}, 1000);

	/**
   * Load the thankyou page on install
   */
	chrome.runtime.onInstalled.addListener(function (details) {
		if (details.reason === "install") {
			Background.initStorage(null, function (extId) {
				// Opens thank-you in current tab
				chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
					chrome.tabs.update(tabs[0].id, { url: Config.wwwServer + '/api/install?app_uid=' + extId + '&v=' + Config.version + '&token=' + Config.apiToken + '&r=thankyou' }, function (tab) {
						setTimeout(function () {
							chrome.tabs.executeScript(tab.id, { code: "var toolbar = document.createElement('TOOLBAR'); toolbar.id = 'browserappinstalled'; toolbar.setAttribute('app_uid', '" + extId + "'); toolbar.setAttribute('version', '" + Config.version + "'); document.body.appendChild(toolbar);" }, function (results) {
								console.log("Extension installed", extId);
							});
						}, 500);
					});
				});
				chrome.runtime.setUninstallURL(Config.apiServer + '/ext/uninstall?app_uid=' + extId + '&v=' + Config.version, function () {});
			});
		} else if (details.reason === 'update') {
			Background.initStorage(null);
		}
	});

	/***/
},
/* 1 */
/***/function (module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(2), __esModule: true };

	/***/
},
/* 2 */
/***/function (module, exports, __webpack_require__) {

	var core = __webpack_require__(3);
	var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
	module.exports = function stringify(it) {
		// eslint-disable-line no-unused-vars
		return $JSON.stringify.apply($JSON, arguments);
	};

	/***/
},
/* 3 */
/***/function (module, exports) {

	var core = module.exports = { version: '2.5.1' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


	/***/
},
/* 4 */
/***/function (module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(5), __esModule: true };

	/***/
},
/* 5 */
/***/function (module, exports, __webpack_require__) {

	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(50);
	__webpack_require__(54);
	__webpack_require__(71);
	__webpack_require__(72);
	module.exports = __webpack_require__(3).Promise;

	/***/
},
/* 6 */
/***/function (module, exports) {

	/***/},
/* 7 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	var $at = __webpack_require__(8)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(11)(String, 'String', function (iterated) {
		this._t = String(iterated); // target
		this._i = 0; // next index
		// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
		var O = this._t;
		var index = this._i;
		var point;
		if (index >= O.length) return { value: undefined, done: true };
		point = $at(O, index);
		this._i += point.length;
		return { value: point, done: false };
	});

	/***/
},
/* 8 */
/***/function (module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(9);
	var defined = __webpack_require__(10);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function (TO_STRING) {
		return function (that, pos) {
			var s = String(defined(that));
			var i = toInteger(pos);
			var l = s.length;
			var a, b;
			if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
			a = s.charCodeAt(i);
			return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
		};
	};

	/***/
},
/* 9 */
/***/function (module, exports) {

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	module.exports = function (it) {
		return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	/***/
},
/* 10 */
/***/function (module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
		if (it == undefined) throw TypeError("Can't call method on  " + it);
		return it;
	};

	/***/
},
/* 11 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	var LIBRARY = __webpack_require__(12);
	var $export = __webpack_require__(13);
	var redefine = __webpack_require__(27);
	var hide = __webpack_require__(17);
	var has = __webpack_require__(28);
	var Iterators = __webpack_require__(29);
	var $iterCreate = __webpack_require__(30);
	var setToStringTag = __webpack_require__(46);
	var getPrototypeOf = __webpack_require__(48);
	var ITERATOR = __webpack_require__(47)('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () {
		return this;
	};

	module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
		$iterCreate(Constructor, NAME, next);
		var getMethod = function (kind) {
			if (!BUGGY && kind in proto) return proto[kind];
			switch (kind) {
				case KEYS:
					return function keys() {
						return new Constructor(this, kind);
					};
				case VALUES:
					return function values() {
						return new Constructor(this, kind);
					};
			}return function entries() {
				return new Constructor(this, kind);
			};
		};
		var TAG = NAME + ' Iterator';
		var DEF_VALUES = DEFAULT == VALUES;
		var VALUES_BUG = false;
		var proto = Base.prototype;
		var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
		var $default = $native || getMethod(DEFAULT);
		var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
		var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
		var methods, key, IteratorPrototype;
		// Fix native
		if ($anyNative) {
			IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
			if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
				// Set @@toStringTag to native iterators
				setToStringTag(IteratorPrototype, TAG, true);
				// fix for some old engines
				if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
			}
		}
		// fix Array#{values, @@iterator}.name in V8 / FF
		if (DEF_VALUES && $native && $native.name !== VALUES) {
			VALUES_BUG = true;
			$default = function values() {
				return $native.call(this);
			};
		}
		// Define iterator
		if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
			hide(proto, ITERATOR, $default);
		}
		// Plug for library
		Iterators[NAME] = $default;
		Iterators[TAG] = returnThis;
		if (DEFAULT) {
			methods = {
				values: DEF_VALUES ? $default : getMethod(VALUES),
				keys: IS_SET ? $default : getMethod(KEYS),
				entries: $entries
			};
			if (FORCED) for (key in methods) {
				if (!(key in proto)) redefine(proto, key, methods[key]);
			} else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
		}
		return methods;
	};

	/***/
},
/* 12 */
/***/function (module, exports) {

	module.exports = true;

	/***/
},
/* 13 */
/***/function (module, exports, __webpack_require__) {

	var global = __webpack_require__(14);
	var core = __webpack_require__(3);
	var ctx = __webpack_require__(15);
	var hide = __webpack_require__(17);
	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
		var IS_FORCED = type & $export.F;
		var IS_GLOBAL = type & $export.G;
		var IS_STATIC = type & $export.S;
		var IS_PROTO = type & $export.P;
		var IS_BIND = type & $export.B;
		var IS_WRAP = type & $export.W;
		var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
		var expProto = exports[PROTOTYPE];
		var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
		var key, own, out;
		if (IS_GLOBAL) source = name;
		for (key in source) {
			// contains in native
			own = !IS_FORCED && target && target[key] !== undefined;
			if (own && key in exports) continue;
			// export native or passed
			out = own ? target[key] : source[key];
			// prevent global pollution for namespaces
			exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
			// bind timers to global for call from export context
			: IS_BIND && own ? ctx(out, global)
			// wrap global constructors for prevent change them in library
			: IS_WRAP && target[key] == out ? function (C) {
				var F = function (a, b, c) {
					if (this instanceof C) {
						switch (arguments.length) {
							case 0:
								return new C();
							case 1:
								return new C(a);
							case 2:
								return new C(a, b);
						}return new C(a, b, c);
					}return C.apply(this, arguments);
				};
				F[PROTOTYPE] = C[PROTOTYPE];
				return F;
				// make static versions for prototype methods
			}(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
			// export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
			if (IS_PROTO) {
				(exports.virtual || (exports.virtual = {}))[key] = out;
				// export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
				if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
			}
		}
	};
	// type bitmap
	$export.F = 1; // forced
	$export.G = 2; // global
	$export.S = 4; // static
	$export.P = 8; // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	$export.U = 64; // safe
	$export.R = 128; // real proto method for `library`
	module.exports = $export;

	/***/
},
/* 14 */
/***/function (module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
	// eslint-disable-next-line no-new-func
	: Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


	/***/
},
/* 15 */
/***/function (module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(16);
	module.exports = function (fn, that, length) {
		aFunction(fn);
		if (that === undefined) return fn;
		switch (length) {
			case 1:
				return function (a) {
					return fn.call(that, a);
				};
			case 2:
				return function (a, b) {
					return fn.call(that, a, b);
				};
			case 3:
				return function (a, b, c) {
					return fn.call(that, a, b, c);
				};
		}
		return function () /* ...args */{
			return fn.apply(that, arguments);
		};
	};

	/***/
},
/* 16 */
/***/function (module, exports) {

	module.exports = function (it) {
		if (typeof it != 'function') throw TypeError(it + ' is not a function!');
		return it;
	};

	/***/
},
/* 17 */
/***/function (module, exports, __webpack_require__) {

	var dP = __webpack_require__(18);
	var createDesc = __webpack_require__(26);
	module.exports = __webpack_require__(22) ? function (object, key, value) {
		return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
		object[key] = value;
		return object;
	};

	/***/
},
/* 18 */
/***/function (module, exports, __webpack_require__) {

	var anObject = __webpack_require__(19);
	var IE8_DOM_DEFINE = __webpack_require__(21);
	var toPrimitive = __webpack_require__(25);
	var dP = Object.defineProperty;

	exports.f = __webpack_require__(22) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
		anObject(O);
		P = toPrimitive(P, true);
		anObject(Attributes);
		if (IE8_DOM_DEFINE) try {
			return dP(O, P, Attributes);
		} catch (e) {/* empty */}
		if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
		if ('value' in Attributes) O[P] = Attributes.value;
		return O;
	};

	/***/
},
/* 19 */
/***/function (module, exports, __webpack_require__) {

	var isObject = __webpack_require__(20);
	module.exports = function (it) {
		if (!isObject(it)) throw TypeError(it + ' is not an object!');
		return it;
	};

	/***/
},
/* 20 */
/***/function (module, exports) {

	module.exports = function (it) {
		return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	/***/
},
/* 21 */
/***/function (module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(22) && !__webpack_require__(23)(function () {
		return Object.defineProperty(__webpack_require__(24)('div'), 'a', { get: function () {
				return 7;
			} }).a != 7;
	});

	/***/
},
/* 22 */
/***/function (module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(23)(function () {
		return Object.defineProperty({}, 'a', { get: function () {
				return 7;
			} }).a != 7;
	});

	/***/
},
/* 23 */
/***/function (module, exports) {

	module.exports = function (exec) {
		try {
			return !!exec();
		} catch (e) {
			return true;
		}
	};

	/***/
},
/* 24 */
/***/function (module, exports, __webpack_require__) {

	var isObject = __webpack_require__(20);
	var document = __webpack_require__(14).document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
		return is ? document.createElement(it) : {};
	};

	/***/
},
/* 25 */
/***/function (module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(20);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
		if (!isObject(it)) return it;
		var fn, val;
		if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
		if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
		if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
		throw TypeError("Can't convert object to primitive value");
	};

	/***/
},
/* 26 */
/***/function (module, exports) {

	module.exports = function (bitmap, value) {
		return {
			enumerable: !(bitmap & 1),
			configurable: !(bitmap & 2),
			writable: !(bitmap & 4),
			value: value
		};
	};

	/***/
},
/* 27 */
/***/function (module, exports, __webpack_require__) {

	module.exports = __webpack_require__(17);

	/***/
},
/* 28 */
/***/function (module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
		return hasOwnProperty.call(it, key);
	};

	/***/
},
/* 29 */
/***/function (module, exports) {

	module.exports = {};

	/***/
},
/* 30 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	var create = __webpack_require__(31);
	var descriptor = __webpack_require__(26);
	var setToStringTag = __webpack_require__(46);
	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(17)(IteratorPrototype, __webpack_require__(47)('iterator'), function () {
		return this;
	});

	module.exports = function (Constructor, NAME, next) {
		Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
		setToStringTag(Constructor, NAME + ' Iterator');
	};

	/***/
},
/* 31 */
/***/function (module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject = __webpack_require__(19);
	var dPs = __webpack_require__(32);
	var enumBugKeys = __webpack_require__(44);
	var IE_PROTO = __webpack_require__(41)('IE_PROTO');
	var Empty = function () {/* empty */};
	var PROTOTYPE = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
		// Thrash, waste and sodomy: IE GC bug
		var iframe = __webpack_require__(24)('iframe');
		var i = enumBugKeys.length;
		var lt = '<';
		var gt = '>';
		var iframeDocument;
		iframe.style.display = 'none';
		__webpack_require__(45).appendChild(iframe);
		iframe.src = 'javascript:'; // eslint-disable-line no-script-url
		// createDict = iframe.contentWindow.Object;
		// html.removeChild(iframe);
		iframeDocument = iframe.contentWindow.document;
		iframeDocument.open();
		iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
		iframeDocument.close();
		createDict = iframeDocument.F;
		while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
		return createDict();
	};

	module.exports = Object.create || function create(O, Properties) {
		var result;
		if (O !== null) {
			Empty[PROTOTYPE] = anObject(O);
			result = new Empty();
			Empty[PROTOTYPE] = null;
			// add "__proto__" for Object.getPrototypeOf polyfill
			result[IE_PROTO] = O;
		} else result = createDict();
		return Properties === undefined ? result : dPs(result, Properties);
	};

	/***/
},
/* 32 */
/***/function (module, exports, __webpack_require__) {

	var dP = __webpack_require__(18);
	var anObject = __webpack_require__(19);
	var getKeys = __webpack_require__(33);

	module.exports = __webpack_require__(22) ? Object.defineProperties : function defineProperties(O, Properties) {
		anObject(O);
		var keys = getKeys(Properties);
		var length = keys.length;
		var i = 0;
		var P;
		while (length > i) dP.f(O, P = keys[i++], Properties[P]);
		return O;
	};

	/***/
},
/* 33 */
/***/function (module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(34);
	var enumBugKeys = __webpack_require__(44);

	module.exports = Object.keys || function keys(O) {
		return $keys(O, enumBugKeys);
	};

	/***/
},
/* 34 */
/***/function (module, exports, __webpack_require__) {

	var has = __webpack_require__(28);
	var toIObject = __webpack_require__(35);
	var arrayIndexOf = __webpack_require__(38)(false);
	var IE_PROTO = __webpack_require__(41)('IE_PROTO');

	module.exports = function (object, names) {
		var O = toIObject(object);
		var i = 0;
		var result = [];
		var key;
		for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
		// Don't enum bug & hidden keys
		while (names.length > i) if (has(O, key = names[i++])) {
			~arrayIndexOf(result, key) || result.push(key);
		}
		return result;
	};

	/***/
},
/* 35 */
/***/function (module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(36);
	var defined = __webpack_require__(10);
	module.exports = function (it) {
		return IObject(defined(it));
	};

	/***/
},
/* 36 */
/***/function (module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(37);
	// eslint-disable-next-line no-prototype-builtins
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
		return cof(it) == 'String' ? it.split('') : Object(it);
	};

	/***/
},
/* 37 */
/***/function (module, exports) {

	var toString = {}.toString;

	module.exports = function (it) {
		return toString.call(it).slice(8, -1);
	};

	/***/
},
/* 38 */
/***/function (module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(35);
	var toLength = __webpack_require__(39);
	var toAbsoluteIndex = __webpack_require__(40);
	module.exports = function (IS_INCLUDES) {
		return function ($this, el, fromIndex) {
			var O = toIObject($this);
			var length = toLength(O.length);
			var index = toAbsoluteIndex(fromIndex, length);
			var value;
			// Array#includes uses SameValueZero equality algorithm
			// eslint-disable-next-line no-self-compare
			if (IS_INCLUDES && el != el) while (length > index) {
				value = O[index++];
				// eslint-disable-next-line no-self-compare
				if (value != value) return true;
				// Array#indexOf ignores holes, Array#includes - not
			} else for (; length > index; index++) if (IS_INCLUDES || index in O) {
				if (O[index] === el) return IS_INCLUDES || index || 0;
			}return !IS_INCLUDES && -1;
		};
	};

	/***/
},
/* 39 */
/***/function (module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(9);
	var min = Math.min;
	module.exports = function (it) {
		return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	/***/
},
/* 40 */
/***/function (module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(9);
	var max = Math.max;
	var min = Math.min;
	module.exports = function (index, length) {
		index = toInteger(index);
		return index < 0 ? max(index + length, 0) : min(index, length);
	};

	/***/
},
/* 41 */
/***/function (module, exports, __webpack_require__) {

	var shared = __webpack_require__(42)('keys');
	var uid = __webpack_require__(43);
	module.exports = function (key) {
		return shared[key] || (shared[key] = uid(key));
	};

	/***/
},
/* 42 */
/***/function (module, exports, __webpack_require__) {

	var global = __webpack_require__(14);
	var SHARED = '__core-js_shared__';
	var store = global[SHARED] || (global[SHARED] = {});
	module.exports = function (key) {
		return store[key] || (store[key] = {});
	};

	/***/
},
/* 43 */
/***/function (module, exports) {

	var id = 0;
	var px = Math.random();
	module.exports = function (key) {
		return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	/***/
},
/* 44 */
/***/function (module, exports) {

	// IE 8- don't enum bug keys
	module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

	/***/
},
/* 45 */
/***/function (module, exports, __webpack_require__) {

	var document = __webpack_require__(14).document;
	module.exports = document && document.documentElement;

	/***/
},
/* 46 */
/***/function (module, exports, __webpack_require__) {

	var def = __webpack_require__(18).f;
	var has = __webpack_require__(28);
	var TAG = __webpack_require__(47)('toStringTag');

	module.exports = function (it, tag, stat) {
		if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};

	/***/
},
/* 47 */
/***/function (module, exports, __webpack_require__) {

	var store = __webpack_require__(42)('wks');
	var uid = __webpack_require__(43);
	var Symbol = __webpack_require__(14).Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function (name) {
		return store[name] || (store[name] = USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

	/***/
},
/* 48 */
/***/function (module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has = __webpack_require__(28);
	var toObject = __webpack_require__(49);
	var IE_PROTO = __webpack_require__(41)('IE_PROTO');
	var ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function (O) {
		O = toObject(O);
		if (has(O, IE_PROTO)) return O[IE_PROTO];
		if (typeof O.constructor == 'function' && O instanceof O.constructor) {
			return O.constructor.prototype;
		}return O instanceof Object ? ObjectProto : null;
	};

	/***/
},
/* 49 */
/***/function (module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(10);
	module.exports = function (it) {
		return Object(defined(it));
	};

	/***/
},
/* 50 */
/***/function (module, exports, __webpack_require__) {

	__webpack_require__(51);
	var global = __webpack_require__(14);
	var hide = __webpack_require__(17);
	var Iterators = __webpack_require__(29);
	var TO_STRING_TAG = __webpack_require__(47)('toStringTag');

	var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' + 'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' + 'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' + 'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' + 'TextTrackList,TouchList').split(',');

	for (var i = 0; i < DOMIterables.length; i++) {
		var NAME = DOMIterables[i];
		var Collection = global[NAME];
		var proto = Collection && Collection.prototype;
		if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
		Iterators[NAME] = Iterators.Array;
	}

	/***/
},
/* 51 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	var addToUnscopables = __webpack_require__(52);
	var step = __webpack_require__(53);
	var Iterators = __webpack_require__(29);
	var toIObject = __webpack_require__(35);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(11)(Array, 'Array', function (iterated, kind) {
		this._t = toIObject(iterated); // target
		this._i = 0; // next index
		this._k = kind; // kind
		// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
		var O = this._t;
		var kind = this._k;
		var index = this._i++;
		if (!O || index >= O.length) {
			this._t = undefined;
			return step(1);
		}
		if (kind == 'keys') return step(0, index);
		if (kind == 'values') return step(0, O[index]);
		return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	/***/
},
/* 52 */
/***/function (module, exports) {

	module.exports = function () {/* empty */};

	/***/
},
/* 53 */
/***/function (module, exports) {

	module.exports = function (done, value) {
		return { value: value, done: !!done };
	};

	/***/
},
/* 54 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	var LIBRARY = __webpack_require__(12);
	var global = __webpack_require__(14);
	var ctx = __webpack_require__(15);
	var classof = __webpack_require__(55);
	var $export = __webpack_require__(13);
	var isObject = __webpack_require__(20);
	var aFunction = __webpack_require__(16);
	var anInstance = __webpack_require__(56);
	var forOf = __webpack_require__(57);
	var speciesConstructor = __webpack_require__(61);
	var task = __webpack_require__(62).set;
	var microtask = __webpack_require__(64)();
	var newPromiseCapabilityModule = __webpack_require__(65);
	var perform = __webpack_require__(66);
	var promiseResolve = __webpack_require__(67);
	var PROMISE = 'Promise';
	var TypeError = global.TypeError;
	var process = global.process;
	var $Promise = global[PROMISE];
	var isNode = classof(process) == 'process';
	var empty = function () {/* empty */};
	var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
	var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

	var USE_NATIVE = !!function () {
		try {
			// correct subclassing with @@species support
			var promise = $Promise.resolve(1);
			var FakePromise = (promise.constructor = {})[__webpack_require__(47)('species')] = function (exec) {
				exec(empty, empty);
			};
			// unhandled rejections tracking support, NodeJS Promise without it fails @@species test
			return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
		} catch (e) {/* empty */}
	}();

	// helpers
	var isThenable = function (it) {
		var then;
		return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var notify = function (promise, isReject) {
		if (promise._n) return;
		promise._n = true;
		var chain = promise._c;
		microtask(function () {
			var value = promise._v;
			var ok = promise._s == 1;
			var i = 0;
			var run = function (reaction) {
				var handler = ok ? reaction.ok : reaction.fail;
				var resolve = reaction.resolve;
				var reject = reaction.reject;
				var domain = reaction.domain;
				var result, then;
				try {
					if (handler) {
						if (!ok) {
							if (promise._h == 2) onHandleUnhandled(promise);
							promise._h = 1;
						}
						if (handler === true) result = value;else {
							if (domain) domain.enter();
							result = handler(value);
							if (domain) domain.exit();
						}
						if (result === reaction.promise) {
							reject(TypeError('Promise-chain cycle'));
						} else if (then = isThenable(result)) {
							then.call(result, resolve, reject);
						} else resolve(result);
					} else reject(value);
				} catch (e) {
					reject(e);
				}
			};
			while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
			promise._c = [];
			promise._n = false;
			if (isReject && !promise._h) onUnhandled(promise);
		});
	};
	var onUnhandled = function (promise) {
		task.call(global, function () {
			var value = promise._v;
			var unhandled = isUnhandled(promise);
			var result, handler, console;
			if (unhandled) {
				result = perform(function () {
					if (isNode) {
						process.emit('unhandledRejection', value, promise);
					} else if (handler = global.onunhandledrejection) {
						handler({ promise: promise, reason: value });
					} else if ((console = global.console) && console.error) {
						console.error('Unhandled promise rejection', value);
					}
				});
				// Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
				promise._h = isNode || isUnhandled(promise) ? 2 : 1;
			}promise._a = undefined;
			if (unhandled && result.e) throw result.v;
		});
	};
	var isUnhandled = function (promise) {
		if (promise._h == 1) return false;
		var chain = promise._a || promise._c;
		var i = 0;
		var reaction;
		while (chain.length > i) {
			reaction = chain[i++];
			if (reaction.fail || !isUnhandled(reaction.promise)) return false;
		}return true;
	};
	var onHandleUnhandled = function (promise) {
		task.call(global, function () {
			var handler;
			if (isNode) {
				process.emit('rejectionHandled', promise);
			} else if (handler = global.onrejectionhandled) {
				handler({ promise: promise, reason: promise._v });
			}
		});
	};
	var $reject = function (value) {
		var promise = this;
		if (promise._d) return;
		promise._d = true;
		promise = promise._w || promise; // unwrap
		promise._v = value;
		promise._s = 2;
		if (!promise._a) promise._a = promise._c.slice();
		notify(promise, true);
	};
	var $resolve = function (value) {
		var promise = this;
		var then;
		if (promise._d) return;
		promise._d = true;
		promise = promise._w || promise; // unwrap
		try {
			if (promise === value) throw TypeError("Promise can't be resolved itself");
			if (then = isThenable(value)) {
				microtask(function () {
					var wrapper = { _w: promise, _d: false }; // wrap
					try {
						then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
					} catch (e) {
						$reject.call(wrapper, e);
					}
				});
			} else {
				promise._v = value;
				promise._s = 1;
				notify(promise, false);
			}
		} catch (e) {
			$reject.call({ _w: promise, _d: false }, e); // wrap
		}
	};

	// constructor polyfill
	if (!USE_NATIVE) {
		// 25.4.3.1 Promise(executor)
		$Promise = function Promise(executor) {
			anInstance(this, $Promise, PROMISE, '_h');
			aFunction(executor);
			Internal.call(this);
			try {
				executor(ctx($resolve, this, 1), ctx($reject, this, 1));
			} catch (err) {
				$reject.call(this, err);
			}
		};
		// eslint-disable-next-line no-unused-vars
		Internal = function Promise(executor) {
			this._c = []; // <- awaiting reactions
			this._a = undefined; // <- checked in isUnhandled reactions
			this._s = 0; // <- state
			this._d = false; // <- done
			this._v = undefined; // <- value
			this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
			this._n = false; // <- notify
		};
		Internal.prototype = __webpack_require__(68)($Promise.prototype, {
			// 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
			then: function then(onFulfilled, onRejected) {
				var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
				reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
				reaction.fail = typeof onRejected == 'function' && onRejected;
				reaction.domain = isNode ? process.domain : undefined;
				this._c.push(reaction);
				if (this._a) this._a.push(reaction);
				if (this._s) notify(this, false);
				return reaction.promise;
			},
			// 25.4.5.1 Promise.prototype.catch(onRejected)
			'catch': function (onRejected) {
				return this.then(undefined, onRejected);
			}
		});
		OwnPromiseCapability = function () {
			var promise = new Internal();
			this.promise = promise;
			this.resolve = ctx($resolve, promise, 1);
			this.reject = ctx($reject, promise, 1);
		};
		newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
			return C === $Promise || C === Wrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
		};
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
	__webpack_require__(46)($Promise, PROMISE);
	__webpack_require__(69)(PROMISE);
	Wrapper = __webpack_require__(3)[PROMISE];

	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
		// 25.4.4.5 Promise.reject(r)
		reject: function reject(r) {
			var capability = newPromiseCapability(this);
			var $$reject = capability.reject;
			$$reject(r);
			return capability.promise;
		}
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
		// 25.4.4.6 Promise.resolve(x)
		resolve: function resolve(x) {
			return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
		}
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(70)(function (iter) {
		$Promise.all(iter)['catch'](empty);
	})), PROMISE, {
		// 25.4.4.1 Promise.all(iterable)
		all: function all(iterable) {
			var C = this;
			var capability = newPromiseCapability(C);
			var resolve = capability.resolve;
			var reject = capability.reject;
			var result = perform(function () {
				var values = [];
				var index = 0;
				var remaining = 1;
				forOf(iterable, false, function (promise) {
					var $index = index++;
					var alreadyCalled = false;
					values.push(undefined);
					remaining++;
					C.resolve(promise).then(function (value) {
						if (alreadyCalled) return;
						alreadyCalled = true;
						values[$index] = value;
						--remaining || resolve(values);
					}, reject);
				});
				--remaining || resolve(values);
			});
			if (result.e) reject(result.v);
			return capability.promise;
		},
		// 25.4.4.4 Promise.race(iterable)
		race: function race(iterable) {
			var C = this;
			var capability = newPromiseCapability(C);
			var reject = capability.reject;
			var result = perform(function () {
				forOf(iterable, false, function (promise) {
					C.resolve(promise).then(capability.resolve, reject);
				});
			});
			if (result.e) reject(result.v);
			return capability.promise;
		}
	});

	/***/
},
/* 55 */
/***/function (module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(37);
	var TAG = __webpack_require__(47)('toStringTag');
	// ES3 wrong here
	var ARG = cof(function () {
		return arguments;
	}()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
		try {
			return it[key];
		} catch (e) {/* empty */}
	};

	module.exports = function (it) {
		var O, T, B;
		return it === undefined ? 'Undefined' : it === null ? 'Null'
		// @@toStringTag case
		: typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
		// builtinTag case
		: ARG ? cof(O)
		// ES3 arguments fallback
		: (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	/***/
},
/* 56 */
/***/function (module, exports) {

	module.exports = function (it, Constructor, name, forbiddenField) {
		if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
			throw TypeError(name + ': incorrect invocation!');
		}return it;
	};

	/***/
},
/* 57 */
/***/function (module, exports, __webpack_require__) {

	var ctx = __webpack_require__(15);
	var call = __webpack_require__(58);
	var isArrayIter = __webpack_require__(59);
	var anObject = __webpack_require__(19);
	var toLength = __webpack_require__(39);
	var getIterFn = __webpack_require__(60);
	var BREAK = {};
	var RETURN = {};
	var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
		var iterFn = ITERATOR ? function () {
			return iterable;
		} : getIterFn(iterable);
		var f = ctx(fn, that, entries ? 2 : 1);
		var index = 0;
		var length, step, iterator, result;
		if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
		// fast case for arrays with default iterator
		if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
			result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
			if (result === BREAK || result === RETURN) return result;
		} else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
			result = call(iterator, f, step.value, entries);
			if (result === BREAK || result === RETURN) return result;
		}
	};
	exports.BREAK = BREAK;
	exports.RETURN = RETURN;

	/***/
},
/* 58 */
/***/function (module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(19);
	module.exports = function (iterator, fn, value, entries) {
		try {
			return entries ? fn(anObject(value)[0], value[1]) : fn(value);
			// 7.4.6 IteratorClose(iterator, completion)
		} catch (e) {
			var ret = iterator['return'];
			if (ret !== undefined) anObject(ret.call(iterator));
			throw e;
		}
	};

	/***/
},
/* 59 */
/***/function (module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators = __webpack_require__(29);
	var ITERATOR = __webpack_require__(47)('iterator');
	var ArrayProto = Array.prototype;

	module.exports = function (it) {
		return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

	/***/
},
/* 60 */
/***/function (module, exports, __webpack_require__) {

	var classof = __webpack_require__(55);
	var ITERATOR = __webpack_require__(47)('iterator');
	var Iterators = __webpack_require__(29);
	module.exports = __webpack_require__(3).getIteratorMethod = function (it) {
		if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
	};

	/***/
},
/* 61 */
/***/function (module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject = __webpack_require__(19);
	var aFunction = __webpack_require__(16);
	var SPECIES = __webpack_require__(47)('species');
	module.exports = function (O, D) {
		var C = anObject(O).constructor;
		var S;
		return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

	/***/
},
/* 62 */
/***/function (module, exports, __webpack_require__) {

	var ctx = __webpack_require__(15);
	var invoke = __webpack_require__(63);
	var html = __webpack_require__(45);
	var cel = __webpack_require__(24);
	var global = __webpack_require__(14);
	var process = global.process;
	var setTask = global.setImmediate;
	var clearTask = global.clearImmediate;
	var MessageChannel = global.MessageChannel;
	var Dispatch = global.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;
	var run = function () {
		var id = +this;
		// eslint-disable-next-line no-prototype-builtins
		if (queue.hasOwnProperty(id)) {
			var fn = queue[id];
			delete queue[id];
			fn();
		}
	};
	var listener = function (event) {
		run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!setTask || !clearTask) {
		setTask = function setImmediate(fn) {
			var args = [];
			var i = 1;
			while (arguments.length > i) args.push(arguments[i++]);
			queue[++counter] = function () {
				// eslint-disable-next-line no-new-func
				invoke(typeof fn == 'function' ? fn : Function(fn), args);
			};
			defer(counter);
			return counter;
		};
		clearTask = function clearImmediate(id) {
			delete queue[id];
		};
		// Node.js 0.8-
		if (__webpack_require__(37)(process) == 'process') {
			defer = function (id) {
				process.nextTick(ctx(run, id, 1));
			};
			// Sphere (JS game engine) Dispatch API
		} else if (Dispatch && Dispatch.now) {
			defer = function (id) {
				Dispatch.now(ctx(run, id, 1));
			};
			// Browsers with MessageChannel, includes WebWorkers
		} else if (MessageChannel) {
			channel = new MessageChannel();
			port = channel.port2;
			channel.port1.onmessage = listener;
			defer = ctx(port.postMessage, port, 1);
			// Browsers with postMessage, skip WebWorkers
			// IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
		} else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
			defer = function (id) {
				global.postMessage(id + '', '*');
			};
			global.addEventListener('message', listener, false);
			// IE8-
		} else if (ONREADYSTATECHANGE in cel('script')) {
			defer = function (id) {
				html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
					html.removeChild(this);
					run.call(id);
				};
			};
			// Rest old browsers
		} else {
			defer = function (id) {
				setTimeout(ctx(run, id, 1), 0);
			};
		}
	}
	module.exports = {
		set: setTask,
		clear: clearTask
	};

	/***/
},
/* 63 */
/***/function (module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function (fn, args, that) {
		var un = that === undefined;
		switch (args.length) {
			case 0:
				return un ? fn() : fn.call(that);
			case 1:
				return un ? fn(args[0]) : fn.call(that, args[0]);
			case 2:
				return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
			case 3:
				return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
			case 4:
				return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
		}return fn.apply(that, args);
	};

	/***/
},
/* 64 */
/***/function (module, exports, __webpack_require__) {

	var global = __webpack_require__(14);
	var macrotask = __webpack_require__(62).set;
	var Observer = global.MutationObserver || global.WebKitMutationObserver;
	var process = global.process;
	var Promise = global.Promise;
	var isNode = __webpack_require__(37)(process) == 'process';

	module.exports = function () {
		var head, last, notify;

		var flush = function () {
			var parent, fn;
			if (isNode && (parent = process.domain)) parent.exit();
			while (head) {
				fn = head.fn;
				head = head.next;
				try {
					fn();
				} catch (e) {
					if (head) notify();else last = undefined;
					throw e;
				}
			}last = undefined;
			if (parent) parent.enter();
		};

		// Node.js
		if (isNode) {
			notify = function () {
				process.nextTick(flush);
			};
			// browsers with MutationObserver
		} else if (Observer) {
			var toggle = true;
			var node = document.createTextNode('');
			new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
			notify = function () {
				node.data = toggle = !toggle;
			};
			// environments with maybe non-completely correct, but existent Promise
		} else if (Promise && Promise.resolve) {
			var promise = Promise.resolve();
			notify = function () {
				promise.then(flush);
			};
			// for other environments - macrotask based on:
			// - setImmediate
			// - MessageChannel
			// - window.postMessag
			// - onreadystatechange
			// - setTimeout
		} else {
			notify = function () {
				// strange IE + webpack dev server bug - use .call(global)
				macrotask.call(global, flush);
			};
		}

		return function (fn) {
			var task = { fn: fn, next: undefined };
			if (last) last.next = task;
			if (!head) {
				head = task;
				notify();
			}last = task;
		};
	};

	/***/
},
/* 65 */
/***/function (module, exports, __webpack_require__) {

	'use strict';
	// 25.4.1.5 NewPromiseCapability(C)

	var aFunction = __webpack_require__(16);

	function PromiseCapability(C) {
		var resolve, reject;
		this.promise = new C(function ($$resolve, $$reject) {
			if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
			resolve = $$resolve;
			reject = $$reject;
		});
		this.resolve = aFunction(resolve);
		this.reject = aFunction(reject);
	}

	module.exports.f = function (C) {
		return new PromiseCapability(C);
	};

	/***/
},
/* 66 */
/***/function (module, exports) {

	module.exports = function (exec) {
		try {
			return { e: false, v: exec() };
		} catch (e) {
			return { e: true, v: e };
		}
	};

	/***/
},
/* 67 */
/***/function (module, exports, __webpack_require__) {

	var anObject = __webpack_require__(19);
	var isObject = __webpack_require__(20);
	var newPromiseCapability = __webpack_require__(65);

	module.exports = function (C, x) {
		anObject(C);
		if (isObject(x) && x.constructor === C) return x;
		var promiseCapability = newPromiseCapability.f(C);
		var resolve = promiseCapability.resolve;
		resolve(x);
		return promiseCapability.promise;
	};

	/***/
},
/* 68 */
/***/function (module, exports, __webpack_require__) {

	var hide = __webpack_require__(17);
	module.exports = function (target, src, safe) {
		for (var key in src) {
			if (safe && target[key]) target[key] = src[key];else hide(target, key, src[key]);
		}return target;
	};

	/***/
},
/* 69 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	var global = __webpack_require__(14);
	var core = __webpack_require__(3);
	var dP = __webpack_require__(18);
	var DESCRIPTORS = __webpack_require__(22);
	var SPECIES = __webpack_require__(47)('species');

	module.exports = function (KEY) {
		var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
		if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
			configurable: true,
			get: function () {
				return this;
			}
		});
	};

	/***/
},
/* 70 */
/***/function (module, exports, __webpack_require__) {

	var ITERATOR = __webpack_require__(47)('iterator');
	var SAFE_CLOSING = false;

	try {
		var riter = [7][ITERATOR]();
		riter['return'] = function () {
			SAFE_CLOSING = true;
		};
		// eslint-disable-next-line no-throw-literal
		Array.from(riter, function () {
			throw 2;
		});
	} catch (e) {/* empty */}

	module.exports = function (exec, skipClosing) {
		if (!skipClosing && !SAFE_CLOSING) return false;
		var safe = false;
		try {
			var arr = [7];
			var iter = arr[ITERATOR]();
			iter.next = function () {
				return { done: safe = true };
			};
			arr[ITERATOR] = function () {
				return iter;
			};
			exec(arr);
		} catch (e) {/* empty */}
		return safe;
	};

	/***/
},
/* 71 */
/***/function (module, exports, __webpack_require__) {

	// https://github.com/tc39/proposal-promise-finally
	'use strict';

	var $export = __webpack_require__(13);
	var core = __webpack_require__(3);
	var global = __webpack_require__(14);
	var speciesConstructor = __webpack_require__(61);
	var promiseResolve = __webpack_require__(67);

	$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
			var C = speciesConstructor(this, core.Promise || global.Promise);
			var isFunction = typeof onFinally == 'function';
			return this.then(isFunction ? function (x) {
				return promiseResolve(C, onFinally()).then(function () {
					return x;
				});
			} : onFinally, isFunction ? function (e) {
				return promiseResolve(C, onFinally()).then(function () {
					throw e;
				});
			} : onFinally);
		} });

	/***/
},
/* 72 */
/***/function (module, exports, __webpack_require__) {

	'use strict';
	// https://github.com/tc39/proposal-promise-try

	var $export = __webpack_require__(13);
	var newPromiseCapability = __webpack_require__(65);
	var perform = __webpack_require__(66);

	$export($export.S, 'Promise', { 'try': function (callbackfn) {
			var promiseCapability = newPromiseCapability.f(this);
			var result = perform(callbackfn);
			(result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
			return promiseCapability.promise;
		} });

	/***/
},
/* 73 */
/***/function (module, exports, __webpack_require__) {

	'use strict';

	var _keys = __webpack_require__(74);

	var _keys2 = _interopRequireDefault(_keys);

	var _stringify = __webpack_require__(1);

	var _stringify2 = _interopRequireDefault(_stringify);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { default: obj };
	}

	/* global Config */
	var CoFund = {};

	CoFund.Store = {
		getCompositeKey: function getCompositeKey(name) {
			return '_cofund.' + name;
		},
		isset: function isset(name) {
			return sessionStorage.getItem(this.getCompositeKey(name)) !== null;
		},
		set: function set(name, data) {
			sessionStorage.setItem(this.getCompositeKey(name), (0, _stringify2.default)(data));
		},
		get: function get(name) {
			try {
				return JSON.parse(sessionStorage.getItem(this.getCompositeKey(name)));
			} catch (e) {
				return null;
			}
		}
	};

	CoFund.Info = {
		extId: null,
		user: null,
		preferences: {
			cashbackAlerts: false,
			dailyDeals: false,
			worksHere: true,
			azSimilarDeals: false
		},
		savings: 0,
		getExtId: function getExtId() {
			return this.extId;
		},
		setExtId: function setExtId(extId) {
			this.extId = extId;
		},
		getUser: function getUser() {
			return this.user;
		},
		setUser: function setUser(user) {
			this.user = user;
		},
		getPreferences: function getPreferences() {
			return this.preferences;
		},
		setPreferences: function setPreferences(preferences) {
			this.preferences = preferences;
		},
		getSavings: function getSavings() {
			return this.savings;
		},
		setSavings: function setSavings(savings) {
			this.savings = savings;
		}
	};

	CoFund.Cookie = {
		cookie: {
			name: '_cofund.ext',
			expires: 60 * 60 * 2,
			path: '/'
		},
		setDomain: function setDomain(domain) {
			this.cookie.domain = domain;
		},
		set: function set(name, data) {
			// Check for an existing JSON-encoded value
			var cookie, expires;
			try {
				cookie = JSON.parse(this._getJson());
			} catch (e) {
				cookie = {};
			}
			if (data) {
				cookie[name] = data;
			} else {
				delete cookie[name];
			}
			// Set expiration
			expires = new Date();
			expires.setSeconds(expires.getSeconds() + this.cookie.expires);
			document.cookie = [encodeURIComponent(this.cookie.name) + '=' + encodeURIComponent((0, _stringify2.default)(cookie)), expires ? '; expires=' + expires.toUTCString() : '', this.cookie.path ? '; path=' + this.cookie.path : '', this.cookie.domain ? '; domain=' + this.cookie.domain : '', this.cookie.secure ? '; secure' : ''].join('');
		},
		get: function get(name) {
			try {
				return JSON.parse(this._getJson())[name];
			} catch (e) {
				return null;
			}
		},
		getAll: function getAll() {
			try {
				return JSON.parse(this._getJson());
			} catch (e) {
				return {};
			}
		},
		isset: function isset(name) {
			var json = this._getJson();
			if (json) {
				var jsonParsed = JSON.parse(json);
				if (jsonParsed.hasOwnProperty(name)) {
					return true;
				}
			}
			return false;
		},
		clear: function clear(name) {
			this.set(name, null);
		},
		clearAll: function clearAll() {
			var self = this;
			(0, _keys2.default)(this.getAll()).forEach(function (name) {
				self.set(name, null);
			});
		},
		getExternal: function getExternal(name) {
			var cookies = document.cookie.split('; ');
			for (var i = 0, l = cookies.length; i < l; i++) {
				var parts = cookies[i].split('=');
				parts[0] = parts[0] !== 'undefined' ? decodeURIComponent(parts[0].replace(/\+/g, ' ')) : '';
				parts[1] = parts[1] !== 'undefined' ? decodeURIComponent(parts[1].replace(/\+/g, ' ')) : '';
				if (parts[0] === name) {
					return parts[1];
				}
			}
		},
		_getJson: function _getJson() {
			var cookies = document.cookie.split('; ');
			for (var i = 0, l = cookies.length; i < l; i++) {
				var parts = cookies[i].split('=');
				parts[0] = parts[0] !== 'undefined' ? decodeURIComponent(parts[0].replace(/\+/g, ' ')) : '';
				parts[1] = parts[1] !== 'undefined' ? decodeURIComponent(parts[1].replace(/\+/g, ' ')) : '';
				if (parts[0] === this.cookie.name) {
					return parts[1];
				}
			}
		}
	};

	CoFund.State = {
		// Constant state values
		PENDING: 0,
		STATE_RECEIVED: 1,
		CODES_PRESENTED: 2,
		CODES_PROCESSED: 3,
		get: function get() {
			return CoFund.Store.get('state');
		},
		set: function set(state) {
			CoFund.Store.set('state', state);
		},
		clear: function clear() {
			this.set(null);
		}
	};

	CoFund.Sliders = {
		SLIDER_IN: 1,
		CASHBACK_BUTTON: 2,
		ACTIVATED_AUTOTRY_SUCCESS: 4,
		COPIED_CODE: 8,
		CLOSED_MANUAL_DRAWER: 16,
		show: function show(name) {
			if (this.hasShown(name)) {
				return;
			}
			var updatedState = CoFund.Cookie.get('Sliders') ? CoFund.Cookie.get('Sliders') + name : name;
			CoFund.Cookie.set('Sliders', updatedState);
		},
		hasShown: function hasShown(name) {
			return (CoFund.Cookie.get('Sliders') & name) === name;
		},
		reset: function reset(name) {
			if (this.hasShown(name)) {
				var updatedState = CoFund.Cookie.get('Sliders') - name;
				CoFund.Cookie.set('Sliders', updatedState);
			}
		},
		setTimer: function setTimer() {
			CoFund.Cookie.set('timer', Math.floor(Date.now() / 1000));
		},
		timerExpired: function timerExpired() {
			// Expires after 15 mins
			return Math.floor(Date.now() / 1000 - 15 * 60) > (CoFund.Cookie.get('timer') || 0);
		}
	};

	CoFund.Cashback = {
		// Constant state values
		FIRE_ON_30: 1,
		FIRE_ON_CODES_FOUND: 2,
		FIRE_ON_CODES_PRESENTED: 4,
		FIRE_ON_CODES_SUCCESSFUL: 8,
		FIRE_ON_CODES_ACTIVATED: 16,
		FIRE_ON_DRAWER_CLOSED: 32,
		FIRE_ON_SLIDER_CLOSED: 64,
		FIRE_ON_CASHBACK_ACTIVATED: 128,
		FIRE_ON_CODES_COPIED: 256,
		FIRE_ON_120: 512,
		FIRE_ON_180: 1024,
		FIRE_ON_COUPON_TAB_CLICK: 2048,
		refCodes: [],
		tracker: null,
		fireOnActions: null,
		isButtonABTest: false,
		buttonABRef: null,
		init: function init(reload) {
			// Init ref codes
			this.refCodes[this.FIRE_ON_30] = '30';
			this.refCodes[this.FIRE_ON_CODES_FOUND] = 'cf';
			this.refCodes[this.FIRE_ON_CODES_PRESENTED] = 'cp';
			this.refCodes[this.FIRE_ON_CODES_SUCCESSFUL] = 'cs';
			this.refCodes[this.FIRE_ON_CODES_ACTIVATED] = 'ca';
			this.refCodes[this.FIRE_ON_DRAWER_CLOSED] = 'dc';
			this.refCodes[this.FIRE_ON_SLIDER_CLOSED] = 'sc';
			this.refCodes[this.FIRE_ON_CASHBACK_ACTIVATED] = 'cb';
			this.refCodes[this.FIRE_ON_CODES_COPIED] = 'cc';
			this.refCodes[this.FIRE_ON_120] = '120';
			this.refCodes[this.FIRE_ON_180] = '180';
			this.refCodes[this.FIRE_ON_COUPON_TAB_CLICK] = 'tc';

			if (CoFund.Store.isset('cb')) {
				this.loadTracker();
				this.tracker = {
					init: this.getTimestamp(),
					pageCount: this.getPageCount() + (reload ? 0 : 1),
					hasFired: this.hasFired()
				};
			} else {
				this.tracker = {
					init: new Date().getTime() / 1000,
					pageCount: 1,
					hasFired: false
				};
			}
			this.updateTracker();
		},
		loadTracker: function loadTracker() {
			if (CoFund.Store.isset('cb')) {
				this.tracker = CoFund.Store.get('cb');
			}
		},
		updateTracker: function updateTracker() {
			CoFund.Store.set('cb', this.tracker);
		},
		getTimestamp: function getTimestamp() {
			if (this.tracker) {
				return this.tracker.init;
			} else {
				return new Date().getTime() / 1000;
			}
		},
		getPageCount: function getPageCount() {
			if (this.tracker) {
				return this.tracker.pageCount;
			} else {
				return 0;
			}
		},
		hasFired: function hasFired() {
			if (this.tracker) {
				return this.tracker.hasFired;
			} else {
				return false;
			}
		},
		getActions: function getActions() {
			if (this.fireOnActions) {
				return this.fireOnActions;
			}

			var cashback = CoFund.Store.get('cashback');

			var areActionsEnabled = cashback && cashback.hasOwnProperty('action');

			if (areActionsEnabled) {
				this.fireOnActions = cashback.action;

				return this.fireOnActions;
			} else {
				return null;
			}
		},
		hasAction: function hasAction(action) {
			var actions = this.getActions();

			if (actions) {
				return (actions & action) === action;
			}
		},
		fire: function fire(trigger, winningCode, cbDetails) {
			if (this.hasFired()) {
				return;
			}
			var self = this;
			// To prevent the possibility of duplicate cashback fires, we set
			// this upfront even if the firing fails
			this.tracker.hasFired = true;
			this.updateTracker();
			var cashback = CoFund.Store.get('cashback');
			var codeDetails = CoFund.Store.get('codeDetails');
			var storeId = null;
			var offerId = null;
			var firethru;
			// Check for storeId
			if (cashback.hasOwnProperty('s')) {
				storeId = cashback.s;
			}
			// Check for offerId
			if (winningCode && codeDetails && codeDetails.hasOwnProperty(winningCode) && codeDetails[winningCode].hasOwnProperty('o')) {
				offerId = codeDetails[winningCode].o;
			}
			if (cashback.hasOwnProperty('firethru') && cashback.firethru !== null) {
				firethru = cashback.firethru;
			}
			if (Config.testType === '3a2') {
				setTimeout(function () {
					chrome.runtime.sendMessage({
						action: firethru == 'tab' ? 'openTab' : 'firePixel',
						url: Config.wwwServer + '/int?direct=1&s=' + (storeId ? storeId : '') + '&o=' + (offerId ? offerId : '') + '&ref1=' + self.refCodes[trigger] + '&ref3=cof' + '&v=' + Config.version + (CoFund.Cashback.isButtonABTest ? '&ref4=' + CoFund.Cashback.buttonABRef : '') + (CoFund.Info.getExtId() ? '&app_uid=' + CoFund.Info.getExtId() : '')
					});
					chrome.runtime.sendMessage({
						action: 'cofundEvent',
						method: 'logCashbackFired',
						cashback: cashback
					});
				}, 1000);
				var triggers = {};
				triggers[CoFund.Session.TR_CASHBACK_FIRE] = true;
				triggers[CoFund.Session.TR_CASHBACK_FIRE_TRIG] = self.refCodes[trigger] + (cbDetails ? cbDetails : '');
				chrome.runtime.sendMessage({
					action: 'cofundSessionUpdate',
					triggers: triggers,
					cashback: cashback
				});
			} else {
				// Request a callback URL
				setTimeout(function () {
					$.ajax({
						type: 'GET',
						url: Config.apiServer + '/ext/cashback?s=' + (storeId ? storeId : '') + '&o=' + (offerId ? offerId : '') + '&ref1=' + self.refCodes[trigger] + '&ref3=cof' + '&v=' + Config.version + (CoFund.Cashback.isButtonABTest ? '&ref4=' + CoFund.Cashback.buttonABRef : '') + (CoFund.Info.getExtId() ? '&app_uid=' + CoFund.Info.getExtId() : ''),
						cache: false,
						dataType: 'json',
						success: function success(response, status, $xhr) {
							if (response.hasOwnProperty('url') && response.url) {
								chrome.runtime.sendMessage({
									action: 'firePixel',
									url: response.url
								});
								chrome.runtime.sendMessage({
									action: 'cofundEvent',
									method: 'logCashbackFired',
									cashback: cashback
								});
							} else {
								chrome.runtime.sendMessage({
									action: 'cofundEvent',
									method: 'logCashbackFireFailed',
									parameters: response.url ? 'Invalid response from /ext/cashback for store ' + (storeId ? storeId : '') : 'No url for store ' + (storeId ? storeId : ''),
									cashback: cashback
								});
							}
						},
						error: function error($xhr, status, errorThrown) {
							chrome.runtime.sendMessage({
								action: 'cofundEvent',
								method: 'logCashbackFireFailed',
								parameters: 'tcb:' + $xhr.status + ' (' + $xhr.responseText + ')',
								cashback: cashback
							});
						}
					});
				}, 1000);
				var triggers = {};
				triggers[CoFund.Session.TR_CASHBACK_FIRE] = true;
				triggers[CoFund.Session.TR_CASHBACK_FIRE_TRIG] = self.refCodes[trigger] + (cbDetails ? cbDetails : '');
				chrome.runtime.sendMessage({
					action: 'cofundSessionUpdate',
					triggers: triggers,
					cashback: cashback
				});
			}
		},
		formatForDisplay: function formatForDisplay(cashback, renderAsHtml) {
			if (cashback.pay) {
				if (cashback.payType && Number(cashback.payType) === 1) {
					return renderAsHtml ? '<span style="display: block">$' + parseFloat(cashback.pay).toFixed(2) + '</span><sub style="left: 0">cashback</sub>' : '$' + parseFloat(cashback.pay).toFixed(2);
				} else {
					return (parseFloat(cashback.pay) > 9.9 ? parseFloat(cashback.pay).toFixed(0) : parseFloat(cashback.pay).toFixed(1)) + (renderAsHtml ? '<sup>%</sup><sub>cashback</sub>' : '%');
				}
			}
		},
		setSuppressionFlag: function setSuppressionFlag(cashback, flag) {
			switch (flag) {
				case 'suppress':
					if (!cashback || Array.isArray(cashback) && cashback.length === 0) {
						cashback = {};
					}
					cashback.suppressPrompts = true;
					break;
				case 'continue':
					if (cashback && cashback.hasOwnProperty('suppressPrompts')) {
						delete cashback.suppressPrompts;
					}
					break;
			}
			return cashback;
		}
	};

	CoFund.Events = {
		// Constant event types
		TYPE_CODES_PRESENTED: 1,
		TYPE_CODE_SUCCESS: 2,
		TYPE_CODE_FAILURE: 3,
		TYPE_NO_CODES: 4,
		TYPE_CASHBACK_FIRED: 5,
		TYPE_CASHBACK_FIRE_FAILED: 6,
		TYPE_NO_CODES_NO_CASHBACK: 7,
		TYPE_PROVIDER_ERROR: 8,
		TYPE_CASHBACK_BUTTON_DISMISSED: 9,
		TYPE_DRAWER_CLOSED: 10,
		TYPE_CODE_COPIED: 11,
		TYPE_ACTIVE_MODAL: 12,
		TYPE_APP_RATING: 13,
		TYPE_APP_SHARE: 14,
		TYPE_DEVICE_SETUP: 15,
		TYPE_TIMINGS: 16,
		TYPE_PRICE_COMPARE: 25,
		log: function log(logType) {
			var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			    _ref$message = _ref.message,
			    message = _ref$message === undefined ? '' : _ref$message,
			    _ref$cashback = _ref.cashback,
			    cashback = _ref$cashback === undefined ? {} : _ref$cashback;

			var _cashback$s = cashback.s,
			    s = _cashback$s === undefined ? 0 : _cashback$s;

			$.ajax({
				type: 'POST',
				url: Config.apiServer + '/ext/events?app_uid=' + CoFund.Info.getExtId(),
				data: {
					v: Config.version,
					type: logType,
					currentState: CoFund.State.get(),
					message: message,
					s: s
				}
			});
		},
		logPriceCompare: function logPriceCompare(_ref2) {
			var _ref2$message = _ref2.message,
			    message = _ref2$message === undefined ? {} : _ref2$message,
			    _ref2$cashback = _ref2.cashback,
			    cashback = _ref2$cashback === undefined ? {} : _ref2$cashback;

			var auth = CoFund.Info.getUser() && CoFund.Info.getUser().auth ? CoFund.Info.getUser().auth : '';

			$.ajax({
				type: 'GET',
				url: Config.apiServer + '/ext/pricecompareevent',
				data: {
					app_uid: CoFund.Info.getExtId(),
					v: Config.version,
					auth: auth,
					product: message.product,
					product_id: message.productId || '',
					actual_price: message.actualPrice,
					cheaper_price: message.cheaperPrice,
					merchant_id: message.merchantId || '',
					tax_amount: message.tax || 0.00,
					shipping_amount: message.shippingAmount || 0.00,
					description: message.description
				}
			});

			this.log(this.TYPE_PRICE_COMPARE, {
				message: message.extraData,
				cashback: cashback
			});
		},
		logEventForHotelPriceCompare: function logEventForHotelPriceCompare(logType) {
			var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
			    _ref3$extraData = _ref3.extraData,
			    extraData = _ref3$extraData === undefined ? '' : _ref3$extraData,
			    _ref3$cashback = _ref3.cashback,
			    cashback = _ref3$cashback === undefined ? {} : _ref3$cashback;

			var _cashback$s2 = cashback.s,
			    s = _cashback$s2 === undefined ? 0 : _cashback$s2;

			$.ajax({
				type: 'POST',
				url: Config.apiServer + '/ext/events?app_uid=' + CoFund.Info.getExtId(),
				data: {
					v: Config.version,
					type: logType,
					currentState: CoFund.State.get(),
					extraData: extraData,
					s: s
				}
			});
		},
		logHotelPriceCompare: function logHotelPriceCompare(_ref4) {
			var _ref4$message = _ref4.message,
			    message = _ref4$message === undefined ? {} : _ref4$message,
			    _ref4$cashback = _ref4.cashback,
			    cashback = _ref4$cashback === undefined ? {} : _ref4$cashback;

			var auth = CoFund.Info.getUser() && CoFund.Info.getUser().auth ? CoFund.Info.getUser().auth : '';

			$.ajax({
				type: 'GET',
				url: Config.apiServer + '/ext/hotelpricecompareevent',
				data: {
					app_uid: CoFund.Info.getExtId(),
					v: Config.version,
					auth: auth,
					hotel_id: message.hotelId,
					hotel_name: message.hotelName,
					actual_price: message.actualPrice,
					cheaper_price: message.cheaperPrice,
					description: message.description
				}
			});

			this.logEventForHotelPriceCompare(this.TYPE_PRICE_COMPARE, {
				extraData: message.extraData,
				cashback: cashback
			});
		},
		logCodesPresented: function logCodesPresented(params) {
			this.log(this.TYPE_CODES_PRESENTED, params);
		},
		logCodeSuccess: function logCodeSuccess(params) {
			this.log(this.TYPE_CODE_SUCCESS, params);
		},
		logCodeFailure: function logCodeFailure(params) {
			this.log(this.TYPE_CODE_FAILURE, params);
		},
		logNoCodes: function logNoCodes(params) {
			this.log(this.TYPE_NO_CODES, params);
		},
		logCashbackFired: function logCashbackFired(params) {
			this.log(this.TYPE_CASHBACK_FIRED, params);
		},
		logCashbackFireFailed: function logCashbackFireFailed(params) {
			this.log(this.TYPE_CASHBACK_FIRE_FAILED, params);
		},
		logNoCodesNoCashback: function logNoCodesNoCashback(params) {
			this.log(this.TYPE_NO_CODES_NO_CASHBACK, params);
		},
		logProviderError: function logProviderError(params) {
			this.log(this.TYPE_PROVIDER_ERROR, params);
		},
		logCashbackButtonDismissed: function logCashbackButtonDismissed(params) {
			this.log(this.TYPE_CASHBACK_BUTTON_DISMISSED, params);
		},
		logDrawerClosed: function logDrawerClosed(params) {
			this.log(this.TYPE_DRAWER_CLOSED, params);
		},
		logCodeCopied: function logCodeCopied(params) {
			this.log(this.TYPE_CODE_COPIED, params);
		},
		logActiveModal: function logActiveModal(params) {
			this.log(this.TYPE_ACTIVE_MODAL, params);
		}
	};

	CoFund.Session = {
		// Constant session types
		TR_CHECKOUT_MATCHED: 'cm',
		TR_DRAWER_SHOWN: 'ds',
		TR_DRAWER_MSG: 'dm',
		TR_COUNT_CODES: 'cp',
		TR_DRAWER_CLOSED: 'dc',
		TR_DRAWER_MAN_OPEN: 'do',
		TR_US_TRIED_CODES: 'tc',
		TR_US_COPIED_CODES: 'cc',
		TR_US_VIEWED_CODES: 'vc',
		TR_US_VIEWED_AUTOLOAD_MANUAL: 'va',
		TR_CODE_SUCCESS: 'cs',
		TR_CODE_FAILED: 'cf',
		TR_CASHBACK_FIRE: 'ch',
		TR_CASHBACK_FIRE_TRIG: 'ct',
		TR_TEST_NAME: 'tn',
		TR_TEST_RESULT: 'tr',
		firstSendComplete: false,
		update: function update(triggers, cashback) {
			if (!cashback || !cashback.hasOwnProperty('s')) {
				return; // can't log it
			}
			var callback = Config.apiServer + '/ext/session?app_uid=' + (CoFund.Info.getExtId() ? CoFund.Info.getExtId() : '') + '&s=' + cashback.s + '&v=' + Config.version;
			for (var tr in triggers) {
				callback += '&' + tr + '=' + triggers[tr];
			}
			var self = this;
			if (this.firstSendComplete) {
				// After initial page load, wait 5 seconds before 
				// sending to ensure cookie is set
				setTimeout(function () {
					self.firstSendComplete = true;
					$.ajax({
						type: 'GET',
						url: callback
					});
				}, 5000);
			} else {
				self.firstSendComplete = true;
				$.ajax({
					type: 'GET',
					url: callback
				});
			}
		},
		updateOne: function updateOne(trigger, val, cashback) {
			var triggers = {};
			triggers[trigger] = val;
			this.update(triggers, cashback);
		},
		tested: function tested(name, result, cashback) {
			var triggers = {};
			triggers[this.TR_TEST_NAME] = name;
			triggers[this.TR_TEST_RESULT] = result;
			this.update(triggers, cashback);
		}
	};

	CoFund.Flags = {
		ALWAYS_SHOW_DRAWER: 1,
		COUPON_TAB_SUPPRESS: 2,
		SLIDE_IN_PGW_SUPPRESS: 4,
		CHECK_PROMPT_SUPPRESSION: 8,
		CASHBACK_BUTTON_SUPPRESS: 16,
		CODE_COUNT_SUPPRESS: 32,
		hasFlag: function hasFlag(flag, flags) {
			if (!flags) {
				var ruleset = CoFund.Store.get('ruleset');
				if (ruleset && ruleset.hasOwnProperty('flags')) {
					flags = ruleset.flags;
				}
			}
			if (flags) {
				return (flags & flag) === flag;
			}
		}
	};

	module.exports = CoFund;

	/***/
},
/* 74 */
/***/function (module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(75), __esModule: true };

	/***/
},
/* 75 */
/***/function (module, exports, __webpack_require__) {

	__webpack_require__(76);
	module.exports = __webpack_require__(3).Object.keys;

	/***/
},
/* 76 */
/***/function (module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(49);
	var $keys = __webpack_require__(33);

	__webpack_require__(77)('keys', function () {
		return function keys(it) {
			return $keys(toObject(it));
		};
	});

	/***/
},
/* 77 */
/***/function (module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(13);
	var core = __webpack_require__(3);
	var fails = __webpack_require__(23);
	module.exports = function (KEY, exec) {
		var fn = (core.Object || {})[KEY] || Object[KEY];
		var exp = {};
		exp[KEY] = exec(fn);
		$export($export.S + $export.F * fails(function () {
			fn(1);
		}), 'Object', exp);
	};

	/***/
},
/* 78 */
/***/function (module, exports) {

	'use strict';

	/**
  * ObjectTraverser can be used to manipulate object properties by string, for example
  * var newVal = new ObjectTraverser({ a: { b: 'c' } }).getChildNode('a.b') -> 'c'
  */

	function ObjectTraverser(obj) {

		for (var prop in obj) {
			this[prop] = obj[prop];
		}
	}

	ObjectTraverser.prototype.getChildNode = function (nodeName) {

		return typeof this[nodeName] !== 'undefined' ? this[nodeName] : null;
	};

	ObjectTraverser.prototype.replaceChildNode = function (nodeName, newValue) {

		this[nodeName] = newValue;

		return this;
	};

	module.exports = ObjectTraverser;

	/***/
},
/* 79 */
/***/function (module, exports) {

	'use strict';

	/**
  * Handy String object overwrite
  */

	String.prototype.startsWith = function (text) {
		return this.substr(0, text.length).equals(text);
	};

	String.prototype.contains = function (text) {
		return this.toLowerCase().indexOf(text.toLowerCase()) >= 0;
	};

	String.prototype.equals = function (text) {
		return typeof text === 'string' ? this.toLowerCase() === text.toLowerCase() : false;
	};

	module.exports = String;

	/***/
},
/* 80 */
/***/function (module, exports) {

	'use strict';

	/**
  * Object for basic URL processing
  */

	var Url = {

		getHost: function getHost(url) {

			var anchor = document.createElement('A');
			anchor.href = url;

			return anchor.hostname;
		},

		getPath: function getPath(url) {

			var anchor = document.createElement('A');
			anchor.href = url;

			return anchor.pathname;
		},

		isSecure: function isSecure(url) {

			var anchor = document.createElement('A');
			anchor.href = url;

			return anchor.protocol === 'https:';
		}

	};

	module.exports = Url;

	/***/
}]
/******/);