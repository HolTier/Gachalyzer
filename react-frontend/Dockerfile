# Use the official Node.js image as the base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application files
COPY . .

# Install dependencies
RUN npm install

# Build the React application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Serve the application using a lightweight server
CMD ["npx", "serve", "-s", "build", "-l", "3000"]



