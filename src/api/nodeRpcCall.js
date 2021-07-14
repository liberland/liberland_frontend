const { ApiPromise, WsProvider } = require('@polkadot/api');

const provider = new WsProvider(process.env.REACT_APP_NODE_ADDRESS);

const getBalanceByAddress = async (address) => {
  try {
    const api = await ApiPromise.create({ provider });
    const {
      data: { free: previousFree },
      nonce: previousNonce,
    } = await api.query.system.account(address);
    // eslint-disable-next-line max-len
    return ({ free: { amount: previousFree.toString(), nonce: previousNonce.toString() } });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return {};
  }
};

export {
  getBalanceByAddress,
};
