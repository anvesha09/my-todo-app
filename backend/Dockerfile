# Stage 1: Build the React front-end
# We use a version of Node.js as a base
FROM node:18 AS build

# Set the working directory for the client-side code
WORKDIR /app/client

# Copy the package.json and package-lock.json to install dependencies
COPY client/package*.json ./

# Install the dependencies for the React app
RUN npm install

# Copy the rest of the client-side code
COPY client/ ./

# Build the React app for production
RUN npm run build


# Stage 2: Build the Node.js back-end
# We use another Node.js image for the final server
FROM node:18

# Set the working directory for the backend code
WORKDIR /app/backend

# Copy the package.json and package-lock.json for the backend
COPY backend/package*.json ./

# Install the backend dependencies
RUN npm install

# Copy the rest of the backend code
COPY backend/ ./

# Now, we copy the built React app from the first stage.
# Your backend code is set up to look for the 'build' folder in a sibling 'client' directory.
# So we need to place it correctly.
COPY --from=build /app/client/build ../client/build

# Tell Docker that the app will run on port 8000
EXPOSE 8000

# The command to start the server when the container runs
CMD [ "npm", "start" ]
