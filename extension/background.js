let desktopMediaRequestId = '';

// Handle extension button click to open in new tab
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  });
});

// Handle messages from extension pages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('background.js message', message);
  if (message.type === 'SS_UI_REQUEST') {
    requestScreenSharing(sender.tab);
  }
});

function requestScreenSharing(tab) {
  // Include all possible sources for full screen capture
  const sources = ['screen', 'window', 'tab'];

  desktopMediaRequestId = chrome.desktopCapture.chooseDesktopMedia(
    sources,
    tab,
    streamId => {
      if (streamId) {
        chrome.runtime.sendMessage({
          type: 'SS_DIALOG_SUCCESS',
          streamId: streamId
        });
      } else {
        chrome.runtime.sendMessage({
          type: 'SS_DIALOG_CANCEL'
        });
      }
    }
  );
}

function cancelScreenSharing() {
  if (desktopMediaRequestId) {
    chrome.desktopCapture.cancelChooseDesktopMedia(desktopMediaRequestId);
  }
}
