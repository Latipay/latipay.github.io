---
title: Gift Card (Beta)
type: v2
order: 7
---

### 1 - Lock Gift Card
```
POST https://api.latipay.net/v2/gift-card/lock
Content-Type: application/json;charset=UTF-8
```
- <strong>Request Parameters</strong>

| Name               | Type   | Description | Optional |
| ------------------ | ------ | ----------- | -------- |
| merchant_reference | string |             | N        |
| merchant_code      | string |             | N        |
| wallet_code        | string |             | N        |
| gift_card_code     | string |             | N        |
| currency           | string |             | Y        |
| amount             | number |             | N        |
| signature          | string |             | N        |

- <strong>Response</strong>

| Name | Type   | Description                |
| ---- | ------ | -------------------------- |
| code | number | Result Code of the request |

### 2 - Redeem Gift Card
```
POST https://api.latipay.net/v2/gift-card/redeam
Content-Type: application/json;charset=UTF-8
```
- <strong>Request Parameters</strong>

| Name               | Type   | Description | Optional |
| ------------------ | ------ | ----------- | -------- |
| merchant_reference | string |             | N        |
| merchant_code      | string |             | N        |
| wallet_code        | string |             | N        |
| signature          | string |             | N        |

- <strong>Response</strong>

| Name        | Type   | Description                                       |
| ----------- | ------ | ------------------------------------------------- |
| code        | number | Result Code of the request                        |
| redeem_code | string | A unique code to present the redeeming transation |

### 3 - Drawback Gift Card
```
POST https://api.latipay.net/v2/gift-card/drawback
Content-Type: application/json;charset=UTF-8
```
- <strong>Request Parameters</strong>

| Name               | Type   | Description | Optional |
| ------------------ | ------ | ----------- | -------- |
| redeem_code        | string |             | N        |
| merchant_reference | string |             | N        |
| merchant_code      | string |             | N        |
| wallet_code        | string |             | N        |
| signature          | string |             | N        |

- <strong>Response</strong>

| Name | Type   | Description                |
| ---- | ------ | -------------------------- |
| code | number | Result Code of the request |