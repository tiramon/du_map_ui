# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:16 as build

# Set the working directory
WORKDIR /usr/local/app

# Install the application's dependencies into the node_modules's cache directory.
ARG NPM_TOKEN
COPY .npmrc ./
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# Add the source code to app
COPY ./ /usr/local/app/

# Generate the build of the application
RUN npm run build-prod


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/out /usr/share/nginx/html

COPY ./config/default.conf /etc/nginx/conf.d

# Expose port 80
EXPOSE 80