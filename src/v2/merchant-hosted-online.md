---
title: Merchant Hosted - Online
type: v2
order: 4
---
[Download PDF](/pdf/merchant-hosted-online.pdf)

Powerful and robust online payment solutions, which work on a range of platforms which include website, billing software and Applications. Latipay provides partnership merchants with the interface for developing custom built payment solution.


## How it works?
Here are two scenarios based on the payment methods.

#### For Wechat Pay / Alipay

![](http://latipay.net/wp-content/uploads/images/02_-_Online_payment_workflow_-_merchant_hosted_-_QR.png)

1. To process a transaction, customers select Latipay Wechat pay or Alipay as payment method, then the merchant sends a request to Latipay partnership merchant.

2. Latipay partnership merchant sends a request to /transaction with the authentication details

3. Latipay responds with a nonce and host_url

4. Latipay partnership merchant responds with a unique URI for an SSL secure payments page

5. The merchant shopping cart uses the returned URI to redirect the customer to the secure Latipay 
partnership merchant hosted payments page.

6. Latipay partnership merchant use the host_url and noune to request a QR code.

7. Latipay responds a QR code Url, then the QR code will display in Latipay partnership merchant hosted 
page. The customer will be prompted to scan the QR code and complete the payment.

8. Latipay partnership merchant query the payment status from Latipay

9. Latipay updates the payment status

10. The result is displayed and automatically redirected back to the merchant’s website.




#### For Online Bank

![](http://latipay.net/wp-content/uploads/images/03_-_Online_payment_workflow_-_merchant_hosted_-_Bank.png)

1. To process a transaction, customers select Latipay Online Banking as payment method, then the merchants send a request to Latipay partnership merchant.

2. Latipay partnership merchant sends a request to /queryBankList with the authentication details.

3. Latipay responds with a banklist JSON.

4. Latipay partnership merchant responds with a unique URI for an SSL secure payments to merchant website.

5. The merchant webpage will redirect to Latipay partnership merchant’s hosted bank list webpage, then the customer can select the preferred Chinese bank.

6. A payment order request will be submitted to Latipay partnership merchant server

7. Latipay partnership merchant server will send the order

8. Once the payment completed, a response will be sent to Latipay partnership merchant’s hosted bank webpage and Latipay partnership merchant server

9. Latipay partnership merchant sends a request to /unified Order with the authentication details

10. Latipay responds with the gateway data and gateway url

11. Latipay partnership merchant server responds the gateway data and gateway url to the Latipay partnership merchant’s hosted webpage.

12. Latipay partnership merchant’s hosted webpage submits the gateway data to gateway url. The Chinese bank webpage, which is selected by the customer, will be displayed. The customer will be prompted to enter their bank card’s details and complete the payment.

13. The result is displayed and the customer is automatically redirected back to the merchant’s website (success or fail page).

## Payment Scenarios

#### Alipay

![](http://latipay.net/wp-content/uploads/images/Alipay_MerchantHosted.png)

--- 

#### WeChat Pay

![](http://latipay.net/wp-content/uploads/images/Wechat_MerchantHosted.png)

--- 

#### Online Bank

![](http://latipay.net/wp-content/uploads/images/Olinebank_MerchantHosted.png)

--- 

#### Website check-out page

![](http://latipay.net/wp-content/uploads/images/checkout_show.png)

--- 

## API List

### Transaction Interface - WeChat and Alipay
	
```
POST https://api.latipay.net/v2/transaction
```
	
#### Parameters:		


| Name  | Type  | Description | Nullable | 
|------------- |---------------| -------------| -------------|
| signature| String| The SHA-256 HMAC API signature.| No|
| wallet_id| String| The ID of the wallet you want to use.| No|
| amount| String| A decimal amount.| No|
| user_id| String| The user account you want to use to process the transaction.| No|
| merchant_reference| String| A field for identifying your transaction.| No|
| currency| String| The currency code of the transaction.| No|
| return_url| String| The URL of the landing page where Latipay will return the customer after payment.| No|
| callback_url| String| The URL of the callback address the transaction notification is sent after payment.| No|
| ip| String| The IP address of the customer.| No|
| version| String| The latest version of the platform.| No|
| product_name| String| The name of the product or service being sold.| No|
| payment_method| String| Payment method options are wechat, alipay, or onlineBank.| No|
| host_type| String| must be "1", which means Merchant hosted.| No|

#### Example Parameters

```json
{
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
  "wallet_id": "W00000001",
  "amount": "120.00",
  "user_id": "U000334333",
  "merchant_reference": "dsi39ej430sks03",
  "currency": "AUD",
  "return_url": "https://merchantsite.com/checkout",
  "callback_url": "https://merchantsite.com/confirm",
  "ip": "122.122.122.1",
  "version": "2.0",
  "product_name": "Pinot Noir, Otago",
  "payment_method": "alipay",
  "host_type" : "1"
}
```

#### SHA-256 HMAC Signature

```
message: user_id + wallet_id + amount + payment_method + return_url + callback_url
secret: api_key
```

#### Example Signature

```
message: U000000001W000000010.01alipayhttp://merchant.com/returnhttp://merchant.com/callback
secret: 111222333

signature: 2367bcd9e9a2f9a547c85d7545d1217702a574b8084bbb7ae33b45a03a89983
```

#### Response

```json
{
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
  "host_url": "https://api.latipay.net/merchanthosted/transaction/",
  "nonce": "7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3"
}
```

| Name  | Type  | Description | 
|------------- |---------------| -------------| 
|signature | String | The SHA-256 HMAC API signature. | 
|host_url | String | The host URL to send your customer. The nonce should be appended to the end. | 
|nonce | String | The transaction nonce must be appended to the pay URL. | 


#### Signature in Response
For security reasons, we highly recommend you verify the signature in the response.

```
message: nonce + host_url
secret: api_key
```

### Payment Interface

```
POST {host_url}/{nonce}
```

#### Example

```
https://api.latipay.net/merchanthosted/transaction/7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3
```

#### Response

| Name  | Type  | Description | 
|------------- |---------------| -------------| 
|code | Integer | The response code of payment, 0 or error code.
|message | String | The response message of payment interface.
|data | Object | The response of payment interface.

the `data` object

| Name  | Type  | Description | 
|------------- |---------------| -------------| 
| order_id | String | A unique transaction identifier generated by Latipay. |
| nonce | String | A unique transaction nonce generated by Latipay. |
| payment_method | String | Payment method options are wechat, alipay, or onlineBank. |
| amount | String | A decimal amount. |
| amount_cny | String | A decimal amount. |
| currency | String | The currency code of the transaction. |
| product_name | String | The name of the product or service being sold. |
|organisation_id | Integer | The merchant id which is used to process the transaction. |
|org_name | String | The merchant's name |
|user_id | String | The user account which is used to process the transaction. |
|user_name | String | The user account's name |
|wallet_id | String | The user wallet account which is used to process the transaction. |
|wallet_name | String | The wallet account's name |
|qr_code | String | The QR code is generate by Latipay or third gateway. |
|currency_rate | String | The rate which is used to the transaction. |
|merchant_reference | String | A field for identifying your transaction. |
|signature | String | The SHA-256 HMAC API signature. |

#### Example

``` json
{
    "code": 0,
    "message": "SUCCESS",
    "data": {
        "order_id" : "20170829-alipay-3990527237343",
        "nonce" : "7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3",
        "payment_method" : "alipay",
        "amount" : "1.00",
        "amount_cny" : "5.00",
        "currency" : "NZD",
        "product_name" : "test",
        "organisation_id": 18,
        "org_name" : "Latipay",
        "user_id" : "U000000051",
        "user_name" : "Latipay test",
        "wallet_id" : "W000000037",
        "wallet_name" : "aud01",
        "qr_code" : "https://qr.alipay.com/bax03286h4vlfpxldgwq4035",
        "currency_rate" : "5.29930",
        "merchant_reference" : "dsi39ej430sks03",
        "signature":"25e6e72cc6sdfecger95713afb101015aasdf3ca5faf3sdeer851f9cb7fb008a"
    }
}
```

#### SHA-256 HMAC Signature
Rearrange parameters in the `data` set alphabetically (except `signature` and other parameters with value of null or empty string) And connect rearranged parameters with &：

```
message: amount=1.00&amount_cny=5.00&currency=NZD&currency_rate=5.29930&merchant_reference=dsi39ej430sks03&nonce=7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3&order_id=20170829-alipay-3990527237343&organisation_id=18&org_name=Latipay&payment_method=alipay&product_name=test&qr_code=https://qr.alipay.com/bax03286h4vlfpxldgwq4035&type=Online&user_id=U000000051&wallet_id=W000000037&wallet_name=aud01
secret: api_key
```

### Payment Result Asynchronous Notification

There is an asynchronous and back-end payment result notification sent by Latipay to merchant after the payment is done successfully. There is a re-try mechanism with the notification to ensure the notification could be delivered to the merchant.


```
POST merchant's callback_url
```

#### Parameters:		

| Name  | Type  | Description | 
|------------- |---------------| -------------|
| signature | String | The SHA-256 HMAC API signature. |  
| transaction_id | String | f66f-4f1b-9ef5-43cb917ff8a6 (string) - A unique transaction identifier generated by Latipay. | 
| merchant_reference | String | A field for identifying your transaction. | 
| currency | String | The currency code of the transaction. |
| amount | String | A decimal amount. |
| payment_method | String | The payment method used. Possible values are wechat, alipay, onlineBank. |
| status | String | The status of the transaction. Possible values are: pending, paid, or failed. |
| pay_time | String | Show the payment time of the transaction order. |

#### Example input

```json
{
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
  "transaction_id": "20170707-wechat-3473511594933",
  "merchant_reference": "dsi39ej430sks03",
  "currency": "AUD",
  "amount": "120.00",
  "payment_method": "wechat",
  "status": "paid",
  "pay_time": "2017-07-07 10:53:50"
}
```


#### SHA-256 HMAC Signature
Merchant backend need to validate the signature for protecting against malicious requests.

```
message: merchant_reference + payment_method + status + currency + amount
secret: api_key
```

#### Expected the text "sent" in Response's body

```
sent
```

### Query Interface
All customers can send request to search their transaction order by merchant order id(that should be unique id for the merchant) as merchant_reference by HTTP GET request.

```
GET https://api.latipay.net/v2/transaction/{merchant_reference}
```

#### Parameters

| Name  | Type  | Description | 
|------------- |---------------| -------------|
| signature | String | The SHA-256 HMAC API signature. |
| user_id | String | The user account you want to use to process the transaction. |

#### Example Parameters

``` json
{
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
  "user_id": "U000334333"
}
```

#### SHA-256 HMAC Signature

```
message: merchant_reference + user_id
secret: api_key
```

#### Response

| Name  | Type  | Description | 
|------------- |---------------| -------------|
| signature | String | The SHA-256 HMAC API signature. |
| transaction_id | String | A unique transaction identifier generated by Latipay. |
| merchant_reference | String | A field for identifying your transaction. |
| currency | String | The currency code of the transaction. |
| amount | String | A decimal amount. |
| payment_method | String | The payment method used. Possible values are wechat, alipay, jdpay, baidu-pay or onlineBank. |
| status | String | The status of the transaction. Possible values are: pending, paid, or failed. |
| pay_time | String | Show the payment time of the transaction order. | 

#### Example Response

``` json
{
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
  "transaction_id": "20170707-wechat-3473511594933",
  "merchant_reference": "dsi39ej430sks03",
  "currency": "AUD",
  "amount": "120.00",
  "payment_method": "wechat",
  "status": "paid",
  "pay_time": "2017-07-07 10:53:50"
}
```

#### Signature in Response
For security reasons, we highly recommend you verify the signature in the response.

```
message: merchant_reference + payment_method + status + currency + amount
secret: api_key
```
---

### Query Bank List Interface - Online Banking
All customers can send a request to search one of the banks available.

```
GET https://api.latipay.net/v2/banklist
```

#### Response

| Name  | Type  | Description | 
|------------- |---------------| -------------|
| code | Integer | The response code of payment, 0 or error code.
| message | String | The response message of bank list interface.
| id | Integer | Bank id.
| name | String | Bank name.

#### Example Response

``` json
{
    "code": 0,
    "message": "SUCCESS",
    "banklist": [{
            "id" : 1,
            "name" : "中国银行信用卡"
        },{
            "id" : 85,
            "name" : "中国银行"
        },{
            "id" : 4,
            "name" : "中国建设银行"
        },{
            "id" : 9,
            "name" : "中国工商银行"
        },{
            "id" : 14,
            "name" : "平安银行"
        }]
}
```

### Transaction Interface - Online Banking
  
```
POST https://api.latipay.net/v2/transaction
```
  
#### Parameters:    


| Name  | Type  | Description | Nullable | 
|------------- |---------------| -------------| -------------|
| signature| String| The SHA-256 HMAC API signature.| No|
| wallet_id| String| The ID of the wallet you want to use.| No|
| amount| String| A decimal amount.| No|
| user_id| String| The user account you want to use to process the transaction.| No|
| merchant_reference| String| A field for identifying your transaction.| No|
| currency| String| The currency code of the transaction.| No|
| return_url| String| The URL of the landing page where Latipay will return the customer after payment.| No|
| callback_url| String| The URL of the callback address the transaction notification is sent after payment.| No|
| ip| String| The IP address of the customer.| No|
| version| String| The latest version of the platform.| No|
| product_name| String| The name of the product or service being sold.| No|
| payment_method| String| Payment method options are wechat, alipay, or onlineBank.| No|
| host_type| String| must be "1", which means Merchant hosted.| No|
| bank_id| Integer| Bank id which is used to process this transaction.| No|

#### Example Parameters

```json
{
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
  "wallet_id": "W00000001",
  "amount": "120.00",
  "user_id": "U000334333",
  "merchant_reference": "dsi39ej430sks03",
  "currency": "AUD",
  "return_url": "https://merchantsite.com/checkout",
  "callback_url": "https://merchantsite.com/confirm",
  "ip": "122.122.122.1",
  "version": "2.0",
  "product_name": "Pinot Noir, Otago",
  "payment_method": "online_banking",
  "host_type" : "1",
  "bank_id" : 85
}
```

#### SHA-256 HMAC Signature
```
message: user_id + wallet_id + amount + payment_method + return_url + callback_url
secret: api_key
```

#### Example Signature

```
message: U000000001W000000010.01alipayhttp://merchant.com/returnhttp://merchant.com/callback
secret: 111222333

signature: 2367bcd9e9a2f9a547c85d7545d1217702a574b8084bbb7ae33b45a03a89983
```

#### Response

```json
{
  "code": 0,
    "message": "SUCCESS",
    "gatewaydata": {
      "v_mid": "8321033",
      "v_oid": "20170913-8321033-3905576564619",
      "v_rcvname": "8321033",
      "v_rcvaddr": "8321033",
      "v_rcvtel": "00000000",
      "v_rcvpost": "8321033",
      "v_amount": "0.05",
      "v_ymd": "20170912",
      "v_orderstatus": 1,
      "v_ordername": "8321033",
      "v_moneytype": 0,
      "v_url": "http://api-staging.latipay.net/notify/sync/payease",
      "v_md5info": "4f34079e61711fd6c2a9cc01f96f99f8",
      "v_producttype": "",
      "v_idtype": "01",
      "v_idnumber": "000000000000000",
      "v_idname": "none",
      "v_idcountry": 156,
      "v_idaddress": "none",
      "v_userref": "U00001534",
      "v_merdata1": "",
      "v_pmode": null,
      "v_merdata5": "8f436",
      "v_merdata8": "8f4369c1",
      "v_itemquantity": "1",
      "v_itemunitprice": "0.05"
    },
    "paydata": {
        "order_id" : "20170829-alipay-3990527237343",
            "nonce" : "7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3",
            "payment_method" : "online_banking",
            "amount" : "1.00",
            "amount_cny" : "5.00",
            "currency" : "NZD",
            "product_name" : "test",
            "organisation_id": 18,
            "org_name" : "Latipay",
            "user_id" : "U000000051",
            "user_name" : "Latipay test",
            "wallet_id" : "W000000037",
            "wallet_name" : "aud01",
            "qr_code" : "https://qr.alipay.com/bax03286h4vlfpxldgwq4035",
            "currency_rate" : "5.29930",
            "merchant_reference" : "dsi39ej430sks03",
            "signature":"25e6e72cc6sdfecger95713afb101015aasdf3ca5faf3sdeer851f9cb7fb008a"
    },
    "gateway_url" : "https://pay.yizhifubj.com/customer/gb/pay_bank_utf8.jsp""
}
```

| Name  | Type  | Description | 
|------------- |---------------| -------------| 
| code |  Integer|  The reponse code of payment, 0 or error code.|
| message|  String|   The reponse message of transaction interface.|
| gatewaydata|  Object |  Merchant should submit gateway data to gateway url to process the transaction. |
| paydata | Object|   This field is used to display the transaction detail. |
| gateway_url|  String|   Merchant should submit gateway data to this url to process the transaction.|


`paydata` parameters

| Name  | Type  | Description | 
|------------- |---------------| -------------| 
| order_id|   String|   A unique transaction identifier generated by Latipay. | 
| nonce|  String|   A unique transaction nonce generated by Latipay. | 
| payment_method|   String|   Payment method options are wechat, alipay, or onlineBank.| 
| amount|   String|   A decimal amount.| 
| amount_cny|   String|   A decimal amount.| 
| currency |  String| 
| product_name |  String|   The name of the product or service being sold.  | 
| organisation_id|  Integer|  The merchant id which is used to process the transaction.| 
| org_name|   String|   The merchant's name| 
| user_id|  String|   The user account which is used to process the transaction. |
| user_name|  String|   The user account's name |
| wallet_id | String|   The user wallet account which is used to process the transaction.|
| wallet_name|  String|   The wallet account's name |
| qr_code|  String|   The QR code is generate by Latipay or third gateway. |
| currency_rate|  String |  The rate which is used to the transaction. |
| merchant_reference|   String  | A field for identifying your transaction.|
| signature | String |  The SHA-256 HMAC API signature. |

#### SHA-256 HMAC Signature
Rearrange parameters in the `paydata` set alphabetically (except `signature` and other parameters with value of null or empty string) And connect rearranged parameters with &：

```
message: amount=1.00&amount_cny=5.00&currency=NZD&currency_rate=5.29930&merchant_reference=dsi39ej430sks03&nonce=7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3&order_id=20170829-alipay-3990527237343&organisation_id=18&org_name=Latipay&payment_method=alipay&product_name=test&qr_code=https://qr.alipay.com/bax03286h4vlfpxldgwq4035&type=Online&user_id=U000000051&wallet_id=W000000037&wallet_name=aud01
secret: api_key
```