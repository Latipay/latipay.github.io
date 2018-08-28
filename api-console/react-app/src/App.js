import React, { Component } from 'react';
import { Row, Col } from 'antd';

import './App.css';
import apisConfig from './apis-config.json';
import apisMiniAppConfig from './apis-config-miniapp.json';
import apisInvoiceConfig from './apis-config-invoice.json';
import apisMerchantHostConfig from './apis-config-merchant-host.json';
import apisOnlineConfig from './apis-config-online.json';
import apisBarcodeConfig from './apis-config-barcode.json';

import Slide from './Slide';

import APIForm from './APIForm';
import { newSignature, initialValue } from './util';

function apis(props) {
  const { pathname } = props.location || {};

  const map = {
    '/': apisConfig,
    '/miniapp': apisMiniAppConfig,
    '/invoice': apisInvoiceConfig,
    '/merchant-host': apisMerchantHostConfig,
    '/online': apisOnlineConfig,
    '/barcode': apisBarcodeConfig
  };

  return map[pathname] || apisConfig;
}

const hosts = {
  prod: 'https://api.latipay.net',
  staging: 'https://api-staging.latipay.net'
};

class App extends Component {
  constructor(props) {
    super(props);

    let current = '0_0';

    const search = (window.location || {}).search;
    const query = {};
    search.split('&').forEach(item => {
      if (item.indexOf('?') !== -1) {
        item = item.substr(1);
      }
      const a = item.trim('?').split('=');
      query[a[0]] = a[1];
    });

    const env = query.staging ? 'staging' : 'prod';

    const whichApi = query.api;
    if (whichApi) {
      const map = {};
      apis(props).menus.forEach((item, index0) => {
        [...item.apis].reverse().forEach((api, index1) => {
          map[api.url] = `${index0}_${index1}`;
        });
      });

      const c = map[whichApi];
      if (c) {
        current = c;
      }
    }

    const { api, account } = this.getApiAndAccount(current, env);

    const allValues = {};
    api.parameters.forEach(item => {
      allValues[item.name] = initialValue(account, item.name, item.default);
    });

    const d = this.update(allValues, current, env);

    this.state = {
      current,
      env,
      message: d.message,
      curl: d.curl,
      signature: d.signature,
      allValues
    };
  }

  choseApi = e => {
    const current = e.key;

    const { env } = this.state;
    const { api, account } = this.getApiAndAccount(current, env);

    const allValues = {};
    api.parameters.forEach(item => {
      allValues[item.name] = initialValue(account, item.name, item.default);
    });

    const d = this.update(allValues, current, env);

    this.setState({
      ...this.update(allValues, current, env),
      allValues,
      current,
      message: d.message,
      curl: d.curl,
      signature: d.signature
    });
  };

  onValuesChange = allValues => {
    const { current, env } = this.state;
    this.setState({
      ...this.update(allValues, current, env)
    });
  };

  update = (allValues, current, env) => {
    const { api } = this.getApiAndAccount(current, env);

    //
    api.parameters.forEach(item => {
      const v = allValues[item.name];
      if (item.type === 'boolean' && v) {
        allValues[item.name] = v === 'true' ? true : false;
      }
    });
    ///

    const api_key = allValues.api_key || '';
    const { message, signature } = newSignature(allValues, api_key);

    const data = {
      ...allValues,
      signature
    };

    delete data.api_key;

    let parametersText = `'${JSON.stringify(data, null, 2)}'`;
    const urlContainsParameter =
      api.url === '/v2/transaction/{merchant_reference}';

    if (api.method === 'GET') {
      parametersText = Object.keys(data)
        .filter(item => {
          if (urlContainsParameter && item === 'merchant_reference') {
            return false;
          }
          return data[item] !== undefined;
        })
        .map(key => `${key}=${data[key]}`)
        .join('&');
    }

    const host = hosts[env];

    //
    let curl = `curl -H 'Content-Type: application/json' -X ${
      api.method
    } ${host}${api.url} -d ${parametersText}`;

    if (api.method === 'GET') {
      if (urlContainsParameter) {
        if (data.merchant_reference) {
          curl = `curl -X ${api.method} ${host}/v2/transaction/${
            data.merchant_reference
          }?${parametersText}`;
        } else {
          curl = '';
        }
      } else {
        curl = `curl -X ${api.method} ${host}${api.url}?${parametersText}`;
      }
    }

    //
    return {
      allValues,
      message,
      signature,
      curl
    };
  };

  getApiAndAccount(current, env) {
    const arr = current.split('_');
    const menu = apis(this.props).menus[parseInt(arr[0], 10)];
    const api = menu['apis'][parseInt(arr[1], 10)];

    const account = apis(this.props).account[env];

    return { api, account, menuTitle: menu.title };
  }

  onClick = () => {
    window.location.href = 'https://doc.latipay.net/v2';
  };

  render() {
    const { current, env } = this.state;
    const { api, account, menuTitle } = this.getApiAndAccount(current, env);

    const { message, signature, curl, allValues } = this.state;

    const title = menuTitle + ' - ' + api.title;

    return (
      <div>
        <div id="header">
          <a id="logo" onClick={this.onClick}>
            <img src="https://doc.latipay.net/images/logo.svg" alt="logo" />
          </a>
        </div>
        <Row>
          <Col span={5}>
            <Slide
              apis={apis(this.props)}
              choseApi={this.choseApi}
              current={this.state.current}
            />
          </Col>
          <Col className="right" span={19}>
            <APIForm
              title={title}
              api={api}
              account={account}
              curl={curl}
              env={env}
              message={message}
              signature={signature}
              allValues={allValues}
              onValuesChange={this.onValuesChange}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
