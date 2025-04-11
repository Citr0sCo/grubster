# Step 1: Use Node.js 22 as the build stage
FROM node:22 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps
RUN npm install -g @angular/cli@19.2.5

# Copy the rest of the application code
COPY . .

# Build the Angular app for production
RUN npm run build

# Step 2: Use Nginx to serve the Angular app
FROM nginx:alpine

# Copy the built Angular app to the Nginx HTML directory
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/app/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
