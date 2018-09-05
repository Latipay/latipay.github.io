---
title: Merchant Hosted Offline/Hardware
type: v2_cn
order: 3
---

[在线测试API](http://doc.latipay.net/api-console/merchant-host.html)

<p class="tip">1. 集成Latipay API需要提前准备好Wallet ID, User ID 和 API key。 <a href="https://merchant.latipay.net/account" target="__blank">Latipay Merchant Portal</a> > Account > Show hidden values；
2. 对应的Wallet ID需要事先开通alipay，wechat或者onlineBank权限；
3. 请勿泄漏api_key；
4. 测试时可以支付最小金额$0.01。</p>

这个API支持返回二维码图片和订单信息

## 支持的支付方式

* 支付宝
* 微信支付


## 支付流程图

支付宝或者微信支付
![](/images/merchant_hosted_offline_wechat_alipay.jpg)
---

## 支付场景

支付宝
![](/images/merchant_hosted_offline_alipay.png)

---
微信支付
![](/images/merchant_hosted_offline_wechat.png)

---

## API 列表


### 1. 下单
```
POST https://api.latipay.net/v2/transaction
Content-Type: application/json;charset=UTF-8
```

[在线测试API](http://doc.latipay.net/api-console/merchant-host.html?api=/v2/transaction)

Demo

```
curl \
-X POST \
-H "Content-Type: application/json;charset=UTF-8" \
-d '{"signature":"14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3","wallet_id":"W00000001","amount":"120.00","user_id":"U000334333","merchant_reference":"dsi39ej430sks03","return_url":"","callback_url":"https://merchantsite.com/confirm","ip":"122.122.122.1","version":"2.0","product_name":"Pinot Noir, Otago","payment_method":"alipay","host_type" :"1"}' \
https://api.latipay.net/v2/transaction
```

#### 参数

| 字段  | 类型  | 描述 | 可选 |
|------------- |---------------| -------------| -------------|
| user_id | String | 商户账号用户 id | No |
|wallet_id | String | 商户账号wallet id | No
|payment_method | String | 支付方式 `wechat`, `alipay`, or `onlineBank` | No
|amount | String | 支付金额 | No
|return_url | String | 支付完成后浏览器继续加载的地址 | No
|callback_url | String | 支付完成后异步通知地址 | No
|signature | String | 参数签名，算法为SHA-256 HMAC | No
|merchant_reference | String | 商户订单号 | No
|ip | String | 客户端ip | No
|version | String | 版本号 `"2.0"` | No
|product_name | String | 订单产品标题 | No
| host\_type| String | 值必须为`"1"`， 支付接口会返回一张二维码图片（Base64格式） | No

#### 参数例子

```json
{
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
  "wallet_id": "W00000001",
  "amount": "120.00",
  "user_id": "U000334333",
  "merchant_reference": "dsi39ej430sks03",
  "return_url": "",
  "callback_url": "https://merchantsite.com/confirm",
  "ip": "122.122.122.1",
  "version": "2.0",
  "product_name": "Pinot Noir, Otago",
  "payment_method": "alipay",
  "host_type" : "1"
}
```

#### 参数 SHA-256 HMAC 签名 [在线签名](https://jsfiddle.net/tonnyLTP/wj36tey4/45/)

将所有参数按字母表顺序从小到大排序（去掉其中值为null和空字符串的项），然后以key=value和&形式拼接，最后加上api_key

JS代码
```
Object.keys(data)
  .filter(item => data[item] != null && data[item] != undefined && data[item] !== '')
  .sort()
  .map(item => `${item}=${data[item]}`)
  .join('&')
  .concat(api_key)
```

#### 签名例子

```
待签名文本: amount=120.00&callback_url=https://merchantsite.com/confirm&host_type=1&ip=122.122.122.1&merchant_reference=dsi39ej430sks03&payment_method=alipay&product_name=Pinot Noir, Otago&user_id=U000334333&version=2.0&wallet_id=W00000001111222333
密钥: 111222333

签名结果: 14b8268bd86e1815c192debb1d13a16ab1fe008f49e57eea5d64aaf111a8ed67
```

#### 请求结果
| 字段  | 类型  | 描述 |
|------------- |---------------| -------------|
|host_url	| 	String	| 	供浏览器加载的url，使用url和nonce可以完成下一步支付
|nonce	| 	String	| 	订单的唯一编号
|signature	| String	| 服务器端签名，算法为SHA-256 HMAC

```json
{
  "host_url": "https://api.latipay.net/merchanthosted/gatewaydata",
  "nonce": "7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3",
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
}
```

#### signature 服务器端签名
服务器端返回结果前，会对nonce + host_url加密，商户端需要进行验证，以保证该请求的合法性

```
待签名文本: nonce + host_url
密钥: api_key
```

### 2. 支付

加载以下地址继续支付订单

```
{host_url}/{nonce}
```

#### 例子

```
https://api.latipay.net/merchanthosted/gatewaydata/7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3
```

#### 结果

| 字段  | 类型  | 描述 |
|------------- |---------------| -------------|
|code | Integer | 0 表示接口请求成功
|message | String | 接口出错时附加的信息
|data | Object | 包含二维码和订单信息

* `data`包含的数据

| 字段  | 类型  | 描述 |
|------------- |---------------| -------------|
| order_id | String | Latipay订单的唯一编码 |
| nonce | String | Latipay订单的临时唯一编码 |
| payment_method | String | 支付方式，值为`alipay` 或者 `wechat` |
| amount | String | 支付金额 |
| amount_cny | String | 支付人民币金额 |
| currency | String | 支付货币 |
| product_name | String | 购买的产品名称 |
|organisation_id | Integer | 商户编码 |
|org_name | String | 商户名称 |
|user_id | String | 商户的用户id |
|user_name | String | 商户用户名 |
|wallet_id | String | 用户付款到该账号下 |
|wallet_name | String | 账号名称 |
|qr_code | String | 二维码图片（Base64格式） |
|qr_code_url | String | 二维码文本 |
|currency_rate | String | 当前的汇率 |
| merchant_reference | String | 商户系统中订单的唯一编码 |
|signature | String | 接口参数签名 |

#### 例子

```json
{
    "code": 0,
    "message": "SUCCESS",
    "data": {
        "order_id": "20180112000003",
        "nonce": "fd270820180112103849a19380c7300c425898780b3d0b1fbc",
        "payment_method": "wechat",
        "amount": 0.01,
        "amount_cny": 0.05,
        "currency": "AUD",
        "product_name": "产品中文",
        "organisation_id": 695,
        "organisation_name": "126Emai",
        "user_id": "U000000266",
        "user_name": "04_oliver",
        "wallet_id": "W000000329",
        "wallet_name": "AUD_01",
        "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAEzUlEQVR42u3dS27cQAwE0Ln/pZMTGDBgDVlFPQLZaWBJzadFpT+ff0qpH+vjFSgFiFKAKAWIUoAoBYhS3UA+n0/Mv18/0C9/2/hsf3nev7yDrd8mvHtAAAEEEEAAAQQQQAABBJBoICPJwR9e9MSAPP1sE8+7dS+NfQUIIIAAAggggAACCCCAAFIN5Olm27ru6SZPSrEm7iUpaQQEEEAAAQQQQAABBBBAAAEkAMiV6SJJCV06akAAAQQQQAABBBBAAAEEEECKUqzGaSAT0za2ki1AAAEEEEAAAQQQQAABBBBAvgjkbS9w4u+mY7UeBBBAAAEEEEAAAQQQQAABJABI0lQO1925ztajgLgOEEBcBwggrgMEENcB8uIzCtPXYEw821bKVtUngAACCCCAAAIIIIAAAgggbUAm1iRcnlay1ZTpiWTChwgQQAABBBBAAAEEEEAAASQaSOMRBhO/3RrM9CMWJhK6b94LIIAAAggggAACCCCAAAJINJCkZCsJ3JWdFbeuSz2yARBAAAEEEEAAAQQQQAABpA5IelpzZcdEzfv8cwACCCCAAAIIIIAAAggggNQAedsB91tp0uUUq71fAAEEEEAAAQQQQAABBBBAYoBsJTNJCdMEhulk5hquqJgXEEAAAQQQQAABBBBAAAFk8n/SJxKIK03euDviFq7UzTsAAQQQQAABBBBAAAEEEEBigEwnBs2JS2MTbR1/kJR6AgIIIIAAAggggAACCCCA1AC5stlB+ll8SSnblaTsTMwLCCCAAAIIIIAAAggggADSkjCl7/jXCH0rGdxCAwgggAACCCCAAAIIIIAAAkjANIut9OzxAQxaT5M01eRMigUIIIAAAggggAACCCCAAJLY0Fs79F1pyq0mb0/UAAEEEEAAAQQQQAABBBBAXgVkK4naevlX1mUkJXTfvD9AAAEEEEAAAQQQQAABBJAYIJeTisvJVuN7OXM+CCCAAAIIIIAAAggggAACyCSQLUjpzTa9mcB24yc070TyBggggAACCCCAAAIIIIAAEgMkaeAaz/tLeo705K0yxQIEEEAAAQQQQAABBBBAAJkEkv7yG481SGqE9F0jE5I8QAABBBBAAAEEEEAAAQSQGCBbaU1SqtOY/mjy554NEEAAAQQQQAABBBBAAAEkBsjW1Iatw+ev7CCYvv6laVoOIIAAAggggAACCCCAAAJIDJD0Bkw/B7FxLUn6zooTfQoIIIAAAggggAACCCCAABIJ5PIajK2kDLiuMQIEEGMECCDGCBBAAAEEEEDqUqytShrg9CZKnxoy8YEGBBBAAAEEEEAAAQQQQACpBrI1wG/bxKBx3U16yvbY2AACCCCAAAIIIIAAAggggCQDSUqntqYxSMDyU6yn7g8QQAABBBBAAAEEEEAAAaQOSOOZgt98qZNNnv7RSf+IAQIIIIAAAggggAACCCCAAFIEZGKaReOUmfRjF9bOKAQEEEAAAQQQQAABBBBAAHkrkMYzBSfSs63pIlIsQAABBBBAAAEEEEAAAQSQACATDdiYuDQmOEnnTQICCCCAAAIIIIAAAggggAAynEpc3lBhKxncSveSUrGn7gUQQAABBBBAAAEEEEAAASQGiFJvL0CUAkQpQJQCRClAlAJEKUCUqq7/Vhpz81YibhcAAAAASUVORK5CYII=",
        "qr_code_url": "weixin://wxpay/bizpayurl?pr=ZObbdsW",
        "currency_rate": "5.13710",
        "merchant_reference": "",
        "signature": "cf56a6bbe1aa42e1c273c4d7fe6233f70a6b10ba39e88938b13469f3315e4c41"
    }
}
```

#### SHA-256 HMAC签名

将`data`中的数据按照字母顺序排列（去掉`signature`和其他null值或空字符串值）然后用`&`拼接

```
待签名文本: amount=1.00&amount_cny=5.00&currency=NZD&currency_rate=5.29930&merchant_reference=dsi39ej430sks03&nonce=7d5a88119354301ad3fc250404493bd27abf4467283a061d1ed11860a46e1bf3&order_id=20170829-alipay-3990527237343&organisation_id=18&org_name=Latipay&payment_method=alipay&product_name=test&qr_code=https://qr.alipay.com/bax03286h4vlfpxldgwq4035&type=Online&user_id=U000000051&wallet_id=W000000037&wallet_name=aud01
密钥: api_key
```

---

### 3. 支付结果异步通知

此接口为商户端后台提供，在支付完成后，Latipay服务器每隔30秒调用该接口，直到收到“sent”文本，在调用该接口时，Latipay会传入支付结果信息。


```
POST 商户端的 callback_url
Content-Type: application/x-www-form-urlencoded
```

<p class="tip">返回的请求头状态必须为 <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200">200</a>，请求的body必须是文本：`send`</p>

#### 参数

| 字段  | 类型  | 描述 |
|------------- |---------------| -------------|
|merchant_reference | String | 商户订单id |
|order_id|	String|	Latipay交易id|
|currency | String | 支付币种 |
|amount | String | 支付金额 |
|payment_method | String | 支付方式 |
|status | String | 支付状态，值可能为: pending, paid, 或 failed. |
|pay_time  | String  | 支付时间，北京时间 `UTC/GMT+08:00`|
|signature | String | 参数签名，算法为SHA-256 HMAC |

#### 参数例子

```json
{
  "merchant_reference": "dsi39ej430sks03",
  "order_id": "2017232323345672",
  "currency": "AUD",
  "amount": "120.00",
  "payment_method": "wechat",
  "status": "paid",
  "pay_time": "2017-07-07 10:53:50",

  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3"
}
```


#### SHA-256 HMAC签名
商户端后台需要验证该签名

```
待签名文本: merchant_reference + payment_method + status + currency + amount
密钥: api_key
```

#### 结果
Latipay服务器期望收到此文本

```
sent
```

### 4. 支付完成后（成功或失败）浏览器重定向
<p class="tip">此功能仅支持PC浏览器或者微信支付。支付宝App扫码支付成功后，支付宝App并不会跳转。</p>

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
待签名文本: merchant_reference + payment_method + status + currency + amount
密钥: api_key
```


### 5. 查询支付
向Latipay服务器查询订单支付信息，merchant_reference为商户端订单id。

```
GET https://api.latipay.net/v2/transaction/{merchant_reference}
```

[在线测试API](http://doc.latipay.net/api-console/merchant-host.html?api=/v2/transaction/{merchant_reference})

#### 参数
| 字段  | 类型  | 描述 |
|------------- |---------------| -------------|
|user_id | String | 商户账号用户 id |
|signature | String	|参数签名，算法为SHA-256 HMAC

#### SHA-256 HMAC 签名

```
待签名文本: merchant_reference + user_id
密钥: api_key
```

#### 结果

| 字段  | 类型  | 描述 |
|------------- |---------------| -------------|
|merchant_reference  | String  | 商户订单id  |
|currency  | String  | 支付币种  |
|amount  | Number  | 支付金额  |
|payment_method  | String  | 支付方式，可能值：alipay, wechat, onlineBank  |
|status  | String  | 支付状态，可能值: pending, paid, 或 failed  |
|pay_time  | String  | 支付时间，北京时间 `UTC/GMT+08:00`|
|signature  | String  | 服务器端签名，算法为SHA-256 HMAC  |

#### 参数例子

``` json
{
  "signature": "14d5b06a2a5a2ec509a148277ed4cbeb3c43301b239f080a3467ff0aba4070e3",
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

#### 例子

```
加密文本: dsi39ej430sks03alipaypaidNZD120.00
密钥: 111222333
signature: 840151e0dc39496e22b410b83058b4ddd633b786936c505ae978fae029a1e0f1
```
