# Use the official Node.js image as the base
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including react-scripts
RUN npm install --include=dev

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 3000
EXPOSE 3000

# Serve the application using a lightweight server
CMD ["npm", "start"]


