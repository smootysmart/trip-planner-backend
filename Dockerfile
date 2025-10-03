# Use official Node.js LTS image as base
FROM node:20-alpine

RUN apk update && apk upgrade --no-cache

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose port (change if your app uses a different port)
EXPOSE 5001

# Start the backend app
CMD ["npm", "start"]
