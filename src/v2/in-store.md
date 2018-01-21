---
title: In-Store API
type: v2
order: 3
---
[Download PDF](/pdf/in-store-01-19.pdf)

<p class="tip">If you want to get QR code `picture` (e.g. for EFTPOS) rather than QR code `text` from Latipay API, please refer to [In-Store API - QR code Picture](https://doc.latipay.net/v2/in-store-qr-code-picture.html). And this document is only suitable for the following `in-store` situation.</p>

* The customer scans `Alipay payment QR code` through `Alipay app`.
* or the customer scans `Wechat payment QR code` through `Wechat app`.
* or the customer scans QR code to load a webpage inside of `Alipay app's browser` and pays through `Alipay app`.
* or the customer scans QR code (with iPhone Camera app) to load a webpage on `mobile browser` and pays through `Alipay app`.

## How it works?

### Latipay's web page presenting QR code

![](http://latipay.net/wp-content/uploads/images/01_-_Online_payment_workflow_-_Latipay_hosted-_both-02.png)

1. To process a transaction, customers select `alipay`, or `wechat` as an **in-store** payment method in website, e.g. in E-commerce website.

2. The **merchant**’s E-commerce server sends a transaction request [#Transaction Interface](#Transaction-Interface) to **Latipay** with the authentication and order details.

3. **Latipay** responds with a `host_url` and `nonce`.

4. The **merchant**'s server redirect the website to the host_url with nonce as parameter.[#Payment Interface](#Payment-Interface)

5. The customer will be prompted to a page which requires to `scan the QR code` with Alipay or Wechat app and complete the payment.

6. The result of payment is displayed in **merchant**’s website or **merchant's** terminal/device in-store.

### Merchant digital platform presenting QR code

**Merchant** server loads `host_url` with `nonce` as parameter and gets the QR code text. Then **Merchant** `generates QR Code picture from the text` and display it in web page or other digital platform. The customer scans the QR code with Alipay or Wechat app and complete the payment.


## Payment Scenarios

#### Alipay
![](http://latipay.net/wp-content/uploads/images/Alipay_MerchantHosted.png)

---

#### WeChat Pay
![](http://latipay.net/wp-content/uploads/images/Wechat-latipayhosted.png)


## API List

### Preparation

Before using the following API, please make sure you have `user_id`, `wallet_id` and `api_key` on hand. If you don't have them, we would like to help you. [Contact Us](http://www.latipay.net/contact/). 

### Transaction Interface

Create a latipay transaction is the first step for using alipay or wechat pay.

```
POST https://api.latipay.net/v2/transaction
```

#### Parameters

| Name  | Type  | Description | Nullable |
|------------- |---------------| -------------| -------------|
| user_id | String | The user account you want to use to process the transaction. | No |
|wallet_id | String | The ID of the wallet you want to use. | No
|payment_method | String | Payment method options are `wechat` and `alipay`. | No
|amount | String | A decimal amount. | No
|return_url | String | The URL of the landing page where Latipay will return the customer after payment, but it doesn’t work in `in-store` situation.| No
|callback_url | String | The URL of the callback address the transaction notification is sent after payment. | No
|signature | String | The `SHA-256 HMAC` API signature. | No
|merchant_reference | String | A field for identifying your transaction. | No
|ip | String | The IP address of the customer. | No
|version | String | The latest version of the platform. must be `'2.0'`| No
|product_name | String | The name of the product or service being sold. | YES


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
|host_url |   String  | The url for request a QR code picture. The nonce should be appended to the end. | 
|nonce  |   String  |   The transaction nonce must be appended to the `host_url`.|
|signature  | String  | The `SHA-256 HMAC` API signature. |

#### Signature in Response

<p class="tip">For security reasons, we highly recommend you verify the **signature**.</p>

```
message: nonce + host_url
secret: api_key
```

#### Extra Parameters for alipay and wechat

When load the url `{host_url}/{nonce}` in next step [#Payment Interface](#Payment-Interface), you will get different result depend on the environment and extra parameter. Please check out the response of [#Payment-Interface](#Payment-Interface)

### Payment Interface
To load the following url in PC browser, mobile browser or Alipay/Wechat’s inner browser.

```
{host_url}/{nonce}
```

#### Example

```
https://pay.latipay.net/pay/7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3
```

#### Response, based on Environment and Extra Parameters

|  Environment | Payment Method  | Extra Parameters for [#Transaction Interface](#Transaction-Interface)  | Response | Customer makes payment|
|------------- |---------------| -------------| ------| ------| ------|
| Alipay inner browser | alipay  | is\_staticpay="1" | Alipay app pay directly | ![](../images/alipay.png?a) |
| Mobile browser| alipay  | is\_staticpay="1" | Mobile browser try to launch Alipay app | ![](../images/alipay-mobile-browser.png?a) |
| PC browser/Mobile browser| alipay  | present\_qr="1" is\_spotpay="1" | a Latipay webpage which presents QR code which waiting for Alipay app to scan | ![](../images/alipay-latipay.png?a) |
| Any | alipay  | is_spotpay="1" | a json contains `qr_code` text| Merchant backend or frontend needs to generate QR code and display it to customer in digital platform|
| Non Wechat App |wechat  | present\_qr="1" | a Latipay webpage which presents QR code which waiting for Wechat app to scan |![](../images/wechat-latipay.png?b)|
|Non-Wechat App| wechat|  | a json contains `code_url` text |Merchant backend or frontend needs to generate QR code and display it to customer in digital platform|


Alipay QR code text

```json
{
  "qr_code": "https://qr.alipay.com/bax081077lt4kxtaupg00082"
}
```

Wechat QR code text

```json
{
  "code_url":"weixin://wxpay/bizpayurl?pr=12121312"
}
```


### Payment Result Asynchronous Notification
This is payment result notification sent from Latipay to merchant after the payment is done successfully. There is a re-try mechanism with the notification to ensure the notification could be delivered to the merchant. If you receive callback notification, please send `"sent"` to us. Callback notification can be sent many times until we receive "sent".

```
POST merchant's callback_url
Content-Type: application/json
```
#### Parameters

| Name  | Type  | Description |
|------------- |---------------| -------------|
|transaction_id | String | A unique transaction identifier generated by Latipay. |
|merchant_reference | String | A field for identifying your transaction. |
|currency | String | The currency code of the transaction. |
|amount | String | A decimal amount. |
|payment_method | String | The payment method used. Possible values are `wechat` and `alipay`. |
|status | String | The status of the transaction. Possible values are: pending, paid, or failed. |
|pay_time | String | Show the payment time of the transaction order. `UTC/GMT+08:00`|
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
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
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
There is a sync and front-end payment result redirection sent by Latipay to merchant after the payment is done successfully.

```
Redirect merchant's return_url
```

| Name  | Type  | Description |
|------------- |---------------| -------------|
|merchant_reference | String | A field for identifying your transaction. |
|payment_method | String | The payment method used. Possible values are wechat, alipay. |
|status | String | The status of the transaction. Possible values are: pending, paid, or failed. |
|currency | String | The currency code of the transaction. |
|amount | String | A decimal amount. |
|signature | String |`The SHA-256 HMAC` API signature.|

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

#### Example Signature [Try your signature online](https://www.freeformatter.com/hmac-generator.html)

```
message: dsi39ej430sks03alipaypaidNZD120.00
secret: 111222333
signature: 840151e0dc39496e22b410b83058b4ddd633b786936c505ae978fae029a1e0f1
```

### Payment Result Interface
All customers can send request to search their transaction order by merchant order id(that should be unique id for the merchant) as merchant_reference by HTTP GET request.

```
GET https://api.latipay.net/v2/transaction/{merchant_reference}
```

#### Parameters

| Name  | Type  | Description |
|------------- |---------------| -------------|
|user_id | String | The user account you want to use to process the transaction. |
|signature | String | The `SHA-256 HMAC` API signature.

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
|payment_method  | String  | The payment method used. Possible values are `wechat` and `alipay`.  |
|status  | String  | The status of the transaction. Possible values are: pending, paid, or failed.  |
|pay_time  | String  | Show the payment time of the transaction order. `UTC/GMT+08:00` |
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
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
}
```

#### Signature in Response

<p class="tip">For security reasons, we highly recommend you verify the **signature**.</p>

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