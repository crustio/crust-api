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
	"identity": "{\"account_id\":\"5HBPJZkoLeUBdPombuYe3tcUkXcTAKyRhRgXJvHpCs9mzxfL\",\"pub_key\":\"b724362f5dba057704f89b769328cd71b08aa2284a5e1cc9d7131f909030eaeac30dde94229a23229015a13feb609a5adead8cb7e1c971c25a08e38e7a6a7909\",\"sig\":\"cb5496db194910fe797f4e0e74510188e493504747509058b10b393132839590564763e60eea1b470952ec99f48a6952216c2ce608b9b1718d4f98e300964bba\",\"validator_account_id\":\"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY\",\"validator_pub_key\":\"b724362f5dba057704f89b769328cd71b08aa2284a5e1cc9d7131f909030eaeac30dde94229a23229015a13feb609a5adead8cb7e1c971c25a08e38e7a6a7909\"}",
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
    "pub_key": "0xb724362f5dba057704f89b769328cd71b08aa2284a5e1cc9d7131f909030eaeac30dde94229a23229015a13feb609a5adead8cb7e1c971c25a08e38e7a6a7909",
    "account_id": "5FjAZtpXuqNGGw4yoDo3z8ko3Edft4Q25awTr5EakW3bYarE",
    "validator_pub_key": "0xb724362f5dba057704f89b769328cd71b08aa2284a5e1cc9d7131f909030eaeac30dde94229a23229015a13feb609a5adead8cb7e1c971c25a08e38e7a6a7909",
    "validator_account_id": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    "sig": "0xcb5496db194910fe797f4e0e74510188e493504747509058b10b393132839590564763e60eea1b470952ec99f48a6952216c2ce608b9b1718d4f98e300964bba"
}
```

### Post tee workreport
Request:
```shell
curl POST 'http://localhost:56666/api/v1/tee/workreport' \
--header 'Content-Type: application/json' \
--header 'password: 123456' \
--data-raw '{
	"workreport": "{\"pub_key\":\"b724362f5dba057704f89b769328cd71b08aa2284a5e1cc9d7131f909030eaeac30dde94229a23229015a13feb609a5adead8cb7e1c971c25a08e38e7a6a7909\",\"block_height\":50,\"block_hash\":\"a49e3d5044780c8a9c9d2427f210c918f73ea0a8af40e39f69d6cb64e44c2d99\",\"empty_root\":\"a49e3d5044780c8a9c9d2427f210c918f73ea0a8af40e39f69d6cb64e44c2d99\",\"empty_workload\":500,\"meaningful_workload\":500,\"sig\":\"cb5496db194910fe797f4e0e74510188e493504747509058b10b393132839590564763e60eea1b470952ec99f48a6952216c2ce608b9b1718d4f98e300964bba\"}",
	"backup": "{\"address\":\"5FjAZtpXuqNGGw4yoDo3z8ko3Edft4Q25awTr5EakW3bYarE\",\"encoded\":\"0xfbcdb94f892959b1b253145f0893bd2b1d315ced24b497b98b4eb10513a5f3ef46bafec71a538c3f25703843856c9449c02e9bc6bf33bfa7e4ce2716f225d69067888655d60a30b9da618ce4725cb1737bc9980651950edfb5da86ee82ffa5b10dbe0d26d226b15e3bb990424c543210a93bd457be856799872a5f8ef52822980bd266e2b1aea53802f4248e4213498aaf1945033cb8217250b69d00d6\",\"encoding\":{\"content\":[\"pkcs8\",\"sr25519\"],\"type\":\"xsalsa20-poly1305\",\"version\":\"2\"},\"meta\":{\"name\":\"Yang\",\"tags\":[],\"whenCreated\":1580452568110}}"
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
    "pub_key": "0xb724362f5dba057704f89b769328cd71b08aa2284a5e1cc9d7131f909030eaeac30dde94229a23229015a13feb609a5adead8cb7e1c971c25a08e38e7a6a7909",
    "block_height": 50,
    "block_hash": "0xa49e3d5044780c8a9c9d2427f210c918f73ea0a8af40e39f69d6cb64e44c2d99",
    "empty_root": "0xa49e3d5044780c8a9c9d2427f210c918f73ea0a8af40e39f69d6cb64e44c2d99",
    "empty_workload": 500,
    "meaningful_workload": 500,
    "sig": "0xcb5496db194910fe797f4e0e74510188e493504747509058b10b393132839590564763e60eea1b470952ec99f48a6952216c2ce608b9b1718d4f98e300964bba"
}
```
