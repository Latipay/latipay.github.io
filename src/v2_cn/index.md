---
title: Latipay Hosted
type: v2_cn
order: 1
---

## 支付场景

#### 支付宝

![](http://latipay.net/wp-content/uploads/images/Alipay-latipayhosted.png)

---

#### 微信

![](http://latipay.net/wp-content/uploads/images/Wechat-latipayhosted.png)

---

#### 在线银行

![](http://latipay.net/wp-content/uploads/images/Onlinebank-latipayhosted.png)

---

#### 电商网站

![](http://latipay.net/wp-content/uploads/images/checkout_show.png)

## 接口对接

* 对接方需要先获得user_id，wallet_id和api_key
* 对应的wallet_id需要事先开通alipay，wechat或者onlineBank权限
* 请勿泄漏api_key


## 接口列表

### 1. 下单
```
POST https://api.latipay.net/v2/transaction
```

#### 参数


| 字段  | 类型  | 描述 | 可选 |
|------------- |---------------| -------------| -------------|
| user_id | String | 商户账号用户 id | No |
|wallet_id | String | 商户账号wallet id | No
|payment_method | String | 支付方式 wechat, alipay, or onlineBank | No
|amount | String | 支付金额 | No
|return_url | String | 支付完成后浏览器继续加载的地址 | No
|callback_url | String | 支付完成后异步通知地址 | No
|signature | String | 参数签名，算法为SHA-256 HMAC | No
|merchant_reference | String | 商户订单号 | No
|ip | String | 客户端ip | No
|version | String | 版本号 2.0 | No
|product_name | String | 订单产品标题 | No

#### 微信的额外参数

| 参数  | 结果 |
| -------------| ------| ------
| present\_qr = "1" | 使用该参数可以获取一个支持微信扫码支付的网页 |

#### 参数例子

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

#### 参数 SHA-256 HMAC 签名
```
待签名文本: user_id + wallet_id + amount + payment_method + return_url + callback_url
密钥: api_key
```

#### 签名例子

```
签名文本: U000000001W000000010.01alipayhttp://merchant.com/returnhttp://merchant.com/callback
密钥: 111222333

签名结果: 2367bcd9e9a2f9a547c85d7545d1217702a574b8084bbb7ae33b45a03a89983
```

#### 请求结果

```json
{
  "host_url": "https://pay.latipay.net/pay",
  "nonce": "7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3",
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
}
```

| 字段  | 类型  | 描述 |
|------------- |---------------| -------------|
|host_url	| 	String	| 	供浏览器加载的url，使用url和nonce可以完成下一步支付
|nonce	| 	String	| 	订单的唯一编号
|signature	| String	| 服务器端签名，算法为SHA-256 HMAC


#### signature 服务器端签名
服务器端返回结果前，会对nonce + host_url加密，商户端需要进行验证，以保证该请求的合法性

```
签名文本: nonce + host_url
密钥: api_key
```

### 2. 支付

浏览器加载以下地址可以继续支付订单

```
{host_url}/{nonce}
```

#### 例子

```
https://pay.latipay.net/pay/7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3
```

#### 不同参数，不同平台下支付方式会有差别

|  场景 | 支付平台  | 额外参数  | 结果
|------------- |---------------| -------------| ------| ------
| PC浏览器 |alipay |     |   跳转到支付宝二维码收银台网页|
| 手机浏览器 |alipay |     |   唤醒支付宝app完成支付|
| 支付宝内浏览器 |alipay |     |   支付宝app直接支付|
| 微信内浏览器 |wechat  | | 微信支付 |
|  |wechat  | present\_qr = "1" | 跳转到一个支持微信扫码支付的网页|
|  |onlineBank | 	| 跳转到一个支持输入银行卡信息的网页 |



### 3. 支付结果异步通知
此接口为商户端后台提供，在支付完成后，Latipay服务器每隔30秒调用该接口，直到收到“sent”文本，在调用该接口时，Latipay会传入支付结果信息。

```
POST 商户端的 callback_url
```

#### 参数		


| 字段  | 类型  | 描述 |
|------------- |---------------| -------------|
|merchant_reference | String | 商户订单id |
|currency | String | 支付币种 |
|amount | String | 支付金额 |
|payment_method | String | 支付方式 |
|status | String | 支付状态，值可能为: pending, paid, 或 failed. |
|pay_time | String | 支付时间 |
|signature | String | 参数签名，算法为SHA-256 HMAC |  

#### 参数例子

``` json
{
  "merchant_reference": "dsi39ej430sks03",
  "amount": "120.00",
  "currency": "NZD",
  "payment_method": "alipay",
  "pay_time": "2017-07-07 10:53:50",
  "status" : "paid",
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
}
```

#### SHA-256 HMAC签名
商户端后台需要验证该签名

```
签名文本: merchant_reference + payment_method + status + currency + amount
密钥: api_key
```

#### 结果
Latipay服务器期望收到此文本

```
sent
```

### 4. 同步回调
客户端支付完成后，会跳转到return_url，并传入以下参数


| 字段 | 类型  | 描述 |
|------------- |---------------| -------------|
|merchant_reference | String | 商户订单id |
|payment_method | String | 支付方式，可能值：alipay, wechat, onlineBank |
|status | String | 支付状态，可能值: pending, paid, 或 failed |
|currency | String | 支付币种 |
|amount | String | 支付金额 |
|signature | String	|服务器端签名，算法为SHA-256 HMAC

#### 例子

```
https://www.merchant.com/latipay?merchant_reference=dsi39ej430sks03&payment_method=alipay&status=paid&currency=NZD&amount=100.00&signature= 14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3
```

#### 服务器端 SHA-256 HMAC 签名
商户端前端可以考虑验证该签名

```
签名文本: merchant_reference + payment_method + status + currency + amount
密钥: api_key
```


### 5. 查询支付
向Latipay服务器查询订单支付信息，merchant_reference为商户端订单id。

```
GET https://api.latipay.net/v2/transaction/{merchant_reference}
```

#### 参数
| 字段  | 类型  | 描述 |
|------------- |---------------| -------------|
|user_id | String | 商户账号用户 id |
|signature | String	|参数签名，算法为SHA-256 HMAC

#### SHA-256 HMAC 签名

```
签名文本: merchant_reference + user_id
密钥: api_key
```

#### 结果

| 字段  | 类型  | 描述 |
|------------- |---------------| -------------|
|transaction_id  | String  | Latipay交易id  |
|merchant_reference  | String  | 商户订单id  |
|currency  | String  | 支付币种  |
|amount  | String  | 支付金额  |
|payment_method  | String  | 支付方式，可能值：alipay, wechat, onlineBank  |
|status  | String  | 支付状态，可能值: pending, paid, 或 failed  |
|pay_time  | String  | 支付时间，北京时间 |
|signature  | String  | 服务器端签名，算法为SHA-256 HMAC  |

#### 参数例子

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

#### signature 服务器端签名
服务器端返回结果前会对支付结果加密，商户端需要进行验证，以保证该请求的合法性。

```
加密文本: merchant_reference + payment_method + status + currency + amount
密钥: api_key
```
