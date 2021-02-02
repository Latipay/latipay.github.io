---
title: Alipay Mini App Online Payment
type: v2
order: 6
---

<p class="tip">Tips: Get your `Wallet ID`, `User ID` and `API key` via <a href="https://merchant.latipay.net" target="__blank">Latipay Merchant Portal</a> > WALLETS > ACTION(on the right side of the corresponding wallet) > Settings > Integration parameters
Tips: Create a minimum amount product (e.g. $ 0.01 NZD/AUD) for testing.</p>

## API Details

### 1 - Latipay Transaction Interface
Make payment order with this api in your web server.

```
POST https://api.latipay.net/v2/minialipay
Content-Type: application/json;charset=UTF-8
```


* <strong>Attributes</strong>

| Name  | Type  | Description | Optional |
|------------- |---------------| -------------| -------------|
|user_id | String | The Latipay user account which is using for processing the transactions. | NO |
|wallet_id | String | The wallet ID that using for online transactions.  | NO
|amount | String | A decimal amount. | NO
|callback_url | String | Merchant web server's URL that the payment result will send to. | NO
|merchant_reference | String | A `unique id` identifying the order in Merchant's system. | NO
|ip | String(16) | The customer's IPv4 address | NO
|version | String | The latest version of the Latipay platform which must be `"2.0"` | NO
|product_name | String | The name of the product or service being sold. | NO
|signature | String | The `SHA-256 HMAC` API signature. | NO


Example

  ```json
  {
    "user_id": "U000334333",
    "wallet_id": "W00000001",
    "amount": "120.00",
    "payment_method": "alipay",
    "callback_url": "https://merchantsite.com/confirm",
    "merchant_reference": "dsi39ej430sks03",
    "ip": "122.122.122.1",
    "version": "2.0",
    "product_name": "Pinot Noir, Otago",

    "signature": "1f8e75dd34fc5ca7b478772efdb6fa9e1a5c89e8e0412ccde81912fc16e2ed07",
  }
  ```

* <strong>SHA-256 HMAC Signature</strong>

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
message: amount=120.00&callback_url=https://merchantsite.com/confirm&ip=122.122.122.1&merchant_reference=dsi39ej430sks03&product_name=Pinot Noir, Otago&user_id=U000334333&version=2.0&wallet_id=W00000001111222333
secret(your api_key): 111222333

signature: 1f8e75dd34fc5ca7b478772efdb6fa9e1a5c89e8e0412ccde81912fc16e2ed07
```

* <strong>Response</strong>

```json
{
  "code": 0,
  "message": "SUCCESS",
  "messageCN": "操作成功",
  "gatewaydata": {
    "service": "create_forex_trade_wap",
    "partner": "2088121611339960",
    "_input_charset": "UTF-8",
    "sign_type": "MD5",
    "sign": "e2d8f08e5b468ee40e076f928665f662",
    "notify_url": "https://api-staging.latipay.net/notify/alipay",
    "return_url": "https://api-staging.latipay.net/notify/sync/alipay",
    "subject": "ticket",
    "body": "5399",
    "out_trade_no": "S2020072900000036",
    "currency": "NZD",
    "total_fee": "0.01",
    "supplier": "Latipay Test",
    "secondary_merchant_id": "W000001685",
    "secondary_merchant_name": "Latipay Test",
    "secondary_merchant_industry": "5399",
    "product_code": "NEW_WAP_OVERSEAS_SELLER",
    "app_pay": "Y"
  },
  "paydata": {
    "orderId": "S2020072900000036",
    "customerOrderId": "EbrZiWAkZ2",
    ...
  },
}
```

### 2 - Alipay mini app pay
Build a query string with `gatewaydata` in the above response, and call `my.tradePay` method with `orderStr` in Alipay mini app project.

```js
const gatewaydata = data.gatewaydata

const orderStr = Object.keys(gatewaydata).map(item => `${item}=${gatewaydata[item]}`).join("&")

my.tradePay({
  orderStr,
  success: res => {
    console.log(res.resultCode, res);

    if (res.resultCode === 9000) { //payment success

    }else { //payment not success

    }
  },
  fail: res => {
    console.log(res.resultCode, res);

  }
});
```

#### resultCode

Result Code refer to https://opendocs.alipay.com/mini/api/openapi-pay

| Code  | Description  | Solution |
|------------- |---------------| -------------|
|9000|订单处理成功|-|
|8000|正在处理中。支付结果未知（有可能已经支付成功）。|请通过 alipay.trade.query 接口查询订单的支付状态。|
|4000|订单处理失败。|检查订单。|
|6001|用户中途取消。|请用户重新签约。|
|6002|网络连接出错。|检查网络连接后重试。|
|6004|处理结果未知（有可能已经成功）。|请通过 alipay.trade.query 接口查询订单的支付状态。
|99|iOS 客户端用户点击忘记密码导致快捷界面退出。|-|

### 3 - Payment Result Asynchronous Notification
[Please refer to this api.](https://doc.latipay.net/v2/latipay-hosted-online.html#3-Asynchronous-Notification)

### 4 - Payment Result Interface
[Please refer to this api.](https://doc.latipay.net/v2/latipay-hosted-online.html#5-Payment-Result-Interface)

### 5 - Refund
[Please refer to this api.](https://doc.latipay.net/v2/latipay-hosted-online.html#6-Refund)
