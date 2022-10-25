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
  (reducer) => (reducer.liquidMerits.amount),
);

const selectorTotalBalance = createSelector(
  selectorBalances,
  (reducer) => (
    reducer.totalAmount.amount
  ),
);

const selectorTotalLLM = createSelector(
  selectorBalances,
  (reducer) => (
    reducer.meritsTotalAmount.amount
  ),
);

const selectorIsUserHaveStake = createSelector(
  selectorBalances,
  (reducer) => {
    if ((reducer.liberstake.amount === 0) && (reducer.polkastake.amount === 0)) return false;
    return true;
  },
);

const selectorHistoryTx = createSelector(
  walletReducer,
  (reducer) => reducer.historyTx,
);

const selectorCountAllRows = createSelector(
  walletReducer,
  (reducer) => reducer.countAllRows,
);

const selectorCurrentPageNumber = createSelector(
  walletReducer,
  (reducer) => reducer.currentPageNumber,
);

const selectorAllHistoryTx = createSelector(
  walletReducer,
  (reducer) => reducer.allHistoryTx,
);

const selectorValidators = createSelector(
  walletReducer,
  (reducer) => reducer.validators,
);

const selectorNominatorTargets = createSelector(
  walletReducer,
  (reducer) => reducer.nominatorTargets,
);

export {
  selectorWalletInfo,
  selectorGettingWalletInfo,
  selectorLiquidMeritsBalance,
  selectorBalances,
  selectorTotalBalance,
  selectorTotalLLM,
  selectorWalletAddress,
  selectorIsUserHaveStake,
  selectorHistoryTx,
  selectorCountAllRows,
  selectorCurrentPageNumber,
  selectorAllHistoryTx,
  selectorValidators,
  selectorNominatorTargets,
};
