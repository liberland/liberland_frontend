import { web3Accounts, web3FromSource } from '@polkadot/extension-dapp';

const { ApiPromise, WsProvider } = require('@polkadot/api');

const provider = new WsProvider(process.env.REACT_APP_NODE_ADDRESS);

// TODO: Need refactor when blockchain node update
const getBalanceByAddress = async (address) => {
  try {
    const api = await ApiPromise.create({ provider });
    const {
      data: { free: previousFree },
    } = await api.query.system.account(address);
    const api2 = await ApiPromise.create({
      provider,
      types: {
        StakingLedger: {
          stash: 'AccountId',
          total: 'Compact<Balance>',
          active: 'Compact<Balance>',
          unlocking: 'Vec<UnlockChunk>',
          claimedRewards: 'Vec<EraIndex>',
          polkaAmount: 'Compact<Balance>',
          liberAmount: 'Compact<Balance>',
        },
      },
    });
    const stash = await api2.query.stakingPallet.ledger(address);
    // const {data: {stash}} = await api2.query.stakingPallet.ledger(address);
    // eslint-disable-next-line no-console
    console.log('stash', JSON.parse(stash.toString()));
    return ({
      liberstake: {
        amount: 20000000000000000,
      },
      polkastake: {
        amount: 10000000000000000,
      },
      liquidMerits: {
        amount: parseInt(previousFree.toString(), 10),
      },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return {};
  }
};

const sendTransfer = async (payload) => {
  const { account_to, amount } = payload;
  const api = await ApiPromise.create({ provider });
  const allAccounts = await web3Accounts();
  const account = allAccounts[0];

  const transferExtrinsic = api.tx.balances.transfer(account_to, (amount * (10 ** 12)));
  const injector = await web3FromSource(account.meta.source);
  transferExtrinsic.signAndSend(account.address, { signer: injector.signer }, ({ status }) => {
    if (status.isInBlock) {
      // eslint-disable-next-line no-console
      console.log(`Completed at block hash #${status.asInBlock.toString()}`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`Current status: ${status.type}`);
    }
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(':( transaction failed', error);
  });
};

export {
  getBalanceByAddress,
  sendTransfer,
};
