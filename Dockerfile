FROM ubuntu:18.04

# Install any needed packages
RUN apt-get update && apt-get install -y curl git gnupg libusb-1.0-0-dev

# install nodejs
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
RUN npm install yarn -g

# Create crust-api directory
WORKDIR /usr/src/crust-api

# Move source files to docker image
COPY . .

# Install dependencies
RUN yarn

# Run
ENTRYPOINT yarn start $ARGS
