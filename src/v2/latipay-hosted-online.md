---
title: Latipay Hosted - Online
type: v2
order: 2
---
[Download PDF](/pdf/latipay-hosted-online.pdf)

Welcome! It looks like you’re ready to connect with Latipay. This reference documentation explains how it can be done using Latipay’s API. Once setup, you’ll be tapping into millions of Chinese consumers who prefer local payment methods. We’re constantly updating our payment methods but would love to hear your suggestions on how we could improve our platform.

<p class="tip">This document is suitable for the following `online` situation to make the payment.</p>

* Customer load `Alipay excashier page` on `PC browser`, customer can either scan QR code or login alipay.
* Customer load Merchant's E-commerce website on `mobile browser` and pay through `Alipay app`.
* Customer load Merchant's E-commerce website inside of `Alipay app's browser` and pay through `Alipay app`.
* Customer load Merchant's E-commerce website inside of `Wechat app's browser` and pay through `Wechat app`.
* Customer load latipay hosted page to pay through Chinese online bank.


## Summary
The Latipay 2.0 interface is an independent Hosted Payments Page (HPP) solution provided by Latipay. The HPP provides a solution for capturing Wechat/ Alipay and 19 main Chinese banks information securely without exposing the merchant to sensitive financial data. The Latipay Hosted Ecommerce API provides merchants with a secure and versatile solution for `online` payments [(Transaction-Interface)](#Transaction-Interface). Redirecting users to a Latipay Hosted Payment Page to complete the payment [(Payment-Interface)](#Payment-Interface). A real-time confirmation [redirection](#Synchronous-Redirection) of payment from Latipay will be displayed on the merchant’s website. At the same time, a [notification](#Payment-Result-Asynchronous-Notification) will be implemented to the merchant to ensure that confirmation of payments have been sent to an allocated callback_url in less than 30s. Merchants also can track payment status through the [Latipay Order Query API](#Query-Interface).

## How it works?

![](http://latipay.net/wp-content/uploads/images/01_-_Online_payment_workflow_-_Latipay_hosted-_both-02.png)

1. To process a transaction, customers select `Alipay`, `Wechat` or `OnlineBank` as payment method in merchant's website, e.g. in E-commerce website.

2. the **merchant**’s ecommerce server sends a transaction request [#Transaction-Interface](#Transaction-Interface) to **Latipay** with the authentication and order details.

3. **Latipay** responds with a `host_url` and `nonce`.

4. The **merchant**'s server redirect the website to the host_url with nonce as parameter.[#Payment-Interface](#Payment-Interface)

5. The customer will be prompted to a page which requires him/she to either `enter their Chinese bank card details` or `scan the QR code` and complete the transaction or `pay directly` if in Alipay or Wechat app.

6. The result of payment is displayed and the user is automatically redirected back to the **merchant**’s website.

## Payment Scenarios

#### Alipay
![](http://latipay.net/wp-content/uploads/images/Alipay-latipayhosted.png)
---
#### WeChat Pay
![](http://latipay.net/wp-content/uploads/images/Wechat-latipayhosted.png)
---
#### Online Bank
![](http://latipay.net/wp-content/uploads/images/Onlinebank-latipayhosted.png)
---
#### Website check-out page
![](http://latipay.net/wp-content/uploads/images/checkout_show.png)
---

## API List

### Transaction Interface

Create a latipay transaction(or order) is the first step for using alipay, wechat pay or online bank.

```
POST https://api.latipay.net/v2/transaction
```

#### Parameters

| Name  | Type  | Description | Nullable |
|------------- |---------------| -------------| -------------|
| user_id | String | The latipay user account you want to use to process the transaction. | No |
|wallet_id | String | The ID of the wallet you want to collect the money. | No
|payment_method | String | Payment method options are `wechat`, `alipay`, or `onlineBank`. | No
|amount | String | A decimal amount. | No
|return_url | String | The URL of the landing page where Latipay will return the customer after payment. | No
|callback_url | String | The URL of the callback address the transaction notification is sent after payment. | No
|signature | String | The `SHA-256 HMAC` API signature. | No
|merchant_reference | String | A field for identifying your transaction. | No
|ip | String | The IP address of the customer. | No
|version | String | The latest version of the platform. must be `'2.0'` | No
|product_name | String | The name of the product or service being sold. | No

#### Example Parameters

```json
{
  "user_id": "U000334333",
  "wallet_id": "W00000001",
  "amount": "120.00",
  "payment_method": "alipay",
  "return_url": "https://merchantsite.com/checkout",
  "callback_url": "https://merchantsite.com/confirm",
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
  "merchant_reference": "dsi39ej430sks03",
  "ip": "122.122.122.1",
  "version": "2.0",
  "product_name": "Pinot Noir, Otago"
}
```

#### SHA-256 HMAC Signature

```
message: user_id + wallet_id + amount + payment_method + return_url + callback_url
secret: api_key
```

#### Example Signature [Try your signature online](https://www.freeformatter.com/hmac-generator.html)

```
message: U000000001W000000010.01alipayhttp://merchant.com/returnhttp://merchant.com/callback
secret: 111222333
signature: 2367bcd9e9a2f9a547c85d7545d1217702a574b8084bbb7ae33b45a03a89983
```

#### Response

```json
{
  "host_url": "https://pay.latipay.net/pay",
  "nonce": "7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3",
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
}
```

| Name  | Type  | Description |
|------------- |---------------| -------------|
|host_url |   String  |   a url which leads customer to make the payment.
|nonce  |   String  |   The transaction nonce must be appended to the `host_url`
|signature  | String  | The SHA-256 HMAC API signature.

#### Signature in Response

<p class="tip">For security reasons, we highly recommend you verify the **signature** in merchant's web server.</p>

```
message: nonce + host_url
secret: api_key
```

### Payment Interface

To load the following url in PC browser, mobile browser or Alipay/Wechat's inner browser.
```
{host_url}/{nonce}
```

#### Example

```
https://pay.latipay.net/pay/7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3
```

#### Response

|  Platform | Payment Method  | Response | Customer makes payment
|------------- |---------------| -------------| ------| ------
| PC browser |alipay | Alipay QR payment page | ![](../images/alipay-pc.png?a)|
| Mobile browser |alipay | try to launch Alipay app to pay|![](../images/alipay-mobile-browser.png?a)|
| Alipay inner browser |alipay | Alipay app makes payment directly |![](../images/alipay.png?a)|
| Wechat browser |wechat | Wechat app makes payment directly |![](../images/wechat.png?a)|
| Any |onlineBank | a Latipay hosted webpage, a form customer can fill in |![](../images/bank.png?a)|


### Payment Result Asynchronous Notification

There is an asynchronous and back-end payment result notification sent from Latipay to merchant's web server after the payment is done successfully. There is a re-try mechanism with the notification to ensure the notification could be delivered to the merchant. This is notification can be sent many times until we receive `"sent"` text. The time interval of this notification is about 30 seconds.

```
POST merchant's callback_url
```

#### Parameters

| Name  | Type  | Description |
|------------- |---------------| -------------|
|transaction_id | String | f66f-4f1b-9ef5-43cb917ff8a6 (string) - A unique transaction identifier generated by Latipay. |
|merchant_reference | String | A field for identifying your transaction. |
|currency | String | The currency code of the transaction. |
|amount | String | A decimal amount. |
|payment_method | String | The payment method used. Possible values are `wechat`, `alipay`, `onlineBank`. |
|status | String | The status of the transaction. Possible values are: `pending`, `paid`, or `failed`. |
|pay_time | String | the payment time of the transaction order. `UTC/GMT+08:00`|
|signature | String | The `SHA-256 HMAC` API signature. |

#### Example Parameters

```json
{
  "transaction_id": "43cb917ff8a6",
  "merchant_reference": "dsi39ej430sks03",
  "amount": "120.00",
  "currency": "NZD",
  "payment_method": "alipay",
  "pay_time": "2017-07-07 10:53:50",
  "status" : "paid",
  "signature": "840151e0dc39496e22b410b83058b4ddd633b786936c505ae978fae029a1e0f1",
}
```

#### SHA-256 HMAC Signature

<p class="tip">Merchant backend need to validate the **signature** for protecting against malicious requests.</p>

```
message: merchant_reference + payment_method + status + currency + amount
secret: api_key
```

#### Example Signature [Try your signature online](https://www.freeformatter.com/hmac-generator.html)

```
message: dsi39ej430sks03alipaypaidNZD120.00
secret: 111222333
signature: 840151e0dc39496e22b410b83058b4ddd633b786936c505ae978fae029a1e0f1
```

#### Expected text "sent" in Response's body

```
sent
```

### Synchronous Redirection

There is a sync and front-end payment result redirection sent from Latipay to merchant after the payment is done successfully.

```
Redirect merchant's return_url
```

| Name  | Type  | Description |
|------------- |---------------| -------------|
|merchant_reference | String | A field for identifying your transaction. |
|payment_method | String | The payment method used. Possible values are wechat, alipay, jdpay, baidu-pay or onlineBank. |
|status | String | The status of the transaction. Possible values are: pending, paid, or failed. |
|currency | String | The currency code of the transaction. |
|amount | String | A decimal amount. |
|signature | String |The `SHA-256 HMAC` API signature.

#### Example

```
https://www.merchant.com/latipay?merchant_reference=dsi39ej430sks03&payment_method=alipay&status=paid&currency=NZD&amount=100.00&signature= 14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3
```

#### SHA-256 HMAC Signature

Merchant frontend need to validate the signature for protecting against malicious requests.

```
message: merchant_reference + payment_method + status + currency + amount
secret: api_key
```

### Query Interface

All customers can send request to search their transaction order by merchant order id(that should be unique id for the merchant) as merchant_reference by HTTP GET request.

```
GET https://api.latipay.net/v2/transaction/{merchant_reference}
```

#### Parameters

| Name  | Type  | Description |
|------------- |---------------| -------------|
|user_id | String | The user account you want to use to process the transaction. |
|signature | String |The SHA-256 HMAC API signature.

#### SHA-256 HMAC Signature

```
message: merchant_reference + user_id
secret: api_key
```

#### Response

| Name  | Type  | Description |
|------------- |---------------| -------------|
|transaction_id  | String  | A unique transaction identifier generated by Latipay.  |
|merchant_reference  | String  | A field for identifying your transaction.  |
|currency  | String  | The currency code of the transaction.  |
|amount  | String  | A decimal amount.  |
|payment_method  | String  | The payment method used. Possible values are `wechat`, `alipay`,or `onlineBank`.  |
|status  | String  | The status of the transaction. Possible values are: pending, paid, or failed.  |
|pay_time  | String  | the payment time of the transaction order. `UTC/GMT+08:00`|
|signature  | String  | The `SHA-256 HMAC` API signature.  |

#### Example

```json
{
  "transaction_id": "20170707-wechat-3473511594933",
  "merchant_reference": "dsi39ej430sks03",
  "currency": "AUD",
  "amount": "120.00",
  "payment_method": "wechat",
  "status": "paid",
  "pay_time": "2017-07-07 10:53:50",
  "signature": "840151e0dc39496e22b410b83058b4ddd633b786936c505ae978fae029a1e0f1",
}
```

#### Signature in Response

<p class="tip">For security reasons, we highly recommend you verify the **signature** in the response.</p>

```
message: merchant_reference + payment_method + status + currency + amount
secret: api_key
```

#### Example Signature [Try your signature online](https://www.freeformatter.com/hmac-generator.html)

```
message: dsi39ej430sks03alipaypaidNZD120.00
secret: 111222333
signature: 840151e0dc39496e22b410b83058b4ddd633b786936c505ae978fae029a1e0f1
```