# API


### Get header information
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

### [MPoW] Get block hash by block number
Request:
```shell
curl GET 'http://localhost:56666/api/v1/block/hash?blockNumber=100'
```

Response:
```json
"0xeeadb2bd71c125c98ce0892d830931fb27c771ab0025c60735fca9419abae990"
```

### [MPoW] Get system health
Request:
```shell
curl GET 'http://localhost:56666/api/v1/system/health
```

Response:
```json
{
    "peers": 19,
    "isSyncing": false,
    "shouldHavePeers": true
}
```

### [MPoW] Get sWorker code
Request:
```shell
curl GET 'http://localhost:56666/api/v1/swork/code
```

Response:
```json
"0x8801f22c6958a8096dbc959227a481e53e862f58b9dd3113e9cf3ff94413d265"
```

### [MPoW] Register as sWorker trusted node
Request:
```shell
curl POST 'http://localhost:56666/api/v1/swork/identity' \
--header 'Content-Type: application/json' \
--header 'password: 123456' \
--data-raw '{
    "ias_sig": "blQCK9boBazDWj5e5TeS7PxFs1RJqlKhvkgiQvZwDa2nhVfBlGUdpBEC4QFui45R7pEFMMJcNbKIB2en/BoaNXMum7n9hYDc6wRdgveupLAJvw4KQzeIMKiUM5WfT4oTo3OZopM9Q/FiCAyoiwJ9bLOYH/HFVSFujbwJEhlhGE+3p+7hw7nB8IMvJsijwt8Y/vJiflsqJMlQSGo2CeERW37iKsK5G/mtB96ZYSkwiJEv33d0xVBEk5X3sp2FOloM6lg8Dx+205rrjS3+C1U2pFq/qrxKge1hTxQciRrBulSesJ1b8vdcpi1SYAJ8401nL/vWEa3aNCZ3Z8CiL3lhiw==",
    "ias_cert": "-----BEGIN CERTIFICATE-----\nMIIEoTCCAwmgAwIBAgIJANEHdl0yo7CWMA0GCSqGSIb3DQEBCwUAMH4xCzAJBgNV\nBAYTAlVTMQswCQYDVQQIDAJDQTEUMBIGA1UEBwwLU2FudGEgQ2xhcmExGjAYBgNV\nBAoMEUludGVsIENvcnBvcmF0aW9uMTAwLgYDVQQDDCdJbnRlbCBTR1ggQXR0ZXN0\nYXRpb24gUmVwb3J0IFNpZ25pbmcgQ0EwHhcNMTYxMTIyMDkzNjU4WhcNMjYxMTIw\nMDkzNjU4WjB7MQswCQYDVQQGEwJVUzELMAkGA1UECAwCQ0ExFDASBgNVBAcMC1Nh\nbnRhIENsYXJhMRowGAYDVQQKDBFJbnRlbCBDb3Jwb3JhdGlvbjEtMCsGA1UEAwwk\nSW50ZWwgU0dYIEF0dGVzdGF0aW9uIFJlcG9ydCBTaWduaW5nMIIBIjANBgkqhkiG\n9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqXot4OZuphR8nudFrAFiaGxxkgma/Es/BA+t\nbeCTUR106AL1ENcWA4FX3K+E9BBL0/7X5rj5nIgX/R/1ubhkKWw9gfqPG3KeAtId\ncv/uTO1yXv50vqaPvE1CRChvzdS/ZEBqQ5oVvLTPZ3VEicQjlytKgN9cLnxbwtuv\nLUK7eyRPfJW/ksddOzP8VBBniolYnRCD2jrMRZ8nBM2ZWYwnXnwYeOAHV+W9tOhA\nImwRwKF/95yAsVwd21ryHMJBcGH70qLagZ7Ttyt++qO/6+KAXJuKwZqjRlEtSEz8\ngZQeFfVYgcwSfo96oSMAzVr7V0L6HSDLRnpb6xxmbPdqNol4tQIDAQABo4GkMIGh\nMB8GA1UdIwQYMBaAFHhDe3amfrzQr35CN+s1fDuHAVE8MA4GA1UdDwEB/wQEAwIG\nwDAMBgNVHRMBAf8EAjAAMGAGA1UdHwRZMFcwVaBToFGGT2h0dHA6Ly90cnVzdGVk\nc2VydmljZXMuaW50ZWwuY29tL2NvbnRlbnQvQ1JML1NHWC9BdHRlc3RhdGlvblJl\ncG9ydFNpZ25pbmdDQS5jcmwwDQYJKoZIhvcNAQELBQADggGBAGcIthtcK9IVRz4r\nRq+ZKE+7k50/OxUsmW8aavOzKb0iCx07YQ9rzi5nU73tME2yGRLzhSViFs/LpFa9\nlpQL6JL1aQwmDR74TxYGBAIi5f4I5TJoCCEqRHz91kpG6Uvyn2tLmnIdJbPE4vYv\nWLrtXXfFBSSPD4Afn7+3/XUggAlc7oCTizOfbbtOFlYA4g5KcYgS1J2ZAeMQqbUd\nZseZCcaZZZn65tdqee8UXZlDvx0+NdO0LR+5pFy+juM0wWbu59MvzcmTXbjsi7HY\n6zd53Yq5K244fwFHRQ8eOB0IWB+4PfM7FeAApZvlfqlKOlLcZL2uyVmzRkyR5yW7\n2uo9mehX44CiPJ2fse9Y6eQtcfEhMPkmHXI01sN+KwPbpA39+xOsStjhP9N1Y1a2\ntQAVo+yVgLgV2Hws73Fc0o3wC78qPEA+v2aRs/Be3ZFDgDyghc/1fgU+7C+P6kbq\nd4poyb6IW8KCJbxfMJvkordNOgOUUxndPHEi/tb/U7uLjLOgPA==\n-----END CERTIFICATE-----\n",
    "sig": "a5d773d0474f572f8dfc2b4c59cdcb095f17869ed0323d760fe6be124b1f91d03775c914a4f8d6de38d52790aef2c2a1d9e0593949eabc30b1b65b7c2d6cd18b",
    "account_id": "5FqazaU79hjpEMiWTWZx81VjsYFst15eBuSBKdQLgQibD7CX",
    "isv_body": "{\"id\":\"123961886185477148090777879985426742743\",\"timestamp\":\"2020-06-24T05:01:29.013171\",\"version\":3,\"epidPseudonym\":\"4tcrS6EX9pIyhLyxtgpQJuMO1VdAkRDtha/N+u/rRkTsb11AhkuTHsY6UXRPLRJavxG3nsByBdTfyDuBDQTEjMYV6NBXjn3P4UyvG1Ae2+I4lE1n+oiKgLA8CR8pc2nSnSY1Wz1Pw/2l9Q5Er6hM6FdeECgMIVTZzjScYSma6rE=\",\"isvEnclaveQuoteStatus\":\"GROUP_OUT_OF_DATE\",\"platformInfoBlob\":\"1502006504000F00000F0F02040101070000000000000000000B00000B00000002000000000000142A6BA71C112E9E7C24891D0BC3FAF303549F78DDDF8EB1952908F78CC55C985D785A9DD1E3ED99C9E42FCFA81D81EDEF9612E1E2BD6862DE240564DDD5F6EFD5DF\",\"isvEnclaveQuoteBody\":\"AgABACoUAAAKAAkAAAAAAP7yPH5zo3mCPOcf8onPvAcAAAAAAAAAAAAAAAAAAAAACA7///8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAHAAAAAAAAAOJWq0y16RNrwcERUIj8QMofQYJUXqdXaVeMINhDAozVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACD1xnnferKFHD2uvYqTXdDA8iZ22kCD5xw7h38CMfOngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADza6mYgLFtxw0txDzMl/3RdCApfFl+bev52H3xjSbjl/b4IPC63+P57HJpPU/DUsGBj75XknR9iyK4pRc1Y/Q/\"}",
	"backup": "{\"address\":\"5FqazaU79hjpEMiWTWZx81VjsYFst15eBuSBKdQLgQibD7CX\",\"encoded\":\"0x992da087a5adf2b7ad2d2d72a65aa1fe1a59f599d24badebc37a2ede36f1b6ec647ee18c0956a635ad7070d1fea2e3bf75dd99579d1b92cbca27f5763b56720200d6c5cb6d4084a25c288bd6d99f0f976caf7cd895ebc7fe7d5c9a6d27e7d9e80dcaba5cdda1e0acddd835621c70bc6075debcbe9a0f1b062bd124eee73c3b588bad251a459ef6287fcacf6e2131fa9f0a8403d900efa94672e07f6ae5\",\"encoding\":{\"content\":[\"pkcs8\",\"sr25519\"],\"type\":\"xsalsa20-poly1305\",\"version\":\"2\"},\"meta\":{\"name\":\"Yang1\",\"tags\":[],\"whenCreated\":1580628430860}}"
}'
```

Response:
```json
{
    "action": "identity",
    "status": "success",
}
```

### [MPoW] Get sWorker identity
Request:
```shell
curl GET 'http://localhost:56666/api/v1/swork/identity?address=5HBPJZkoLeUBdPombuYe3tcUkXcTAKyRhRgXJvHpCs9mzxfL'
```

Response:
```json

[
    {
        "pub_key": "0x8214706cf1551bb760a9d916a91828f593ad447d8119572e947ba1edc05ad3680054f89d53bf589e8632469c5e332e61dde90d79d50b9dfe6c7be76253738a99",
        "code": "0xc9bcd0e8022d2edff4f750cb7dc73b935de5938ccabedca31bb9c2e2c34bc2a2"
    }
]

```

### [MPoW] Post sWorker work report
Request:
```shell
curl POST 'http://localhost:56666/api/v1/swork/workreport' \
--header 'Content-Type: application/json' \
--header 'password: 123456' \
--data-raw '{
	"block_hash" : "1234567890",
	"files" : [],
	"block_height" : 12345,
	"pub_key" : "f36ba99880b16dc70d2dc43ccc97fdd17420297c597e6debf9d87df18d26e397f6f820f0badfe3f9ec72693d4fc352c1818fbe5792747d8b22b8a5173563f43f",
	"reserved" : 4294967296,
	"sig" : "60442bbcd0bd6c0a25af37be55d53a0749a62b28aa1d4c85f087da8ac256a38e1dbd51d0cde4b162c70a6c861fe5bd2594e3f6e1b0d1766420230dc76849e76b",
	"backup": "{\"address\":\"5FqazaU79hjpEMiWTWZx81VjsYFst15eBuSBKdQLgQibD7CX\",\"encoded\":\"0x992da087a5adf2b7ad2d2d72a65aa1fe1a59f599d24badebc37a2ede36f1b6ec647ee18c0956a635ad7070d1fea2e3bf75dd99579d1b92cbca27f5763b56720200d6c5cb6d4084a25c288bd6d99f0f976caf7cd895ebc7fe7d5c9a6d27e7d9e80dcaba5cdda1e0acddd835621c70bc6075debcbe9a0f1b062bd124eee73c3b588bad251a459ef6287fcacf6e2131fa9f0a8403d900efa94672e07f6ae5\",\"encoding\":{\"content\":[\"pkcs8\",\"sr25519\"],\"type\":\"xsalsa20-poly1305\",\"version\":\"2\"},\"meta\":{\"name\":\"Yang1\",\"tags\":[],\"whenCreated\":1580628430860}}"
}'
```

Response:
```json
{
    "action": "reportWorks",
    "status": "success",
}
```

### [MPoW] Get sWorker work report
Request:
```shell
curl GET 'http://localhost:56666/api/v1/swork/workreport?address=5HBPJZkoLeUBdPombuYe3tcUkXcTAKyRhRgXJvHpCs9mzxfL'
```

Response:
```json 

[
    {
        "report_slot": 17700,
        "used": 0,
        "free": 4294967296,
        "files": [],
        "reported_files_size": 0,
        "reported_srd_root": "0xd8ab55655b24e2822b7b410b87c1dd8f70c752f2d3e887a703d59c591c4a33db",
        "reported_files_root": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "pub_key": "0x8214706cf1551bb760a9d916a91828f593ad447d8119572e947ba1edc05ad3680054f89d53bf589e8632469c5e332e61dde90d79d50b9dfe6c7be76253738a99"
    }
]

```

### [Market] Register as merchant
Request:
```shell
curl POST 'http://localhost:56666/api/v1/market/register' \
--header 'Content-Type: application/json' \
--header 'password: 123456' \
--data-raw '{
	"addressInfo": "ws://localhost:8080",
	"storagePrice": 100,
	"backup": "{\"address\":\"5FqazaU79hjpEMiWTWZx81VjsYFst15eBuSBKdQLgQibD7CX\",\"encoded\":\"0x992da087a5adf2b7ad2d2d72a65aa1fe1a59f599d24badebc37a2ede36f1b6ec647ee18c0956a635ad7070d1fea2e3bf75dd99579d1b92cbca27f5763b56720200d6c5cb6d4084a25c288bd6d99f0f976caf7cd895ebc7fe7d5c9a6d27e7d9e80dcaba5cdda1e0acddd835621c70bc6075debcbe9a0f1b062bd124eee73c3b588bad251a459ef6287fcacf6e2131fa9f0a8403d900efa94672e07f6ae5\",\"encoding\":{\"content\":[\"pkcs8\",\"sr25519\"],\"type\":\"xsalsa20-poly1305\",\"version\":\"2\"},\"meta\":{\"name\":\"Yang1\",\"tags\":[],\"whenCreated\":1580628430860}}"
}'
```

Response:
```json
{
    "action": "merchant_register",
    "status": "success",
}
```

### [Market] Place storage order
Request:
```shell
curl POST 'http://localhost:56666/api/v1/market/sorder' \
    --header 'Content-Type: application/json' \
    --header 'password: 123456' \
    --data-raw '{
        "sorder":"{\"merchant\":\"5HpyALyFUJTDMc6iRziEKwh1BkvMHFJGHss3mJjXefuzCap3\",\"fileIdentifier\":\"0xd9bf1512e28399ae0cccdebacf5fa337b1e1f4a6b08cd43405a11f74368d023f\",\"fileSize\":205452,\"duration\":320}",
        "backup": "{\"address\":\"5FjAZtpXuqNGGw4yoDo3z8ko3Edft4Q25awTr5EakW3bYarE\",\"encoded\":\"0xfbcdb94f892959b1b253145f0893bd2b1d315ced24b497b98b4eb10513a5f3ef46bafec71a538c3f25703843856c9449c02e9bc6bf33bfa7e4ce2716f225d69067888655d60a30b9da618ce4725cb1737bc9980651950edfb5da86ee82ffa5b10dbe0d26d226b15e3bb990424c543210a93bd457be856799872a5f8ef52822980bd266e2b1aea53802f4248e4213498aaf1945033cb8217250b69d00d6\",\"encoding\":{\"content\":[\"pkcs8\",\"sr25519\"],\"type\":\"xsalsa20-poly1305\",\"version\":\"2\"},\"meta\":{\"name\":\"Yang\",\"tags\":[],\"whenCreated\":1580452568110}}"
    }'
```

Response:
```json
{
    "action": "storage_order",
    "status": "success",
    "order_id": "0x3be23b7d519e8600ea37964501bdc64e00888a15498fd96cff3d2c0e763bb39c"
}
```

### [Market] Get merchant info
Request:
```shell
curl GET 'http://127.0.0.1:56666/api/v1/market/merchant?address=5HpyALyFUJTDMc6iRziEKwh1BkvMHFJGHss3mJjXefuzCap3'
```

Response:
```json

{
    "address": "ws://192.168.50.140:17005",
    "storage_price": 200000000000,
    "file_map": [
        [
            "0xa2f7830de04841b1c7672b96f4ba9ea9edaf4c3b76257e9373e960829b056697",
            [
                "0x075ab6f9577e86d2b10d1d82923b2a859a1748c9d29c9fe17888d2fa49192061"
            ]
        ],
        [
            "0xfd0483bd91062400854ca14b894d26051de27b0855e87527abcaad065bc53879",
            [
                "0x351209cffe9aa06ee9f3829bba843fb47c47ab2a8692cd06b839ca2005073858"
            ]
        ]
    ]
}

```

### [Market] Get storage order
Request:
```shell
curl GET 'http://localhost:56666/api/v1/market/sorder?orderId=0x1f1e8eeac7b871ac3c603087120eb0b8a7286ee69ff01c785e52af083edaf2f5'
```

Response:
```json
   
{
    "file_identifier": "0xfd0483bd91062400854ca14b894d26051de27b0855e87527abcaad065bc53879",
    "file_size": 1000001,
    "created_on": 2022,
    "completed_on": 2022,
    "expired_on": 3022,
    "merchant": "5FbxxwasgLPHJ3cEMcqJuohgrJ72E9dBwgw1Yw3VXbvEwK9u",
    "client": "5DSgSSAXG8Ti2Qwsr8zcLrAsQsEEji6pEv2rUWmLXQicAiK4",
    "amount": 20000000000000,
    "order_status": "Pending"
}

```
