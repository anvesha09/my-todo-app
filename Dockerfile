# =========================================================================
# Stage 1: Build the React application
# =========================================================================
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the 'my-todo-app' subdirectory
COPY my-todo-app/package*.json ./

# Install all project dependencies
RUN npm install

# Copy the rest of your application's source code from the 'my-todo-app' subdirectory
COPY my-todo-app/. .

# Build the application for production
RUN npm run build


# =========================================================================
# Stage 2: Serve the application
# =========================================================================
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the built static files from the 'builder' stage's 'dist' folder
COPY --from=builder /app/dist ./dist

# Copy the installed dependencies from the 'builder' stage
COPY --from=builder /app/node_modules ./node_modules

# Copy package.json, which contains the 'preview' script
COPY --from=builder /app/package.json ./package.json

# Expose the port that the Vite preview server runs on
EXPOSE 4173

# The command to start the Vite preview server
CMD [ "npm", "run", "preview", "--", "--host" ]
