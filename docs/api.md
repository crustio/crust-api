# API

## Queries

### Chain info

#### Get header info

Request:

```shell
curl 'http://localhost:56666/api/v1/block/header'
```

Response:

```json
{
    "number": 13871,
    "hash": "0xeeadb2bd71c125c98ce0892d830931fb27c771ab0025c60735fca9419abae990"
}
```

#### Get system health

Request:

```shell
curl 'http://localhost:56666/api/v1/system/health'
```

Response:

```json
{
    "peers": 19,
    "isSyncing": false,
    "shouldHavePeers": true
}
```

#### Get block hash with block number

Request:

```shell
curl 'http://localhost:56666/api/v1/block/hash?blockNumber=148589'
```

Response:

```json
"0xd006c6597bed500f99c5e0b943f597a0ede4d0ecb96b671a029221267c169a40"
```

### sWorker info

#### Get sWorker code

Request:

```shell
curl 'http://localhost:56666/api/v1/swork/code'
```

Response:

```json
[
    {
        "code": "0x2f93fa4804b48f40e3c1514f517d7ffb52bf30ce360479838f64f8551d79a5bc",
        "expired_on": 2680000
    }
]
```

#### Get sWorker identity

Request:

```shell
curl 'http://localhost:56666/api/v1/swork/identity?address=5HBPJZkoLeUBdPombuYe3tcUkXcTAKyRhRgXJvHpCs9mzxfL'
```

Response:

```json
{
    "anchor": "0x6956c19f8914bbe14c7fb8dd4fc776cd3382e94be25679b2b6bf4fb075eb27ebc1cadc76dff0c76fe72acd4e83af80f18f1a893e7d179e8d7630085c0aa9223e",
    "group": null
}
```

#### Get sWorker work report

Request:

```shell
curl 'http://localhost:56666/api/v1/swork/workreport?address=5FqazaU79hjpEMiWTWZx81VjsYFst15eBuSBKdQLgQibD7CX'
```

Response:

```json
{
    "report_slot": 16200,
    "used": 0,
    "free": 4294967296,
    "reported_files_size": 5242835,
    "reported_srd_root": "0x1ba223d1494bc0e14777a7e63c24484ecbe14ae2004cad45e5f690829c840fd1",
    "reported_files_root": "0xf7d385d8397d6fbb413a0a1bdaeabab43cf1af131efff42b3c538deec7aedf36"
}
```

### DSM info

#### Get file info

Request:

```shell
curl 'http://127.0.0.1:56666/api/v1/market/file?cid=QmdWMVDGejQLSUuGg5KQZuDib55RNtbEea44hRVqrTpTNS'
```

Response:

```json
{
    "file_size": 8000000000000,
    "expired_on": 659,
    "claimed_at": 659,
    "amount": 1525879100000000,
    "expected_replica_count": 2,
    "reported_replica_count": 0,
    "replicas": []
}
```

## Send Extrinsics

### sWorker extrinsics

#### Register as sWorker

Request:

```shell
curl --request POST 'http://localhost:56666/api/v1/swork/identity' \
--header 'Content-Type: application/json' \
--header 'password: 123456' \
--data-raw '{
  "account_id" : "5FqazaU79hjpEMiWTWZx81VjsYFst15eBuSBKdQLgQibD7CX",
  "ias_cert" : "MIIEoTCCAwmgAwIBAgIJANEHdl0yo7CWMA0GCSqGSIb3DQEBCwUAMH4xCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJDQTEUMBIGA1UEBwwLU2FudGEgQ2xhcmExGjAYBgNVBAoMEUludGVsIENvcnBvcmF0aW9uMTAwLgYDVQQDDCdJbnRlbCBTR1ggQXR0ZXN0YXRpb24gUmVwb3J0IFNpZ25pbmcgQ0EwHhcNMTYxMTIyMDkzNjU4WhcNMjYxMTIwMDkzNjU4WjB7MQswCQYDVQQGEwJVUzELMAkGA1UECAwCQ0ExFDASBgNVBAcMC1NhbnRhIENsYXJhMRowGAYDVQQKDBFJbnRlbCBDb3Jwb3JhdGlvbjEtMCsGA1UEAwwkSW50ZWwgU0dYIEF0dGVzdGF0aW9uIFJlcG9ydCBTaWduaW5nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqXot4OZuphR8nudFrAFiaGxxkgma/Es/BA+tbeCTUR106AL1ENcWA4FX3K+E9BBL0/7X5rj5nIgX/R/1ubhkKWw9gfqPG3KeAtIdcv/uTO1yXv50vqaPvE1CRChvzdS/ZEBqQ5oVvLTPZ3VEicQjlytKgN9cLnxbwtuvLUK7eyRPfJW/ksddOzP8VBBniolYnRCD2jrMRZ8nBM2ZWYwnXnwYeOAHV+W9tOhAImwRwKF/95yAsVwd21ryHMJBcGH70qLagZ7Ttyt++qO/6+KAXJuKwZqjRlEtSEz8gZQeFfVYgcwSfo96oSMAzVr7V0L6HSDLRnpb6xxmbPdqNol4tQIDAQABo4GkMIGhMB8GA1UdIwQYMBaAFHhDe3amfrzQr35CN+s1fDuHAVE8MA4GA1UdDwEB/wQEAwIGwDAMBgNVHRMBAf8EAjAAMGAGA1UdHwRZMFcwVaBToFGGT2h0dHA6Ly90cnVzdGVkc2VydmljZXMuaW50ZWwuY29tL2NvbnRlbnQvQ1JML1NHWC9BdHRlc3RhdGlvblJlcG9ydFNpZ25pbmdDQS5jcmwwDQYJKoZIhvcNAQELBQADggGBAGcIthtcK9IVRz4rRq+ZKE+7k50/OxUsmW8aavOzKb0iCx07YQ9rzi5nU73tME2yGRLzhSViFs/LpFa9lpQL6JL1aQwmDR74TxYGBAIi5f4I5TJoCCEqRHz91kpG6Uvyn2tLmnIdJbPE4vYvWLrtXXfFBSSPD4Afn7+3/XUggAlc7oCTizOfbbtOFlYA4g5KcYgS1J2ZAeMQqbUdZseZCcaZZZn65tdqee8UXZlDvx0+NdO0LR+5pFy+juM0wWbu59MvzcmTXbjsi7HY6zd53Yq5K244fwFHRQ8eOB0IWB+4PfM7FeAApZvlfqlKOlLcZL2uyVmzRkyR5yW72uo9mehX44CiPJ2fse9Y6eQtcfEhMPkmHXI01sN+KwPbpA39+xOsStjhP9N1Y1a2tQAVo+yVgLgV2Hws73Fc0o3wC78qPEA+v2aRs/Be3ZFDgDyghc/1fgU+7C+P6kbqd4poyb6IW8KCJbxfMJvkordNOgOUUxndPHEi/tb/U7uLjLOgPA==",
    "ias_sig" : "p779ID6nd5UuGUujjuMoD4p56NBmaJhKrUCP7/umaHnhi8Jzc7lCT4WYLmqwcWGyyZ8dwn77BRs462UE2zOtlVlt/8aaWQXA0/lgtqzYXloAuDpPISq/pNwIU4jjuZDF/cvlTM24/mC9ucp6fHCOVHCQHktbhaWEkUM/I0nVkyCI7NWo/QH87AD9Gu9WbaV/My/8DiewPWl1EO+fCmzvxQ1sjQEoCwK5aGE59HW75QmN7njl0r3N5eqEbQidn2m9pYo2gD1Sfz6Lld6Oh3UF2K2wkrx8yZvLJ+9RQ1MTlOT8WAViX1Uh8stHjYJhMjnexJ+UVi0bo7lOJOMiHKJH3w==",
  "isv_body" : "{\"id\":\"304968845187605685219376829746980087898\",\"timestamp\":\"2021-01-05T08:08:10.773470\",\"version\":3,\"epidPseudonym\":\"4tcrS6EX9pIyhLyxtgpQJuMO1VdAkRDtha/N+u/rRkTsb11AhkuTHsY6UXRPLRJavxG3nsByBdTfyDuBDQTEjMYV6NBXjn3P4UyvG1Ae2+I4lE1n+oiKgLA8CR8pc2nSnSY1Wz1Pw/2l9Q5Er6hM6FdeECgMIVTZzjScYSma6rE=\",\"isvEnclaveQuoteStatus\":\"GROUP_OUT_OF_DATE\",\"platformInfoBlob\":\"150200650400090000111102040101070000000000000000000B00000B00000002000000000000142A45443B33E43755DB2A1411C66EA3E7920379C3BDA00CBAF42C1099C03350D6E849F10EC00E72111E45F22329362918DB2DB2E25A348152F7A13CFC32C7D76854\",\"isvEnclaveQuoteBody\":\"AgABACoUAAALAAoAAAAAAP7yPH5zo3mCPOcf8onPvAcAAAAAAAAAAAAAAAAAAAAACAj///8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAHAAAAAAAAANFBy8B/5HNAD9aqqb2h1v6VZ0nesPz1uMa+Qw2OycvKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACD1xnnferKFHD2uvYqTXdDA8iZ22kCD5xw7h38CMfOngAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABpVsGfiRS74Ux/uN1Px3bNM4LpS+JWebK2v0+wdesn68HK3Hbf8Mdv5yrNToOvgPGPGok+fReejXYwCFwKqSI+\"}",
  "sig" : "157ebef34f30ea3edea29b5ec6d59e6595a7db1ebe85bf06269a2fb6d2cce57456e9adc5703272ec7df4a09b49df0b1abde980371e42f5e57dcf8a944194a8a3",
  "backup": "{\"address\":\"5FqazaU79hjpEMiWTWZx81VjsYFst15eBuSBKdQLgQibD7CX\",\"encoded\":\"0xc81537c9442bd1d3f4985531293d88f6d2a960969a88b1cf8413e7c9ec1d5f4955adf91d2d687d8493b70ef457532d505b9cee7a3d2b726a554242b75fb9bec7d4beab74da4bf65260e1d6f7a6b44af4505bf35aaae4cf95b1059ba0f03f1d63c5b7c3ccbacd6bd80577de71f35d0c4976b6e43fe0e1583530e773dfab3ab46c92ce3fa2168673ba52678407a3ef619b5e14155706d43bd329a5e72d36\",\"encoding\":{\"content\":[\"pkcs8\",\"sr25519\"],\"type\":\"xsalsa20-poly1305\",\"version\":\"2\"},\"meta\":{\"name\":\"Yang1\",\"tags\":[],\"whenCreated\":1580628430860}}"
}'
```

Response:

```json
{
    "status": "success",
}
```

#### Send sWorker work report

Request:

```shell
curl --request POST 'http://localhost:56666/api/v1/swork/workreport' \
--header 'Content-Type: application/json' \
--header 'password: 123456' \
--data-raw '{"pub_key":"6956c19f8914bbe14c7fb8dd4fc776cd3382e94be25679b2b6bf4fb075eb27ebc1cadc76dff0c76fe72acd4e83af80f18f1a893e7d179e8d7630085c0aa9223e",
    "pre_pub_key":"",
    "block_height":"16200",
    "block_hash":"0000000000000000000000000000000000000000000000000000000000000000",
    "reserved":4294967296,
    "files_size":5242835,
    "reserved_root":"1ba223d1494bc0e14777a7e63c24484ecbe14ae2004cad45e5f690829c840fd1",
    "files_root":"f7d385d8397d6fbb413a0a1bdaeabab43cf1af131efff42b3c538deec7aedf36",
    "added_files":[
    {"hash":"e2f4b2f31c309e18dbe658d92b81c26bede6015b8da1464b38def2af7d55faef","size":1048567,"c_block_num":16200},
    {"hash":"e2f4b2f31c309e18dbe658d92b81c26bede6015b8da1464b38def2af7d55faef","size":1048567,"c_block_num":16200},
    {"hash":"e2f4b2f31c309e18dbe658d92b81c26bede6015b8da1464b38def2af7d55faef","size":1048567,"c_block_num":16200},
    {"hash":"e2f4b2f31c309e18dbe658d92b81c26bede6015b8da1464b38def2af7d55faef","size":1048567,"c_block_num":16200},
    {"hash":"e2f4b2f31c309e18dbe658d92b81c26bede6015b8da1464b38def2af7d55faef","size":1048567,"c_block_num":16200}],
    "deleted_files":[],
    "sig":"adcb292e5fa95de65457653f910c43dc80140583c63da430d1afe72f83768197ab3f73b9e52fe12aa1a75d5e02c6649253a3617e31f6e852cb40641b4a574cf2",

    "backup":   "{\"address\":\"5FqazaU79hjpEMiWTWZx81VjsYFst15eBuSBKdQLgQibD7CX\",\"encoded\":\"0xc81537c9442bd1d3f4985531293d88f6d2a960969a88b1cf8413e7c9ec1d5f4955adf91d2d687d8493b70ef457532d505b9cee7a3d2b726a554242b75fb9bec7d4beab74da4bf65260e1d6f7a6b44af4505bf35aaae4cf95b1059ba0f03f1d63c5b7c3ccbacd6bd80577de71f35d0c4976b6e43fe0e1583530e773dfab3ab46c92ce3fa2168673ba52678407a3ef619b5e14155706d43bd329a5e72d36\",\"encoding\":{\"content\":[\"pkcs8\",\"sr25519\"],\"type\":\"xsalsa20-poly1305\",\"version\":\"2\"},\"meta\":{\"name\":\"Yang1\",\"tags\":[],\"whenCreated\":1580628430860}}"
    }'
```

Response:

```json
{
    "status": "success",
}
```

## Errors

All the errors will be global catched with return `status code = 400` 😂
