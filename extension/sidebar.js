let extensionInstalled = true; // We're already in the extension

document.getElementById('start').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'SS_UI_REQUEST', text: 'start' });
});

// Add copy button event listener
document.getElementById('copyButton').addEventListener('click', () => {
  const shareLinkText = document.getElementById('shareLinkText').textContent;
  navigator.clipboard.writeText(shareLinkText).then(() => {
    alert('Share link copied to clipboard!');
  });
});

// listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SS_DIALOG_SUCCESS') {
    startScreenStreamFrom(message.streamId);
  }

  if (message.type === 'SS_DIALOG_CANCEL') {
    console.log('User cancelled!');
  }
});

function startScreenStreamFrom(streamId) {
  // Try screen capture using getUserMedia with simpler constraints
  navigator.mediaDevices.getUserMedia({
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: streamId
      }
    }
  })
  .then(stream => {
    handleStream(stream, streamId);
  })
  .catch(error => {
    console.log('Screen capture failed, falling back to tab capture:', error);
    // Fallback to tab capture with simpler constraints
    const constraints = {
      video: true,  // Simple boolean instead of object
      audio: false
    };

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tab = tabs[0];
      chrome.tabCapture.capture(constraints, function(stream) {
        if (chrome.runtime.lastError) {
          console.error('Tab capture error:', chrome.runtime.lastError);
          return;
        }
        handleStream(stream, streamId);
      });
    });
  });
}

function handleStream(stream, streamId) {
  const videoElement = document.getElementById('video');
  videoElement.srcObject = stream;

  // Create canvas for capturing frames
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth || 1920;
  canvas.height = videoElement.videoHeight || 1080;
  const ctx = canvas.getContext('2d');

  // Connect to WebSocket server
  const serverUrl = 'localhost';
  const serverPort = '443';
  const ws = new WebSocket(`wss://${serverUrl}:${serverPort}/broadcast?id=${streamId}`);

  // WebSocket error handling
  ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };

  ws.onopen = () => {
    console.log('WebSocket Connected');
    // Show share link only after successful connection
    const shareLink = document.getElementById('shareLink');
    const shareLinkText = document.getElementById('shareLinkText');
    const viewerUrl = `http://${serverUrl}:${serverPort}/viewer.html?id=${streamId}`;
    shareLinkText.textContent = viewerUrl;
    shareLink.style.display = 'block';
  };

  ws.onclose = () => {
    console.log('WebSocket Connection Closed');
    document.getElementById('shareLink').style.display = 'none';
  };

  // Function to capture and send frames
  function captureAndSendFrame() {
    if (ws.readyState === WebSocket.OPEN && videoElement.videoWidth > 0) {
      // Update canvas dimensions to match video
      if (canvas.width !== videoElement.videoWidth) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
      }

      try {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(blob);
            }
          },
          'image/jpeg',
          0.7
        );
      } catch (error) {
        console.error('Error capturing frame:', error);
      }
    }
  }

  // Start capturing frames once video is playing
  videoElement.onplaying = () => {
    console.log('Video started playing, beginning capture');
    const frameInterval = setInterval(captureAndSendFrame, 100);

    // Clean up on stream end
    stream.getVideoTracks()[0].onended = () => {
      clearInterval(frameInterval);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      document.getElementById('shareLink').style.display = 'none';
    };

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      clearInterval(frameInterval);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      stream.getTracks().forEach(track => track.stop());
    });
  };
} 