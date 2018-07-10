import React, { Component } from 'react';
import { Row, Col } from 'antd';

import './App.css';
import apis from './apis-config.json';
import Slide from './Slide';

import APIForm from './APIForm';
import { newSignature, initialValue } from './util';

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
      apis.menus.forEach((item, index0) => {
        item.apis.reverse().forEach((api, index1) => {
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

    let parameters = `'${JSON.stringify(data, null, 2)}'`;
    if (api.method === 'GET') {
      parameters = Object.keys(data)
        .filter(item => data[item] !== undefined)
        .map(key => `${key}=${data[key]}`)
        .join('&');
    }

    const host = hosts[env];

    //
    let curl = `curl -H 'Content-Type: application/json' -X ${
      api.method
    } ${host}${api.url} -d ${parameters}`;

    if (api.method === 'GET') {
      if (api.url.indexOf("/v2/transaction/$merchant_reference") !== -1) {
        if (data.merchant_reference) {
          const newPara = parameters.replace(
            `merchant_reference=${data.merchant_reference}`,
            ''
          );
          curl = `curl -X ${api.method} ${host}/v2/transaction/${
            data.merchant_reference
          }?${newPara}`;
        } else {
          curl = '';
        }
      } else {
        curl = `curl -X ${api.method} ${host}${api.url}?${parameters}`;
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
    const menu = apis.menus[parseInt(arr[0], 10)];
    const api = menu['apis'][parseInt(arr[1], 10)];

    const account = apis.account[env];

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
            <Slide choseApi={this.choseApi} current={this.state.current} />
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
