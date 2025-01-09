# Chrome Screen Sharing Extension

A Chrome extension that enables screen sharing capabilities through a WebSocket proxy server.

## Prerequisites

- Google Chrome browser
- Node.js installed on your system

## Installation & Setup

### 1. Install the Chrome Extension

1. Open Google Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top-right corner
3. Click "Load unpacked extension"
4. Select the `extension` folder from this repository
5. The extension icon should appear in your Chrome toolbar

### 2. Start the WebSocket Proxy Server

1. Open a terminal in the project directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the WebSocket proxy server:
   ```bash
   node ws-proxy-server.js
   ```
   The server should start running on port 8080 (default)

### 3. Using the Extension

1. Click the extension icon in your Chrome toolbar
2. Click the "Share Screen" button in the popup
3. Select the screen/window/tab you want to share
4. The screen sharing session will begin

### 4. Viewing the Stream

1. Open `viewer.html` in your browser to see the shared screen
2. The stream should automatically connect through the WebSocket proxy server

## Troubleshooting

- If the extension icon doesn't appear, try refreshing the extensions page
- Make sure the WebSocket server is running before attempting to share your screen
- Check Chrome console for any error messages
- Ensure you have granted necessary screen sharing permissions when prompted

## Technical Details

- The extension uses Chrome's `desktopCapture` API
- WebSocket Secure proxy server runs on port 443 by default
- Screen sharing data is transmitted through WebSocket connection

## Notes

- This extension is for development purposes only
- Make sure to keep the WebSocket server running during the entire screen sharing session
- The extension requires appropriate permissions to access screen content

## License

[MIT](LICENSE)
