# Use the official Node.js image as the base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React application
RUN npm run build

# Serve the application using a lightweight server
CMD ["npx", "serve", "-s", "build", "-l", "3000"]

# Expose port 3000
EXPOSE 3000

