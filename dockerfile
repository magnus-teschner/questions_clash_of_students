# Use the official Node.js 14 LTS (or any version you prefer) as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) into the container
COPY package*.json ./

# Install any dependencies
RUN npm install

# Bundle your app's source code inside the Docker image
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run your app (this can be "npm start" if you have defined a start script in package.json)
CMD [ "node", "server.js" ]
