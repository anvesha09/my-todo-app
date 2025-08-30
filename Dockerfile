# =========================================================================
# Stage 1: Build the React application
# This stage installs dependencies and builds your static files.
# =========================================================================
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker's caching
COPY package*.json ./

# Install all project dependencies (including Vite for building)
RUN npm install

# Copy the rest of your application's source code into the container
COPY . .

# Build the application for production
# This command creates a 'dist' folder with the optimized static files
RUN npm run build


# =========================================================================
# Stage 2: Serve the application
# This stage takes the built files and serves them using Vite's preview server.
# It results in a much smaller and more secure final image.
# =========================================================================
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the built static files from the 'builder' stage
COPY --from=builder /app/dist ./dist

# Copy the installed dependencies from the 'builder' stage
COPY --from=builder /app/node_modules ./node_modules

# Copy package.json, which contains the 'preview' script
COPY --from=builder /app/package.json ./package.json

# Expose the port that the Vite preview server runs on by default
EXPOSE 4173

# The command to start the Vite preview server.
# The '--host' flag is crucial to make the server accessible from outside the container.
CMD [ "npm", "run", "preview", "--", "--host" ]
