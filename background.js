var checkAsType;
var addToContextMenu;
var hotKeyCombo;

// Redirect to options.html on install
chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
    chrome.tabs.create({url: "options.html?newinstall=yes"});
  }else if(details.reason == "update"){
    var thisVersion = chrome.runtime.getManifest().version;
    console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
  }
});
// Settings
chrome.storage.sync.get(['checkAsType','addToContextMenu','hotKeyCombo'], function (obj) {
  checkAsType = obj.checkAsType;
  addToContextMenu = obj.addToContextMenu;
  hotKeyCombo = obj.hotKeyCombo;
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if(typeof changes.checkAsType !== "undefined"){
    checkAsType = changes.checkAsType.newValue;
  }
  if(typeof changes.addToContextMenu !== "undefined"){
    addToContextMenu = changes.addToContextMenu.newValue;
  }
  if(typeof changes.hotKeyCombo !== "undefined"){
    hotKeyCombo = changes.hotKeyCombo.newValue;
  }
});

function checkSpelling(inputString) {
  chrome.browserAction.setIcon({path: 'spellcheck19-active.png'});
  // Send API request
  console.log("Initiate spell checking");
  console.log("input string",inputString);
  //Callback
  setTimeout(function() {
    chrome.browserAction.setIcon({path: 'spellcheck19.png'});
  }, 1050);
}

function initBackground() {
  console.log("background script initialted.");

  chrome.extension.onRequest.addListener(
      function(request, sender, sendResponse) {
        console.log("request",request);
        if (request['init']) {
          sendResponse({'key': hotKeyCombo});
        } else if (request['inputString']) {
          checkSpelling(request['inputString']);
        }
      });

  chrome.browserAction.onClicked.addListener(
      function(tab) {
        // Clicked the browser action button
        chrome.tabs.sendRequest(
            tab.id,
            {'spellcheckSelection': true});
      });
}

initBackground();
