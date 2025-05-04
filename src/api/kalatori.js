import axios from 'axios';

const getKalatoriApi = () => axios.create({
  baseURL: process.env.REACT_APP_KALATORI_URL,
});

export const createPayment = async ({
  amount, orderId, callback,
}) => {
  const { data, status, statusText } = await getKalatoriApi().post(`/v2/order/${orderId}`, {
    amount: parseFloat(amount),
    callback,
    currency: 'LLD',
  });
  if (status >= 400) {
    throw statusText;
  }
  return data;
};

export const checkPayment = async ({
  paymentAccount,
}) => {
  const { data, status, statusText } = await getKalatoriApi().post(`/public/v2/payment/${paymentAccount}`);
  if (status >= 400) {
    throw statusText;
  }
  return data;
};
