# Use a lightweight Node.js image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy the backend source code
COPY src ./src

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3444
ENV HOST=0.0.0.0
ENV HTTPS_ENABLED=false

# Expose the backend API port
EXPOSE 3444

# Start the backend application
CMD ["npm", "start"]