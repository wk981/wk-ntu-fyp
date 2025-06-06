# Stage 1: Build React App
FROM node:latest as build
WORKDIR /app

# Copy dependency files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all application files
COPY . .

# Build the React app with VITE_BACKEND_URL
RUN npm run build

# Stage 2: Transfer static files to a container and build nginx 
# Use Nginx as the production server
FROM nginx:stable-alpine

# Copy the built app to Nginx's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port that Nginx will serve on
EXPOSE 7000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
