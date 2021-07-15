const { ApiPromise, WsProvider } = require('@polkadot/api');

const provider = new WsProvider(process.env.REACT_APP_NODE_ADDRESS);

// TODO: Need refactor when blockchain node update
const getBalanceByAddress = async (address) => {
  try {
    const api = await ApiPromise.create({ provider });
    const {
      data: { free: previousFree },
      nonce: previousNonce,
    } = await api.query.system.account(address);
    return ({
      free: {
        amount: previousFree.toString(),
        nonce: previousNonce.toString(),
      },
      liberstake: {
        amount: 20000000000000000,
      },
      polkastake: {
        amount: 1000000000000000,
      },
      liquidMerits: {
        amount: 70000000000000000,
      },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return {};
  }
};

export {
  getBalanceByAddress,
};
