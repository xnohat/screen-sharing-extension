let desktopMediaRequestId = '';

// Handle extension button click to open sidebar
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Handle messages from sidebar
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SS_UI_REQUEST') {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        requestScreenSharing(tabs[0]);
      } else {
        console.error('No active tab found');
      }
    });
  }
  if (message.type === 'SS_UI_CANCEL') {
    cancelScreenSharing();
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
