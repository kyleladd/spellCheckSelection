var checkKeyStr;
//Get the selected text and send request to background
function spellcheckSelection() {
  var focused = document.activeElement;
  var selectedText;
  if (focused) {
    try {
      selectedText = focused.value.substring(
          focused.selectionStart, focused.selectionEnd);
    } catch (err) {
    }
  }
  if (selectedText == undefined) {
    var sel = window.getSelection();
    var selectedText = sel.toString();
  }
  chrome.extension.sendRequest({'inputString': selectedText});
}

function onExtensionMessage(request) {
  console.log("onmessage", request);
  if (request['spellcheckSelection'] != undefined) {
    if (!document.hasFocus()) {
      return;
    }
    spellcheckSelection();
  } else if (request['key'] != undefined) {
    checkKeyStr = request['key'];
  }
}

function initContentScript() {
  chrome.extension.onRequest.addListener(onExtensionMessage);
  chrome.extension.sendRequest({'init': true}, onExtensionMessage);

  document.addEventListener('keydown', function(evt) {
    if (!document.hasFocus()) {
      return true;
    }
    var keyStr = keyEventToString(evt);
    if (keyStr == checkKeyStr && checkKeyStr.length > 0) {
      spellcheckSelection();
      evt.stopPropagation();
      evt.preventDefault();
      return false;
    }
    return true;
  }, false);
}

initContentScript();
