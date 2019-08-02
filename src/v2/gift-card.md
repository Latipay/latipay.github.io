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
| freeze_type        | string | Set it as `freeze` means to freeze the gift card, while set it as `unfreeze` the request would unfreeze the gift card. | N        |
| signature          | string | The SHA-256 HMAC API signature.                                                                                        | N        |

* <strong>SHA-256 HMAC Signature</strong> [Try your signature online](https://jsfiddle.net/tonnyLTP/wj36tey4/45/)

Rearrange all parameters alphabetically (except parameters with value of `null` or `empty` string) and join them with `&`, and concat the value of `api_key` in the end.

JS code example:

```js
  Object.keys(data)
    .filter(item => data[item] != null && data[item] != undefined && data[item] !== '')
    .sort()
    .map(item => `${item}=${data[item]}`)
    .join('&')
    .concat(api_key)
```

- <strong>Response</strong>

| Name       | Type   | Description                            |
| ---------- | ------ | -------------------------------------- |
| code       | number | Result Code of the request             |
| face_value | number | The value of the redeemming gift card. |

### 2 - Redeem Gift Card
```
POST https://api.latipay.net/v2/gift-card/redeem
Content-Type: application/json;charset=UTF-8
```
- <strong>Request Parameters</strong>

| Name               | Type   | Description                                                              | Optional |
| ------------------ | ------ | ------------------------------------------------------------------------ | -------- |
| user_id            | string | The Latipay user account which is using for processing the transactions. | N        |
| wallet_id          | string | The wallet ID that using for online transactions.                        | N        |
| merchant_reference | string | A `unique id` identifying the order in Merchant’s system.                | N        |
| confirm_codes      | string | A string of the frozon gift cards, seperated by `','`.                   | N        |
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