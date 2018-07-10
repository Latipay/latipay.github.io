---
title: Barcode Payment
type: v2
order: 4
---

[Try it Online](http://doc.latipay.net/api-console/index.html?api=/barcode)

<p class="tip">Tips: Get your `Wallet ID`, `User ID` and `API key` via <a href="https://merchant.latipay.net/account" target="__blank">Latipay Merchant Portal</a> > Account > Show hidden values
Tips: Create a minimum amount product (e.g. $ 0.01 NZD/AUD) for testing.</p>

## API Details

### STEP 1 - Latipay Transaction Interface

```
POST https://api.latipay.net/barcode
Content-Type: application/json;charset=UTF-8
```

Demo

```
curl \
-X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{
  "user_id": "U000000013",
  "wallet_id": "W000000023",
  "amount": "0.05",
  "pay_code": "1234567890",
  "signature": "fdaa4b9763d77cb034ffd9691324eda4ae5e845487f794c92a48db338298fde3"
}' \
https://api.latipay.net/barcode
```

* <strong>Parameters</strong>

| Name  | Type  | Description | Nullable |
|------------- |---------------| -------------| -------------|
|user_id | String | The Latipay user account which is using for processing the transactions. | NO |
|wallet_id | String | The wallet ID that using for online transactions.  | NO
|amount | String | A decimal amount. | NO
|pay_code | String | Customer's payment code which displayed in Wechat app or Alipay app. | NO
|signature | String | The `SHA-256 HMAC` API signature. | NO

Example

```json
{
  "user_id": "U00001534",
  "wallet_id": "W00000001",
  "amount": "0.05",
  "pay_code": "134588558514585062",
  "signature": "e66d54f711bc6a1dde59838c8b0de73ccc8b025a2ae65ae878216f010a05f599"
}
```

* <strong>SHA-256 HMAC Signature</strong> [Try your signature online](https://jsfiddle.net/tonnyLTP/wj36tey4/45/)

Rearrange parameters alphabetically (except parameters with value of `null` or `empty` string) and join them with `&`, and concat the value of `api_key` in the end.

JS code example:

```js
  Object.keys(data)
    .filter(item => data[item] != null && data[item] != undefined && data[item] !== '')
    .sort()
    .map(item => `${item}=${data[item]}`)
    .join('&')
    .concat(api_key)
```

Example

```
Message: amount=0.05&pay_code=134588558514585062&user_id=U00001534&wallet_id=W00000001111222333
SecretKey: 111222333

Signature: e66d54f711bc6a1dde59838c8b0de73ccc8b025a2ae65ae878216f010a05f599
```

* <strong>Response</strong>

```json
{
  "code": 0,
  "message": "SUCCESS",
  "order_id": "2018071000000033"
}
```

| Name  | Type  | Description  |
|------------- |---------------| -------------|
| order_id | String | A unique transaction identifier generated by Latipay. |