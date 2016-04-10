var checkbox_settings;
var hotKeyElement;
var checkboxSettingsCaller = function() {
  var id = this.id;
  var value;
  console.log(id);
  if(this.getAttribute("type")=="checkbox"){
    if(this.checked){
      value = true;
    }
    else{
      value = false;
    }
  }
  console.log("saving options",this.id);
  console.log("saving options",this);
  console.log("saving options",value);
  save_options(this.id, this, value);
};
function save_options(key, element, value){
  var options = {};
  options[key] = value;
  console.log("options",options);
  chrome.storage.sync.set(options, function() {
    restore_options();
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  console.log("restoring options");
  chrome.storage.sync.get({
    checkAsType: true,
    addToContextMenu: true,
    hotKeyCombo: getDefaultKeyString()
  }, function(items) {
    updateDisplay(items);
  });
}

function updateDisplay(items){
  console.log("updating display", items);
  updateCheckBoxes(items);
  hotKeyElement.value = items.hotKeyCombo;
  var status = document.getElementById('status');
  addClass(status, 'updated');
    status.textContent = 'Preferences saved.';
    setTimeout(function() {
      status.textContent = '';
      removeClass(status, 'updated');
    }, 1050);
}

function updateCheckBoxes(items){
  console.log("updating checkboxes", items);
  console.log("checkboxes", checkbox_settings);
  for (var i = 0; i <  checkbox_settings.length; i++) {
    var id = checkbox_settings[i].getAttribute("id");
    console.log(items);
    console.log(id);
    console.log(id in items);
    console.log(items[id]);
    if(id in items){
      if(items[id]===true){
        document.getElementById(id).checked = true;
      }
      else{
        document.getElementById(id).checked = false;
      }
    }
    else if (id != null){
      document.getElementById(id).checked = false;
    }
  }
}
function addClass(element, classNameToAdd) {
  element.classList.add(classNameToAdd);
}

function removeClass(element, classNameToRemove) {
  element.classList.remove(classNameToRemove);
}

function load() {
  checkbox_settings = document.getElementsByClassName('c_sp_s_cb_setting');
  hotKeyElement = document.getElementById('hotKeyCombo');
  restore_options();
  // Add checkbox settings listeners
  for (i = 0; i <  checkbox_settings.length; i++) {
    checkbox_settings[i].addEventListener('click', checkboxSettingsCaller, false);
  }

  hotKeyElement.addEventListener('keydown', function(evt) {
    switch (evt.keyCode) {
      case 27:  // Escape
        evt.stopPropagation();
        evt.preventDefault();
        hotKeyElement.blur();
        return false;
      case 8:   // Backspace
      case 46:  // Delete
        evt.stopPropagation();
        evt.preventDefault();
        hotKeyElement.value = '';
        localStorage['checkKey'] = '';
        // sendKeyToAllTabs('');
        windocheckKeyeyStr = '';
        return false;
      case 9:  // Tab
        return false;
      case 16:  // Shift
      case 17:  // Control
      case 18:  // Alt/Option
      case 91:  // Meta/Command
        evt.stopPropagation();
        evt.preventDefault();
        return false;
    }
    var keyStr = keyEventToString(evt);
    if (keyStr) {
      hotKeyElement.value = keyStr;
      save_options(hotKeyElement.id, hotKeyElement, hotKeyElement.value);
    }
    evt.stopPropagation();
    evt.preventDefault();
    return false;
  }, true);
}

document.addEventListener('DOMContentLoaded', load);
