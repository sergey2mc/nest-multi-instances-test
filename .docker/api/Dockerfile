# Create image based off of the official Node 14 image
FROM node:19-alpine

# Create a directory where our app will be placed
RUN mkdir -p /api

# Change directory so that our commands run inside this new dir
WORKDIR /api

# Get all the code needed to run the app
COPY . /api

# Install dependecies
RUN yarn

# Build code
RUN ["yarn", "build"]
