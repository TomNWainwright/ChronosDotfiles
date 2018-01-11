/**
 * Constructor for a script item. A script item manages a set of scripts
 * for execution.
 */
function ScriptItem(serializedScript) {
  var title = 'Untitled script';
  if (serializedScript && serializedScript.title) {
    title = serializedScript.title;
  }
  var scripts = [];
  if (serializedScript && serializedScript.scripts) {
    scripts = serializedScript.scripts;
  }
  var startUrl = '';
  if (serializedScript && serializedScript.startUrl) {
    startUrl = serializedScript.startUrl;
  }
  // UI elements for the left script panel.
  this.titleElem_ = $('<div class="script_item">');
  this.titleTextElem_ = $('<div class="script_title_text">');
  this.titleTextElem_.text(title);
  this.titleElem_.append(this.titleTextElem_);
  this.removeBtn_ = $('<div class="remove_script_btn">');
  this.removeBtn_.append('<svg>' +
      '<circle cx="6" cy="6" r="6" fill="#ccc" />' +
      '<line x1="3" y1="3" x2="9" y2="9" style="stroke:#fff; stroke-width:2" />' +
      '<line x1="9" y1="3" x2="3" y2="9" style="stroke:#fff; stroke-width:2" />' +
      '</svg>');
  this.titleElem_.append(this.removeBtn_);

  // UI elements for the script editor.
  this.runBtn_ = $('<input class="run_btn" type="submit" value="Run!">');
  this.titleEditor_ = $('<input id="title_editor" type="text" size="35">');
  this.titleEditor_.attr('value', title);
  this.startUrlEditor_ = $('<input id="start_url_editor" type="text" size="35" ' +
      'placeholder="Leave blank to use active page">');
  this.startUrlEditor_.attr('value', startUrl);
  this.scriptEditor_ = new ScriptEditor(scripts);
  this.scriptEditorContainer_ = $('<div class="script_container">');
  this.scriptEditorContainer_.append(this.runBtn_);
  this.scriptEditorContainer_.append($('<table>')
    .append($('<tr>')
      .append($('<td>').append('<label for="title_editor"><strong>Title</strong></label>'))
      .append($('<td>').append(this.titleEditor_)))
    .append($('<tr>')
      .append($('<td>').append('<label for="start_url_editor"><strong>Start URL</strong></label>'))
      .append($('<td>').append(this.startUrlEditor_)))
    .append($('<tr>')
      .append($('<td colspan=2 class="script_editor">').append(this.scriptEditor_.getElement()))));
};

/**
 * Gets the script editor element.
 */
ScriptItem.prototype.getEditorElement = function() {
  return this.scriptEditorContainer_;
};

/**
 * Refresh the script editor element.
 */
ScriptItem.prototype.refreshEditorElement = function() {
  var thisScriptItem = this;
  this.runBtn_.button();
  this.runBtn_.click(function() {
    thisScriptItem.runScript();
  });
  this.titleEditor_.keyup(function() {
    thisScriptItem.titleTextElem_.text(thisScriptItem.titleEditor_.attr('value'));
  });
  this.scriptEditor_.refresh();
};

/**
 * Serializes this script into a JSON record.
 */
ScriptItem.prototype.serialize = function() {
  return {
    title: this.titleEditor_.attr('value'),
    startUrl: this.startUrlEditor_.attr('value'),
    scripts: this.scriptEditor_.serialize()
  };
};

/**
 * Runs the current script.
 */
ScriptItem.prototype.runScript = function() {
  this.scriptEditor_.runScript(this.startUrlEditor_.attr('value'));
};

/**
 * Gets the UI element that displays the title of the script.
 *
 * @return the element that shows the title of the script, and the button
 *      to remove it.
 */
ScriptItem.prototype.getTitleElement = function() {
  return this.titleElem_;
};

/**
 * Sets the handler that is fired when the script item is selected.
 */
ScriptItem.prototype.setSelectedHandler = function(handler) {
  this.titleElem_.click(handler);
};

/**
 * Sets the handler that is fired when the remove button is clicked.
 */
ScriptItem.prototype.setRemoveHandler = function(handler) {
  this.removeBtn_.click(handler);
};
