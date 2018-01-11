var scriptItems = [];
var selectedIndex = 0;
var mainContainer = $('#main_panel');

/**
 * Saves the scripts into local storage.
 */
function saveScripts() {
  var serializedScripts = [];
  for (var i = 0, length = scriptItems.length; i < length; ++i) {
    serializedScripts.push(scriptItems[i].serialize());
  }
  localStorage.scripts = JSON.stringify(serializedScripts);
  localStorage.selectedIndex = selectedIndex;
};

/**
 * Sets the currently selected item.
 *
 * @param newSelectedIndex index of the new selected item.
 */
function setSelectedIndex(newSelectedIndex) {
  var existingSelectedItem = getSelectedItem();
  if (existingSelectedItem) {
    existingSelectedItem.getTitleElement().removeClass('script_item_selected');
  }
  selectedIndex = newSelectedIndex;
  var newSelectedItem = getSelectedItem();
  newSelectedItem.getTitleElement().addClass('script_item_selected');
  mainContainer.empty();
  mainContainer.append(newSelectedItem.getEditorElement());
  newSelectedItem.refreshEditorElement();
};

/**
 * Gets the currently selected script item.
 */
function getSelectedItem() {
  return scriptItems[selectedIndex];
}

/**
 * Adds a new script item.
 *
 * @param !serializedScript the JSON serialized script item.
 */
function addNewScript(serializedScript) {
  var scriptItem = new ScriptItem(serializedScript);
  scriptItems.push(scriptItem);
  scriptItem.setSelectedHandler(function() {
    var newSelectedIndex = scriptItems.indexOf(scriptItem);
    if (newSelectedIndex >= 0) {
      setSelectedIndex(scriptItems.indexOf(scriptItem));
    }
  });
  scriptItem.setRemoveHandler(function() {
    var newSelectedIndex = scriptItems.indexOf(scriptItem);
    scriptItems.splice(newSelectedIndex, 1);
    if (newSelectedIndex > 0) {
      --newSelectedIndex;
    }
    if (scriptItems.length == 0) {
      addNewScript();
    }
    setSelectedIndex(newSelectedIndex);
    scriptItem.getTitleElement().detach();
  });
  $('#script_panel').append(scriptItem.getTitleElement());
};

/**
 * Initializes the extension.
 */
function initialize() {
  $('#new_script_btn').click(function() {
    addNewScript();
    setSelectedIndex(scriptItems.length - 1);
  });
  if (localStorage.scripts) {
    var serializedScripts = $.parseJSON(localStorage.scripts);
    for (var i = 0, length = serializedScripts.length; i < length; ++i) {
      addNewScript(serializedScripts[i]);
    }
  }
  if (scriptItems.length == 0) {
    addNewScript();
  }
  if (localStorage.selectedIndex) {
    setSelectedIndex(parseInt(localStorage.selectedIndex));
  } else {
    setSelectedIndex(0);
  }
  window.onunload = saveScripts;
};

window.onload = initialize;
