---
title: Introduction
type: v2
order: 1
---

### System Overview

<a href="https://www.latipay.net">Latipay</a> system is hosted in <a href="https://www.alibabacloud.com">AliCloud</a> which is China’s largest public cloud service provider and is the fourth largest provider worldwide. AliCloud’s international operations are registered in Singapore, Dubai, Frankfurt, Hong Kong, London, New York, Paris, San Mateo, Seoul, Singapore, Sydney and Tokyo, which ensures Latipay’s service available worldwide. Users can have the best payment experience through Latipay platform.

AliCloud offers high-performance, elastic computing power in the cloud. Services including data storage, relational databases, big-data processing, anti-DDoS protection and content delivery networks (CDN) which provide Latipay a stable and reliable environment.

AliCloud ensures Latipay’s security and privacy of data through their comprehensive security capabilities. Rigorous physical security measures safeguard their datacenters, and advanced logical security technologies prevent unauthorized access to their networks.

AliCloud empowers Latipay to deploy globally on a trusted and high-performance cloud network. AliCloud’s BGP multi-line network and distributed cloud operating system provides highly available infrastructure.

Based on the services provided by AliCloud, Latipay utilize ECS, RDS, Server Load Balancer, Redis and Mongo DB to ensure our system can perform to its best possible performance in terms of latency and security. The largest volume of transactions via Latipay server is 1000/s.

### Summary

The Latipay 2.0 interface is an independent Hosted Payments Page (HPP) solution provided by Latipay. The HPP provides a solution for capturing Wechat/ Alipay and 19 main Chinese banks information securely without exposing the merchant to sensitive financial data. The Latipay Hosted Ecommerce API provides merchants with a secure and versatile solution for `online` and `in-store` payments. Redirecting users to a Latipay Hosted Payment Page to complete the payment. A real-time confirmation redirection of payment from Latipay will be displayed on the merchant’s website. At the same time, a notification will be implemented to the merchant to ensure that confirmation of payments have been sent to an allocated callback_url in less than 30s. Merchants also can track payment status through the Latipay payment query API.


