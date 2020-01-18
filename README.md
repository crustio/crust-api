# Crust Restful API

## Start
### build
```shell
yarn
```
### start
The default startup will start with 56666 API port and connect to the local Crust chain:
```shell
yarn start
```
Change the setting like this:
```shell
CRUST_API_PORT=12345 CRUST_CHAIN_ENDPOINT=ws://192.168.50.6:9944/ yarn start
```

## Usage

### Get header infomation
Request:
```shell
curl GET 'http://localhost:56666/api/v1/block/header'
```

Response:
```json
{
    "number": 13871,
    "hash": "0xeeadb2bd71c125c98ce0892d830931fb27c771ab0025c60735fca9419abae990"
}
```

### Post tee identity
Request:
```shell
curl POST 'http://localhost:56666/api/v1/tee/identity' \
--header 'Content-Type: application/json' \
--header 'password: 123456' \
--data-raw '{
	"identity": "kkkddk",
	"backup": "{\"address\":\"5HBPJZkoLeUBdPombuYe3tcUkXcTAKyRhRgXJvHpCs9mzxfL\",\"encoded\":\"0x029f8602a7b6cec4917ddcb8b62a8922f8657c0b38d51ae26cff24dc2005dd2aa6f6e9be745058d3730be7cbb15e837e132bf228acc1e778fe81c9a0783adc5aa79063e30a2fa1e484ac5d34670585e7a4380e7a5f860e45f1d84bc65842e86cec949ac3a73ba4466d55a60be4f4cbd370630e469f1cb1529c2c1fe982048c727c9180f2124a404669364b7b3ab15eaf539d15fae5c776cfe1ce3fa2eb\",\"encoding\":{\"content\":[\"pkcs8\",\"sr25519\"],\"type\":\"xsalsa20-poly1305\",\"version\":\"2\"},\"meta\":{\"name\":\"Yang1\",\"tags\":[],\"whenCreated\":1579333837696}}"
}'
```

Response:
```json
{
    "message": "Try to save tee identity to crust chain."
}
```

### Get tee identity
Request:
```shell
curl GET 'http://localhost:56666/api/v1/tee/identity?address=5HBPJZkoLeUBdPombuYe3tcUkXcTAKyRhRgXJvHpCs9mzxfL'
```

Response:
```json
{
    "identity": "kkkddk"
}
```

### Post tee workreport
Request:
```shell
curl POST 'http://localhost:56666/api/v1/tee/workreport' \
--header 'Content-Type: application/json' \
--header 'password: 123456' \
--data-raw '{
	"workreport": "1234",
	"backup": "{\"address\":\"5HBPJZkoLeUBdPombuYe3tcUkXcTAKyRhRgXJvHpCs9mzxfL\",\"encoded\":\"0x029f8602a7b6cec4917ddcb8b62a8922f8657c0b38d51ae26cff24dc2005dd2aa6f6e9be745058d3730be7cbb15e837e132bf228acc1e778fe81c9a0783adc5aa79063e30a2fa1e484ac5d34670585e7a4380e7a5f860e45f1d84bc65842e86cec949ac3a73ba4466d55a60be4f4cbd370630e469f1cb1529c2c1fe982048c727c9180f2124a404669364b7b3ab15eaf539d15fae5c776cfe1ce3fa2eb\",\"encoding\":{\"content\":[\"pkcs8\",\"sr25519\"],\"type\":\"xsalsa20-poly1305\",\"version\":\"2\"},\"meta\":{\"name\":\"Yang1\",\"tags\":[],\"whenCreated\":1579333837696}}"
}'
```

Response:
```json
{
    "message": "Try to save tee workreport to crust chain."
}
```

### Get tee workreport
Request:
```shell
curl GET 'http://localhost:56666/api/v1/tee/workreport?address=5HBPJZkoLeUBdPombuYe3tcUkXcTAKyRhRgXJvHpCs9mzxfL'
```

Response:
```json
{
    "workreport": "1234"
}
```
