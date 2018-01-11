var tabId = 0;

/**
 * Constructor for a script editor. A script editor manages a set of
 * scripts that are executed sequentially.
 */
function ScriptEditor(serializedRecord) {
  this.container_ = $('<div>');
  this.tabHeaders_ = $('<ul>');
  this.container_.append(this.tabHeaders_);
  this.codeMirrors_ = [];
  this.selectedTabIndex_ = serializedRecord.selectedTabIndex;
  if (serializedRecord.scripts) {
    for (var i = 0, length = serializedRecord.scripts.length; i < length; ++i) {
      this.addEditor_(serializedRecord.scripts[i]);
    }
  }
  while (this.codeMirrors_.length < 6) {
    this.addEditor_('');
  }
};

/**
 * Gets the container for this script editor.
 */
ScriptEditor.prototype.getElement = function() {
  return this.container_;
};

/**
 * Refresh the element.
 */
ScriptEditor.prototype.refresh = function() {
  var this_ = this;
  var selectedTabIndex = this.selectedTabIndex_;
  this.container_.tabs({
    show: function(event, ui) {
      this_.codeMirrors_[ui.index].refresh();
      this_.selectedTabIndex_ = ui.index;
      return true;
    }
  });
  this.container_.tabs('select', selectedTabIndex);
};

/**
 * Serializes this script into a JSON record.
 */
ScriptEditor.prototype.serialize = function() {
  var scripts = [];
  for (var i = 0, length = this.codeMirrors_.length; i < length; ++i) {
    scripts.push(this.codeMirrors_[i].getValue());
  }
  return {
    scripts: scripts,
    selectedTabIndex: this.selectedTabIndex_
  };
};

/**
 * Serializes this script into a JSON record.
 */
ScriptEditor.prototype.addEditor_ = function(script) {
  tabId++;
  var header = $('<a href="#tabs-' + tabId + '">Step ' +
      this.codeMirrors_.length + '</a>');
  this.tabHeaders_.append($('<li>').append(header));
  var scriptElem = $('<div id="tabs-' + tabId + '">');
  this.container_.append(scriptElem);
  var options = {autofocus: true,
                 lineNumbers: true,
                 lineWrapping: true,
                 mode: 'javascript',
                 value: script};
  this.codeMirrors_.push(CodeMirror(scriptElem[0], options));
  scriptElem.tabs();
};

/**
 * Runs the current script.
 */
ScriptEditor.prototype.runScript = function(startUrl) {
  var scriptDetails = [];
  if (startUrl) {
    scriptDetails.push({url: startUrl});
  }
  for (var i = 0, length = this.codeMirrors_.length; i < length; ++i) {
    scriptDetails.push({
      code: this.codeMirrors_[i].getValue()
    });
  }
  // Remove empty entries at the end.
  while (scriptDetails.length) {
    var lastElement = scriptDetails.pop();
    if (lastElement.code) {
      scriptDetails.push(lastElement);
      break;
    }
  }
  // Reverse it so we can use it as a queue.
  scriptDetails.reverse();
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.extension.sendMessage({
      scriptDetails: scriptDetails,
      tabId: tabs[0].id
    });
  });
};
