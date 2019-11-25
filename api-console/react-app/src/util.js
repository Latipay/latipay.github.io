const CryptoJS = require('crypto-js');

function makeid() {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = {
  newSignature: (payload, api_key) => {
    const msg = Object.keys(payload)
      .filter(
        item =>
          payload[item] !== undefined &&
          payload[item] !== null &&
          payload[item] !== '' &&
          item !== 'api_key' &&
          item !== 'signature'
      )
      .sort()
      .map(item => `${item}=${payload[item]}`)
      .join('&');

    const message = msg + api_key;

    var signature = CryptoJS.HmacSHA256(message, api_key).toString();
    return {
      message,
      signature
    };
  },
  initialValue: (account, id, defaultValue) => {
    const v = account[id];
    if (v) {
      return v;
    }

    if (defaultValue === '$now') {
      return parseInt(new Date().getTime() / 1000, 10);
    } else if (defaultValue === '$randomId') {
      return makeid();
    }

    return defaultValue;
  }
};
