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
const selectorWalletAddress = createSelector(
  selectorWalletInfo,
  (reducer) => reducer.address,
);

const selectorBalances = createSelector(
  selectorWalletInfo,
  (reducer) => reducer.balances,
);

const selectorLiquidMeritsBalance = createSelector(
  selectorBalances,
  (reducer) => (reducer.liquidMerits.amount - reducer.totalAmount.amount),
);

const selectorTotalBalance = createSelector(
  selectorBalances,
  (reducer) => (
    reducer.totalAmount.amount
  ),
);

const selectorIsUserHaveStake = createSelector(
  selectorBalances,
  (reducer) => {
    if ((reducer.liberstake.amount === 0) && (reducer.polkastake.amount === 0)) return false;
    return true;
  },
);

export {
  selectorWalletInfo,
  selectorGettingWalletInfo,
  selectorLiquidMeritsBalance,
  selectorBalances,
  selectorTotalBalance,
  selectorWalletAddress,
  selectorIsUserHaveStake,
};
