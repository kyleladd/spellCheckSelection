var checkKeyStr;
//Get the selected text and send request to background
function spellcheckSelection() {
  console.log("spell check selection");
  var focused = document.activeElement;
  console.log("focused", focused);
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
  console.log("append the element");
  var body = document.getElementsByTagName("body")[0];
  var input = document.createElement("textarea");
  // input.cols = "80";
  // input.rows = "40";
  var modal = document.createElement("div");
  var modal_content_container = document.createElement("div");
  var modal_close = document.createElement("div");
  modal.classList.add("cms__modal");
  modal_content_container.classList.add("cms__modal_content");
  modal_close.classList.add("cms__close");
  modal_close.innerHTML = "Close";
  input.value = selectedText;
  body.appendChild(modal); //appendChild
  modal.appendChild(modal_content_container);
  modal.appendChild(modal_close);
  modal_content_container.appendChild(input);
  input.focus();
  console.log("element appended");
  // document.getElementsByClassName("cms__close").onclick = function() {
  document.getElementsByClassName("cms__close")[0].addEventListener("click", function(){
    console.log("Clicked Close");
    body.removeChild(modal);
  });
  //   console.log("Clicked Close");
  //   body.removeChild(modal);
  // }
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
    // console.log("cmon");

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
