/**
 * Copyright 2012-present Thom Seddon.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//Globals
var dropdown = document.querySelector('.global-nav .pull-right .nav .DashUserDropdown');
var currentAccount;

/**
 * Get current account from DOM
 */

var getCurrentAccount = function () {
  // Get current uid and image from DOM
  var name = dropdown.querySelector('.DashUserDropdown-userInfo .fullname');
  var img = document.querySelector('.dropdown-toggle img');

  if (!img) return false;

  return {
      uid: img.getAttribute('data-user-id'),
      name: name.innerHTML,
      img: img.getAttribute('src')
  };
};

/**
 * Switch current account
 */

var switchAccount = function (event) {
  var target = event.target;
  var uid;
  while (target.tagName !== 'LI') {
    target = target.parentNode;
  }
  uid = target.getAttribute('data-user-id');

  chrome.extension.sendMessage({type: 'switchAccount', uid: uid});
};

/**
 * Add account
 */

var addAccount = function (event) {
  chrome.extension.sendMessage({ type: 'logout' });
};

/**
 * Inject accounts into DOM
 */

var render = function (data) {

  // Cleanup previous render
  var twichers = dropdown.querySelectorAll('.twitcher-inserted');
  for (var i = 0; i < twichers.length; i++) {
    var childNode = twichers[i];
    if (childNode.parentNode) {
      childNode.parentNode.removeChild(childNode);
    }
  }

  var target = dropdown.querySelector('.dropdown-divider');
  var parent = target.parentNode;
  var accountsAdded = false;
  var li, html;

  // Add divider
  li = document.createElement('li');
  li.className = 'dropdown-divider twitcher-inserted';
  parent.insertBefore(li, target);

  var handleDragStart = function (uid) {
    return function(event) {
      this.style.opacity = '0.4';
      this.getElementsByTagName('a')[0].style.background = 'red';

      // Store uid
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text', uid);
    };
  };

  var handleDragEnd = function (event) {
    this.style.opacity = '1';
    this.getElementsByTagName('a')[0].setAttribute('style', '');
  };

  // Add each account
  var accounts = data.accounts;
  for (var uid in accounts) {
    var account = accounts[uid];

    if (uid == currentAccount.uid || account.ignored)
      continue;

    li = document.createElement('li');
    li.className = 'twitcher-inserted';
    li.setAttribute('data-user-id', uid);
    li.setAttribute('draggable', true);
    li.innerHTML = '<a><img style="margin:0 9px -5px 0;width:20px;height:20px;border-radius:50%" src="' + account.img + '">' + account.name + '</a>';
    li = parent.insertBefore(li, target);
    li.addEventListener('click', switchAccount, false);

    // Add drag shizzle
    li.addEventListener('dragstart', handleDragStart(uid), false);
    li.addEventListener('dragend', handleDragEnd, false);

    accountsAdded = true;
  }

  if (!accountsAdded) {
    li = document.createElement('li');
    li.className = 'twitcher-inserted';
    li.innerHTML = '<p style="color:#999;font-size:0.8em;margin-left:22px">No other accounts</p>';
    li = parent.insertBefore(li, target);
  }

  // Add account button
  li = document.createElement('li');
  li.className = 'twitcher-inserted';
  li.innerHTML = '<a href="#" style="margin-top:6px">&nbsp;&nbsp;<span style="font-size:1.2em">+</span>&nbsp;&nbsp; Add Account</a>';
  li = parent.insertBefore(li, target);
  li.addEventListener('click', addAccount, false);

  // Donate
  if (data.settings && data.settings['show-donate']) {
    li = document.createElement('li');
    li.className = 'dropdown-divider twitcher-inserted';
    parent.insertBefore(li, target);

    li = document.createElement('li');
    li.className = 'twitcher-inserted';
    // li.innerHTML = '<a id="twitcher-donate" href="https://twitcherapp.com/donate?utm_source=twitter-inline&utm_medium=link&utm_content=pwyw&utm_campaign=donate" style="margin-top:10px">Twitcher is a<br />pay-what-you-want app...</a>';
    li.innerHTML = '<a id="twitcher-donate" href="https://twitcherapp.com/donate?utm_source=twitter-inline&utm_medium=link&utm_content=coffee&utm_campaign=donate" style="margin-top:10px">Donate a ☕ &nbsp;to twitcher?</a>';
    li = parent.insertBefore(li, target);
    document.styleSheets[0].insertRule('#twitcher-donate { color: #009999; text-align: center; }', 0);
    document.styleSheets[0].insertRule('#twitcher-donate:hover { color: #FFF; }', 0);
  }
};

/**
 * Bind listeners to DOM
 */

var bindDropListeners = function () {
  var preventDefault = function (event) {
    event.preventDefault();
    return false;
  };

  // This stops it propogating when droped back inside the dropdown
  dropdown.addEventListener('dragover', preventDefault, false);
  dropdown.addEventListener('dragenter', preventDefault, false);
  dropdown.addEventListener('drop', function (event) {
    event.preventDefault();
    event.stopPropagation();
  }, false);

  // Removes it when it's dropped outside the dropdown
  document.body.addEventListener('dragover', preventDefault, false);
  document.body.addEventListener('dragenter', preventDefault, false);
  document.body.addEventListener('drop', function (event) {
    event.preventDefault();
    chrome.extension.sendMessage({type: 'removeAccount', uid: event.dataTransfer.getData('text')}, render);
  }, false);
};


currentAccount = getCurrentAccount();
if (currentAccount) {
  // Save latest version of current user
  chrome.extension.sendMessage({ type: 'currentAccount', currentAccount: currentAccount }, function () {
    // Boot
    bindDropListeners();
    chrome.extension.sendMessage({ type: 'getAccounts' }, render);
  });
}
