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

const selectorWethLpExchangeRateLoading = createSelector(
  ethReducer,
  (reducer) => reducer.wethLpExchangeRateLoading,
);

const selectorWethLpExchangeRateError = createSelector(
  ethReducer,
  (reducer) => reducer.wethLpExchangeRateError,
);

const selectorWalletOptionsLoading = createSelector(
  ethReducer,
  (reducer) => reducer.loading,
);

const selectorConnected = createSelector(
  ethReducer,
  (reducer) => reducer.wallet,
);

const selectorConnecting = createSelector(
  ethReducer,
  (reducer) => reducer.connecting,
);

const selectorConnectError = createSelector(
  ethReducer,
  (reducer) => reducer.walletError,
);

const selectorTokenStakeContractInfoLoading = createSelector(
  ethReducer,
  (reducer) => reducer.tokenStakeContractInfoLoading,
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
  selectorWalletOptionsLoading,
  selectorConnected,
  selectorConnecting,
  selectorConnectError,
  selectorTokenStakeContractInfoLoading,
  selectorTokenStakeContractInfo,
  selectorTokenStakeAddressInfo,
  selectorERC20Info,
  selectorERC20Balance,
  selectorWethLpExchangeRate,
  selectorWethLpExchangeRateLoading,
  selectorWethLpExchangeRateError,
};
