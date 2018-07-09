// client api
import axios from 'axios';

const host = '';

export const makeTransaction = async payload => {
  const { data } = await axios.post(host + '/v2/transaction', payload);
  if (data.code === 0) {
    return data;
  } else {
    alert(data.message);
  }
};

export const getRate = async payload => {
  const rep = await axios.get(host + '/v2/all_rate', {
    params: payload
  });
  return rep;
};

export const postRefund = async payload => {
  const rep = await axios.post(host + '/refund', payload);
  return rep;
};

export const postInvoiceRefund = async payload => {
  const rep = await axios.post(host + '/v2/invoice/refund', payload);
  return rep;
};

export const postInvoice = async payload => {
  const rep = await axios.post(host + '/v2/invoice', payload);
  return rep;
};

export const getInvoice = async payload => {
  const rep = await axios.get(host + '/v2/invoice', {
    params: payload
  });
  return rep;
};

export const getInvoices = async payload => {
  const resp = await axios.get(host + '/v2/invoices', {
    params: payload
  });
  return resp.data;
};

export const deleteInvoice = async payload => {
  const rep = await axios.delete(host + '/v2/invoice', {
    data: payload
  });
  return rep;
};
