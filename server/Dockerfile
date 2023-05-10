# Use the official Node.js 18 Alpine image as the base image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port that the server will listen on
EXPOSE 4000

# Start the server when the container is run
CMD [ "npm", "start" ]

