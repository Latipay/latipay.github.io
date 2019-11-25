---
title: Latipay Invoice
type: v2
order: 6
---
[API Playground](http://doc.latipay.net/api-console/invoice.html)

<p class="tip">Tips: Get your `Wallet ID`, `User ID` and `API key` via <a href="https://merchant.latipay.net/account" target="__blank">Latipay Merchant Portal</a> > Account > Show hidden values
Tips: Create a minimum amount product (e.g. $ 0.01 NZD/AUD) for testing.</p>


## API Details

### 1 - Create Invoice

```
POST https://api.latipay.net/v2/invoice
Content-Type: application/json;charset=UTF-8
```

[API Playground](http://doc.latipay.net/api-console/invoice.html?api=/v2/invoice&method=POST)

* <strong>Parameters</strong>

| Name  | Type  | Description | Optional |
|------------- |---------------| -------------| -------------|
|user_id | String | The Latipay user account which is using for processing the transactions. | NO |
|wallet_id | String | The wallet ID that using for online transactions.  | NO
|amount | String | A decimal amount. | NO
|product_name | String | The name of the product or service being sold. | YES
|period_time | Int | Page valid time. | YES
|app | Int | 1 is created by the mobile, 0 is created by other devices. | YES
|customer_order_id | String | A unique id identifying the order in merchant system. | YES
|customer_reference | String | Notes about this order. | YES
|return_url | String | The URL of the landing page where Latipay will return the customer after payment. | YES
|notify_url | String | The URL of the notification with payment result. | YES
|qrcode | Boolean | Choosing true or false, whether the QR picture is displayed. | YES
|signature | String | The `SHA-256 HMAC` API signature. | NO

Example

```json
{
  "user_id": "U000000013",
  "wallet_id": "W000000023",
  "amount": 1,
  "product_name": "ticket",
  "notify_url": "https://yourwebsite.com/latipay/notify",
  "signature": "9361c9e5ac5fc269296cc946377b3b4dea03685aa623482981a82101047672d9"
}
```

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

Example

```
Message: amount=1&notify_url=https://yourwebsite.com/latipay/notify&product_name=ticket&user_id=U000000013&wallet_id=W000000023111222333
SecretKey: 111222333

Signature: 9361c9e5ac5fc269296cc946377b3b4dea03685aa623482981a82101047672d9
```

* <strong>Response</strong>

| Name  | Type  | Description |
|------------- |---------------| -------------|
| code | Int | The response code of payment, 0 or Error Code, 0 means no error happened.
| message | String | The response message of payment interface.
| invoice_id | String | The unique ID of the invoice.
| qrcode_pic | String | The QR code picture(Base64).
| invoice_url | String | The URL of the payment page, you can generate QR code picture with it.
| signature | String | The SHA-256 HMAC API signature.


### 2 - Query an Invoice

```
GET https://api.latipay.net/v2/invoice
```

[API Playground](http://doc.latipay.net/api-console/invoice.html?api=/v2/invoice&method=GET)

* <strong>Parameters</strong>

| Name  | Type  | Description | Optional |
|------------- |---------------| -------------| -------------|
|user_id | String | The Latipay user account which is using for processing the transactions. | NO |
|invoice_id | String | The unique ID of the invoice in Latipay.  | YES
|customer_order_id | String | A unique id identifying the order in merchant system. | YES
|signature | String | The `SHA-256 HMAC` API signature. | NO

*invoice_id and customer_order_id are alternative


### 3 - Query Invoices

```
GET https://api.latipay.net/v2/invoices
```

[API Playground](http://doc.latipay.net/api-console/invoice.html?api=/v2/invoices)

* <strong>Parameters</strong>

| Name  | Type  | Description | Optional |
|------------- |---------------| -------------| -------------|
|user_id | String | The Latipay user account which is using for processing the transactions. | NO |
|wallet_id | String | The ID of the wallet you want to use.  | YES
|start_time | String | The start time of a query. | NO
|end_time | String | The end time of a query. If null, it means up to now. | YES
|signature | String | The `SHA-256 HMAC` API signature. | NO


* <strong>Response</strong>

| Name  | Type  | Description |
|------------- |---------------| -------------|
| code | Int | The response code of payment, 0 or Error Code, 0 means no error happened.
| message | String | The response message of payment interface.
| user_id | String | The user account you want to use to process the transaction.
| wallet_id | String |  The ID of the wallet you want to use.
| wallet_name | String |  The name of the wallet you want to use.
| amount | String |  A decimal amount.
| currency | String |  The currency code of the transaction.
| organisation_id | Int | The merchant id which is used to process the transaction.
| organisation | String | The merchant’s name.
| product_name | String | The name of the product or service.
| period_time | Int | Page valid time.
| open_count | Int | The number of times pages have opened.
| customer_order_id | String | A unique id identifying the order in merchant system.
| customer_reference | String | Notes about this order.
|created_time|String|Show the create time of the transaction order
|paid_time|String|Show the payment time of the transaction order
|invoice_id|String|The unique ID of the invoice
|invoice_url|String|The URL of the payment page, you can generate QR code picture with it
|return_url|String|The URL of the landing page where Latipay will return the customer after payment
|notify_url|String|The URL of the notification with payment result
|token|String|Ensure the success of this transaction.
|status|String|The status of the transaction. Possible values are: success, pending, paid, or failed.
|paid_method|String|The payment method used. Possible values are alipay and wechat.
|payment_methods|[String]|Optional payment methods.
|payer|String|The customers who paid.

### 4 - Refund Invoice

```
POST https://api.latipay.net/v2/invoice/refund
```

[API Playground](http://doc.latipay.net/api-console/invoice.html?api=/v2/invoice/refund)

* <strong>Parameters</strong>

| Name  | Type  | Description | Optional |
|------------- |---------------| -------------| -------------|
|user_id | String | The Latipay user account which is using for processing the transactions. | NO |
|invoice_id | String | The unique ID of the invoice.  | YES
|customer_order_id | String |  unique id identifying the order in merchant system.  | YES
|reference | String |  Notes about this refund.  | YES
|signature | String | The `SHA-256 HMAC` API signature. | NO

*invoice_id and customer_order_id are alternative

* <strong>Response</strong>

| Name  | Type  | Description |
|------------- |---------------| -------------|
| code | Int | The response code of payment, 0 or Error Code, 0 means no error happened.
| message | String | The response message of payment interface.


### 5 - Delete Invoice

```
DELETE https://api.latipay.net/v2/invoice
```

[API Playground](http://doc.latipay.net/api-console/invoice.html?api=/v2/invoice&method=DELETE)

* <strong>Parameters</strong>

| Name  | Type  | Description | Optional |
|------------- |---------------| -------------| -------------|
|user_id | String | The Latipay user account which is using for processing the transactions. | NO |
|invoice_id | String | The unique ID of the invoice.  | YES
|customer_order_id | String |  unique id identifying the order in merchant system.  | YES
|signature | String | The `SHA-256 HMAC` API signature. | NO

*invoice_id and customer_order_id are alternative

* <strong>Response</strong>

| Name  | Type  | Description |
|------------- |---------------| -------------|
| code | Int | The response code of payment, 0 or Error Code, 0 means no error happened.
| message | String | The response message of payment interface.


### 6 - Update Invoice

```
PUT https://api.latipay.net/v2/invoice
```

[API Playground](http://doc.latipay.net/api-console/invoice.html?api=/v2/invoice&method=PUT)

* <strong>Parameters</strong>

| Name  | Type  | Description | Optional |
|------------- |---------------| -------------| -------------|
|user_id | String | The Latipay user account which is using for processing the transactions. | NO |
|wallet_id | String | The ID of the wallet you want to use.  | NO
|invoice_id | String | The unique ID of the invoice.  | YES
|amount | String | A decimal amount. | NO
|product_name | String | The name of the product or service being sold. | YES
|period_time | Int | Page valid time. | YES
|customer_order_id | String | A unique id identifying the order in merchant system. | YES
|customer_reference | String | Notes about this order. | YES
|qrcode | Boolean | Choosing true or false, whether the QR picture is displayed. | YES


* <strong>Response</strong>

| Name  | Type  | Description |
|------------- |---------------| -------------|
| code | Int | The response code of payment, 0 or Error Code, 0 means no error happened.
| message | String | The response message of payment interface.
| invoice_id | String | The unique ID of the invoice.
| qrcode_pic | String | The QR code picture(Base64).
| invoice_url | String | The URL of the payment page, you can generate QR code picture with it.
| signature | String | The SHA-256 HMAC API signature.
