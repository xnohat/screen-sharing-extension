let desktopMediaRequestId = '';

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    if (msg.type === 'SS_UI_REQUEST') {
      requestScreenSharing(port, msg);
    }
    if (msg.type === 'SS_UI_CANCEL') {
      cancelScreenSharing(msg);
    }
  });
});

function requestScreenSharing(port, msg) {
  const sources = ['screen', 'window', 'tab', 'audio'];

  desktopMediaRequestId = chrome.desktopCapture.chooseDesktopMedia(
    sources,
    port.sender.tab,
    streamId => {
      if (streamId) {
        msg.type = 'SS_DIALOG_SUCCESS';
        msg.streamId = streamId;
      } else {
        msg.type = 'SS_DIALOG_CANCEL';
      }
      port.postMessage(msg);
    }
  );
}

function cancelScreenSharing(msg) {
  if (desktopMediaRequestId) {
    chrome.desktopCapture.cancelChooseDesktopMedia(desktopMediaRequestId);
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener(async () => {
  const tabs = await chrome.tabs.query({});
  
  for (const tab of tabs) {
    // Skip chrome:// pages
    if (tab.url.match(/(chrome):\/\//gi)) {
      continue;
    }

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-script.js']
      });
      console.log('Injected content script into tab:', tab);
    } catch (err) {
      // Ignore expected errors for restricted pages
      if (!err.message.match(/cannot access contents of url/i)) {
        console.error(err);
      }
    }
  }
});
