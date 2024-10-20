import { createSelector } from 'reselect';

const ethReducer = (state) => state.eth;

const selectorWalletOptions = createSelector(
  ethReducer,
  (reducer) => reducer.walletOptions,
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

export { selectorWalletOptions, selectorWalletOptionsLoading, selectorConnected, selectorConnecting };