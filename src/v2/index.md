---
title: Introduction
type: v2
order: 1
---

Welcome! It looks like you are ready to connect with Latipay. This reference documentation explains how it can be done using Latipay’s API. Once setup, you’ll be tapping into millions of Chinese consumers who prefer local payment methods.

We’re constantly updating our payment methods but would love to hear your suggestions on how we could improve our platform.

### System Overview

<a href="https://www.latipay.net">Latipay</a> system is hosted in <a href="https://www.alibabacloud.com">AliCloud</a> which is China’s largest public cloud service provider and is the fourth largest provider worldwide. AliCloud’s international operations are registered in Hong Kong, New York, Singapore, Sydney, Tokyo etc, which ensures Latipay’s service available worldwide. Users can have the best payment experience through Latipay platform.

AliCloud offers high-performance, elastic computing power in the cloud. Services including data storage, relational databases, big-data processing, anti-DDoS protection and content delivery networks (CDN) which provide Latipay a stable and reliable environment.

AliCloud ensures Latipay’s security and privacy of data through their comprehensive security capabilities. Rigorous physical security measures safeguard their datacenters, and advanced logical security technologies prevent unauthorised access to their networks.

AliCloud empowers Latipay to deploy globally on a trusted and high-performance cloud network. AliCloud’s BGP multi-line network and distributed cloud operating system provides highly available infrastructure.

Based on the services provided by AliCloud, Latipay utilise ECS, RDS, Server Load Balancer, Redis and Mongo DB to ensure our system can perform to its best possible performance in terms of latency and security. The largest volume of transactions via Latipay server is 1000/s.

### Summary

The Latipay 2.0 interface is an independent Hosted Payments Page solution provided by Latipay. The HPP provides a solution for capturing WeChat/ Alipay securely without exposing the merchant to sensitive financial data. The Latipay Hosted API provides merchants with a secure and versatile solution for `online` and `offline` payments.

For example, after redirecting users to a Latipay/Merchant Hosted Payment Page to complete the payment. A real-time confirmation redirection of payment from Latipay will be displayed on the merchant’s website or offline device. At the same time, a notification will be implemented to the merchant to ensure that confirmation of payments have been sent to an allocated callback_url in less than `30s`. Merchants also can track payment status through the Latipay payment query Interface.

### Domain

#### Production Environment
https://merchant.latipay.net

#### Request And Parameters
Request for payment Interface is using `POST` method. Request for Query Interface is using `GET` method. All requests including Request Entity are in JSON format. Accept in the request header shall be set to `application/json`.

System charset is UTF-8.

There are 3 groups of parameters: Path Variable, Query Param, JSON Entity:

* Path Variable: included in the path as patterns
* Query Param: parameters after the URI '?' symbol and formatted like key=value
* JSON Entity: only used in PUT/POST requests

Our API server will return 200 in HTTP header if the request has successfully reached the server, which does not indicate the success or failure of the actual operation. All responses in JSON format will include a `code` field which contains the operation result. The value `0` indicates that the operation was successful while other values shows the type of error that happened. Response will also contain a `message` field for detailed error message.
