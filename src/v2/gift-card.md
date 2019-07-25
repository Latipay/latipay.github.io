---
title: Gift Card (Beta)
type: v2
order: 7
---

### 1 - Freeze Gift Card
```
POST https://api.latipay.net/v2/gift-card/freeze
Content-Type: application/json;charset=UTF-8
```
- <strong>Request Parameters</strong>

| Name               | Type   | Description                                                                                                            | Optional |
| ------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| user_id            | string | The Latipay user account which is using for processing the transactions.                                               | N        |
| wallet_id          | string | The wallet ID that using for online transactions.                                                                      | N        |
| merchant_reference | string | A `unique id` identifying the redeeming order in Merchant’s system.                                                    | N        |
| gift_card_code     | string | A 12 digits code for identifying the gift card.                                                                        | N        |
| currency           | string | The currency code of the transaction.                                                                                  | Y        |
| amount             | number | A decimal amount.                                                                                                      | Y        |
| freeze_type        | string | Set it as `freeze` means to freeze the gift card, while set is as `unfreeze` the request would unfreeze the gift card. | Y        |
| signature          | string | The SHA-256 HMAC API signature.                                                                                        | N        |

- <strong>Response</strong>

| Name       | Type   | Description                            |
| ---------- | ------ | -------------------------------------- |
| code       | number | Result Code of the request             |
| face_value | number | The value of the redeemming gift card. |

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

| Name | Type   | Description                |
| ---- | ------ | -------------------------- |
| code | number | Result Code of the request |

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
| merchant_reference | string | A `unique id` identifying the redeeming order in Merchant’s system.      | N        |
| drawback_reference | string | A reference that can be added for the merchant's intention               | Y        |
| signature          | string | The SHA-256 HMAC API signature.                                          | N        |

- <strong>Response</strong>

| Name | Type   | Description                |
| ---- | ------ | -------------------------- |
| code | number | Result Code of the request |