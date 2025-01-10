# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose default port
EXPOSE 8080

# Start the server
CMD node ws-proxy-server.js --port ${PORT:-8080} 