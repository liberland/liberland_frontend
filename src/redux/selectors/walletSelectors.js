import { createSelector } from 'reselect';

const walletReducer = (state) => state.wallet;

const selectorWalletInfo = createSelector(
  walletReducer,
  (reducer) => reducer.walletInfo,
);

const selectorGettingWalletInfo = createSelector(
  walletReducer,
  (reducer) => reducer.gettingWalletInfo,
);

const selectorFreeBalance = createSelector(
  walletReducer,
  (reducer) => (
    // eslint-disable-next-line no-restricted-properties
    (reducer.walletInfo.balance.free.amount.toString()) * Math.pow(10, -10) * Math.pow(10, -2)
  ),
);

export {
  selectorWalletInfo,
  selectorGettingWalletInfo,
  selectorFreeBalance,
};
