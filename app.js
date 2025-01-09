let extensionInstalled = false;

document.getElementById('start').addEventListener('click', () => {
  // send screen-sharer request to content-script
  if (!extensionInstalled) {
    alert(
      'Please install the extension:\n' +
        '1. Go to chrome://extensions\n' +
        '2. Check: "Enable Developer mode"\n' +
        '3. Click: "Load the unpacked extension..."\n' +
        '4. Choose "extension" folder from the repository\n' +
        '5. Reload this page'
    );
  }
  window.postMessage({ type: 'SS_UI_REQUEST', text: 'start' }, '*');
});

// listen for messages from the content-script
window.addEventListener('message', event => {
  const { data: { type, streamId }, origin } = event;

  // NOTE: you should discard foreign events
  if (origin !== window.location.origin) {
    console.warn(
      'ScreenStream: you should discard foreign event from origin:',
      origin
    );
    // return;
  }

  // content-script will send a 'SS_PING' msg if extension is installed
  if (type === 'SS_PING') {
    extensionInstalled = true;
  }

  // user chose a stream
  if (type === 'SS_DIALOG_SUCCESS') {
    startScreenStreamFrom(streamId);
  }

  // user clicked on 'cancel' in choose media dialog
  if (type === 'SS_DIALOG_CANCEL') {
    console.log('User cancelled!');
  }
});

function startScreenStreamFrom(streamId) {
  navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: streamId,
          maxWidth: window.screen.width,
          maxHeight: window.screen.height
        }
      }
    })
    .then(stream => {
      const videoElement = document.getElementById('video');
      videoElement.srcObject = stream;

      // Create canvas for capturing frames
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth || 1920;
      canvas.height = videoElement.videoHeight || 1080;
      const ctx = canvas.getContext('2d');

      // Connect to WebSocket server
      const ws = new WebSocket(`wss://${window.location.hostname}/broadcast?id=${streamId}`);

      // Show share link
      const shareLink = document.getElementById('shareLink');
      const shareLinkText = document.getElementById('shareLinkText');
      const viewerUrl = `https://${window.location.hostname}/viewer.html?id=${streamId}`;
      shareLinkText.textContent = viewerUrl;
      shareLink.style.display = 'block';

      // Function to capture and send frames
      function captureAndSendFrame() {
        if (ws.readyState === WebSocket.OPEN) {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              ws.send(blob);
            },
            'image/jpeg',
            0.7  // JPEG quality (0.7 = 70% quality)
          );
        }
      }

      // Start capturing frames
      const frameInterval = setInterval(captureAndSendFrame, 100); // 10 FPS

      // Clean up on page unload
      window.addEventListener('beforeunload', () => {
        clearInterval(frameInterval);
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      });
    })
    .catch(console.error);
}
