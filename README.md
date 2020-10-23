# Crust API

> Crust API is a bridge connector bewteen chain and other offchain services, you'd better not run it seperately.

Based on [express](https://github.com/expressjs/express/) and [polkadot-js/api](https://github.com/polkadot-js/api), connecting a running Crust Node and hosting a RESTful api service.

## Join to play

Go to [Crust Node](https://github.com/crustio/crust-node), follow the README.

## Building

### Build from source

> Make sure you have *latest* nodejs and yarn installed.

#### 1. Install with yarn

```shell
yarn
```

#### 2. Debug with nodemon

- API_PORT: port number, default is: `56666`
- CRUST_WS_ADDRESS: crust's websocket address, default is: `ws://localhost:9944`

```shell
yarn debug {API_PORT} {CRUST_WS_ADDRESS}
```

#### 3. Build and start with original node

```shell
yarn build && yarn start {API_PORT} {CRUST_WS_ADDRESS}
```

### Build from docker

Refer [this](docs/docker.md) to see how to build and run crust api with docker.

## Usage

Refer to [this](docs/api.md) for more api details.

## License

[GPL v3](LICENSE)
