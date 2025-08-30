# Stage 1: Create the application image
# Use an official Node.js image. Alpine images are lightweight.
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Expose the port your application runs on (e.g., 8000)
EXPOSE 8000

# The command to start your application
CMD ["node", "index.js"]
