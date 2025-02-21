import { createSelector } from 'reselect';

const ethReducer = (state) => state.eth;

const selectorWalletOptions = createSelector(
  ethReducer,
  (reducer) => reducer.walletOptions,
);

const selectorWethLpExchangeRate = createSelector(
  ethReducer,
  (reducer) => reducer.wethLpExchangeRate,
);

const selectorConnected = createSelector(
  ethReducer,
  (reducer) => reducer.wallet,
);

const selectorTokenStakeContractInfo = createSelector(
  ethReducer,
  (reducer) => reducer.tokenStakeContractInfo,
);

const selectorTokenStakeAddressInfo = createSelector(
  ethReducer,
  (reducer) => reducer.tokenStakeAddressInfo,
);

const selectorERC20Info = createSelector(
  ethReducer,
  (reducer) => reducer.erc20Info,
);

const selectorBalance = createSelector(
  ethReducer,
  (reducer) => reducer.balance,
);

const selectorEthLoading = createSelector(
  ethReducer,
  (reducer) => reducer.loading,
);

const selectorEthUnobtrusive = createSelector(
  ethReducer,
  (reducer) => reducer.unobtrusive,
);

const selectorERC20Balance = createSelector(
  ethReducer,
  (reducer) => Object.entries(reducer.erc20Balance).reduce((accumulator, [key, value]) => {
    const [address, account] = key.split('/');
    if (!accumulator[address]) {
      accumulator[address] = {};
    }
    accumulator[address][account] = value;
    return accumulator;
  }, {}),
);

export {
  selectorWalletOptions,
  selectorConnected,
  selectorTokenStakeContractInfo,
  selectorTokenStakeAddressInfo,
  selectorERC20Info,
  selectorERC20Balance,
  selectorWethLpExchangeRate,
  selectorBalance,
  selectorEthLoading,
  selectorEthUnobtrusive,
};
