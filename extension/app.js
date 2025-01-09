// Add these variables at the top of the file to track stream and WebSocket
let activeStream = null;
let activeWebSocket = null;
let frameInterval = null;
let defaultServerUrl = 'localhost';
let defaultServerPort = '443';

document.getElementById('start').addEventListener('click', () => {
  console.log('start');
  // Direct communication with background script
  chrome.runtime.sendMessage({ type: 'SS_UI_REQUEST', text: 'start' });
});

// Add stop button event listener
document.getElementById('stop').addEventListener('click', () => {
  stopSharing();
});

// Add this new function to handle stopping the stream
function stopSharing() {
  if (activeStream) {
    // Stop all tracks in the stream
    activeStream.getTracks().forEach(track => track.stop());
    activeStream = null;
  }
  
  if (activeWebSocket && activeWebSocket.readyState === WebSocket.OPEN) {
    activeWebSocket.close();
  }
  
  if (frameInterval) {
    clearInterval(frameInterval);
    frameInterval = null;
  }
  
  // Reset video element
  const videoElement = document.getElementById('video');
  videoElement.srcObject = null;
  
  // Hide share link and stop button, show start button
  document.getElementById('shareLink').style.display = 'none';
  document.getElementById('stop').style.display = 'none';
  document.getElementById('start').style.display = 'inline';
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message) => {
  console.log('message', message);
  const { type, streamId } = message;

  if (type === 'SS_DIALOG_SUCCESS') {
    startScreenStreamFrom(streamId);
  }

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
      handleStream(stream, streamId);
    })
    .catch(console.error);
}

// handle stream frame capture and send to ws proxy server
function handleStream(stream, streamId) {
    activeStream = stream;
    const videoElement = document.getElementById('video');
    videoElement.srcObject = stream;
  
    // Show stop button and hide start button
    document.getElementById('stop').style.display = 'inline';
    document.getElementById('start').style.display = 'none';
  
    // Create canvas for capturing frames
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth || 1920;
    canvas.height = videoElement.videoHeight || 1080;
    const ctx = canvas.getContext('2d');
    
    // Connect to WebSocket server
    const serverUrl = document.getElementById('serverUrl').value || "localhost";
    const serverPort = document.getElementById('serverPort').value || "443";
    const ws = new WebSocket(`wss://${serverUrl}:${serverPort}/broadcast?id=${streamId}`);
    activeWebSocket = ws;
  
    // WebSocket error handling
    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  
    ws.onopen = () => {
      console.log('WebSocket Connected');
      const shareLink = document.getElementById('shareLink');
      const shareLinkText = document.getElementById('shareLinkText');
      const viewerUrl = `https://${serverUrl}:${serverPort}/viewer.html?id=${streamId}`;
      shareLinkText.textContent = viewerUrl;
      shareLink.style.display = 'block';
      shareLinkText.addEventListener('click', () => {
        navigator.clipboard.writeText(viewerUrl).then(() => {
          alert('Share link copied to clipboard!');
        });
      });
    };
  
    ws.onclose = () => {
      console.log('WebSocket Connection Closed');
      document.getElementById('shareLink').style.display = 'none';
      // Also stop sharing when WebSocket is closed
      stopSharing();
    };
  
    // Function to capture and send frames
    function captureAndSendFrame() {
      if (ws.readyState === WebSocket.OPEN && videoElement.videoWidth > 0) {
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
            0.9
          );
        } catch (error) {
          console.error('Error capturing frame:', error);
        }
      }
    }
  
    // Start capturing frames once video is playing
    videoElement.onplaying = () => {
      console.log('Video started playing, beginning capture');
      frameInterval = setInterval(captureAndSendFrame, 100);
  
      // Clean up on stream end
      stream.getVideoTracks()[0].onended = () => {
        stopSharing();
      };
  
      // Clean up on page unload
      window.addEventListener('beforeunload', () => {
        stopSharing();
      });
    };
}