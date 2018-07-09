import React from 'react';
import axios from 'axios';
import { newSignature, initialValue } from './util';
import Clipboard from 'react-clipboard.js';

import {
  Spin,
  Divider,
  Form,
  Input,
  Tooltip,
  Icon,
  Select,
  Button,
  InputNumber,
  message
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const hosts = {
  prod: 'https://api.latipay.net',
  staging: 'https://api-staging.latipay.net'
};

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);

    const data = {};
    props.api.parameters.forEach(item => {
      data[item.name] = initialValue(props.account, item.name, item.default);
    });

    this.state = {
      result: '',
      loading: false
    };
  }

  onCopied = () => {
    message.success('Copied');
  };

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const api = this.props.api;

        const { api_key, ...parameters } = values;

        const { signature } = newSignature(parameters, api_key);

        parameters.signature = signature;

        //
        api.parameters.forEach(item => {
          const v = parameters[item.name];
          if (item.type === 'boolean' && v) {
            parameters[item.name] = v === 'true' ? true : false;
          }
        });

        const { env = 'prod' } = this.props;

        this.setState({ loading: true });

        const config = {
          method: api.method,
          url: hosts[env] + api.url,
          headers: { 'Content-Type': 'application/json' }
        };

        if (api.method === 'GET') {
          config.params = parameters;
        } else {
          config.data = parameters;
        }

        axios(config)
          .then(res => {
            this.setState({
              result: JSON.stringify(res.data, null, 2),
              loading: false
            });
          })
          .catch(error => {
            this.setState({
              result: error.response.statusText,
              loading: false
            });
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 4
        }
      }
    };

    const api = this.props.api;

    const {
      message,
      signature,
      curl,
      allValues,
      account,
      title,
      env = 'prod'
    } = this.props;
    const { api_key } = allValues;
    const { result, loading } = this.state;

    const component = item => {
      if (item.condition_options) {
        const options = item.condition_options.map(item => item.name);
        return (
          <Select>
            {options.map(item => (
              <Option key={item.toString()} value={item}>
                {item.toString()}
              </Option>
            ))}
          </Select>
        );
      } else if (item.options) {
        return (
          <Select allowClear={true}>
            {item.options.map(item => (
              <Option key={item.toString()} value={item.toString()}>
                {item.toString()}
              </Option>
            ))}
          </Select>
        );
      } else if (item.type === 'number') {
        return <InputNumber precision={item.precision ? item.precision : 0} />;
      }

      return <Input disabled={item.disabled} placeholder={item.placeholder} />;
    };

    let link = '';
    try {
      const r = JSON.parse(result);
      if (r.host_url && r.nonce) {
        link = r.host_url + '/' + r.nonce;
      }
    } catch (e) {}

    return (
      <div className="form-container">
        <h2>{title}</h2>
        <p>
          <span style={{ fontWeight: 'bold' }}>{api.method}</span>{' '}
          {` ${hosts[env]}${api.url}`}
        </p>

        <Divider />
        <Form onSubmit={this.handleSubmit}>
          {api.parameters
            .filter(item => {
              const con = item.condition;
              if (con) {
                const key = Object.keys(con)[0];

                return allValues[key] === con[key];
              }

              return true;
            })
            .map(item => (
              <FormItem
                key={item.name}
                {...formItemLayout}
                label={
                  <span>
                    {item.name} &nbsp;
                    {item.tips && (
                      <Tooltip title={item.tips}>
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    )}
                  </span>
                }
              >
                {getFieldDecorator(item.name, {
                  rules: [
                    {
                      required: item.required,
                      message: `Please input your ${item.name}`
                    }
                  ],
                  initialValue: initialValue(account, item.name, item.default)
                })(component(item))}
              </FormItem>
            ))}

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>

            {loading && <Spin style={{ marginLeft: 20 }} />}
          </FormItem>
        </Form>

        <Divider />
        <div>
          <p>SHA 256 Signature</p>
          <pre>
            {`Message: ${message}
SecretKey: ${api_key ? api_key : ''}
Signature: ${signature ? signature : ''}`}
          </pre>
          <p>
            curl
            <span style={{ float: 'right' }}>
              <Clipboard
                data-clipboard-text={curl}
                className="btn-copy"
                onSuccess={this.onCopied}
              >
                <Icon type="copy" />Copy
              </Clipboard>
            </span>
          </p>
          <pre>{curl}</pre>
          <p>Result</p>
          <pre>{result}</pre>

          <p>
            <a href={link} target="__blank">
              {link}
            </a>
          </p>
        </div>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    props.onValuesChange(allValues);
  }
})(RegistrationForm);

export default WrappedRegistrationForm;
