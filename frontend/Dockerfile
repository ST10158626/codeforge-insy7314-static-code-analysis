# Stage 1: Build the React application
FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the frontend source code
COPY . .

# Configure the API URL for Docker
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build the React application
RUN npm run build


# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the production build into Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the frontend port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]