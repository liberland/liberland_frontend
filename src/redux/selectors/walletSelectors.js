import { createSelector } from 'reselect';
import matchPowHelper from '../../utils/matchPowHelper';

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

const selectorFreeBalance = createSelector(
  selectorBalances,
  (reducer) => matchPowHelper(reducer.free.amount),
);

const selectorTotalBalance = createSelector(
  selectorBalances,
  selectorFreeBalance,
  (reducer, free) => (
    reducer.free.amount + reducer.liberstake.amount + reducer.polkastake.amount + free
  ),
);

export {
  selectorWalletInfo,
  selectorGettingWalletInfo,
  selectorFreeBalance,
  selectorBalances,
  selectorTotalBalance,
  selectorWalletAddress,
};
