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

const selectorLiquidMeritsBalance = createSelector(
  selectorBalances,
  (reducer) => matchPowHelper(reducer.liquidMerits.amount),
);

const selectorTotalBalance = createSelector(
  selectorBalances,
  (reducer) => (
    reducer.liberstake.amount + reducer.polkastake.amount + reducer.liquidMerits.amount
  ),
);

export {
  selectorWalletInfo,
  selectorGettingWalletInfo,
  selectorLiquidMeritsBalance,
  selectorBalances,
  selectorTotalBalance,
  selectorWalletAddress,
};
