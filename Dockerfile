FROM node:current-alpine3.10

# Create crust-api directory
WORKDIR /usr/src/crust-api

# Move source files to docker image
COPY . .

# Install dependencies
RUN yarn && yarn build

# Run
ENTRYPOINT yarn start $ARGS
