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

| Name               | Type   | Description                                                              | Optional |
| ------------------ | ------ | ------------------------------------------------------------------------ | -------- |
| user_id            | string | The Latipay user account which is using for processing the transactions. | N        |
| wallet_id          | string | The wallet ID that using for online transactions.                        | N        |
| merchant_reference | string | A `unique id` identifying the order in Merchant’s system.                | N        |
| gift_card_code     | string |                                                                          | N        |
| currency           | string | The currency code of the transaction.                                    | Y        |
| amount             | number | A decimal amount.                                                        | Y        |
| signature          | string | The SHA-256 HMAC API signature.                                          | N        |

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

| Name               | Type   | Description                                                              | Optional |
| ------------------ | ------ | ------------------------------------------------------------------------ | -------- |
| user_id            | string | The Latipay user account which is using for processing the transactions. | N        |
| wallet_id          | string | The wallet ID that using for online transactions.                        | N        |
| merchant_reference | string | A `unique id` identifying the order in Merchant’s system.                | N        |
| signature          | string | The SHA-256 HMAC API signature.                                          | N        |

- <strong>Response</strong>

| Name        | Type   | Description                                        |
| ----------- | ------ | -------------------------------------------------- |
| code        | number | Result Code of the request                         |
| face_value  | number | The value of the redeemming gift card.             |
| redeem_code | string | A unique code to present the redeeming transation. |

### 3 - Drawback Gift Card
```
POST https://api.latipay.net/v2/gift-card/drawback
Content-Type: application/json;charset=UTF-8
```
- <strong>Request Parameters</strong>

| Name               | Type   | Description                                                              | Optional |
| ------------------ | ------ | ------------------------------------------------------------------------ | -------- |
| user_id            | string | The Latipay user account which is using for processing the transactions. | N        |
| wallet_id          | string | The wallet ID that using for online transactions.                        | N        |
| merchant_reference | string | A `unique id` identifying the order in Merchant’s system.                | N        |
| redeem_code        | string | A unique code to present the redeeming transation.                       |
| signature          | string | The SHA-256 HMAC API signature.                                          | N        |

- <strong>Response</strong>

| Name | Type   | Description                |
| ---- | ------ | -------------------------- |
| code | number | Result Code of the request |