import { createSelector } from 'reselect';
import { valueToBN } from '../../utils/walletHelpers';

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

const selectorIsUserHavePolkaStake = createSelector(
  selectorBalances,
  (reducer) => valueToBN(reducer.polkastake.amount).gt(valueToBN(0)),
);

const selectorCountAllRows = createSelector(
  walletReducer,
  (reducer) => reducer.countAllRows,
);

const selectorCurrentPageNumber = createSelector(
  walletReducer,
  (reducer) => reducer.currentPageNumber,
);

const selectorTxHistoryFailed = createSelector(
  walletReducer,
  (reducer) => (reducer.transfersTxHistory.LLMFailed || reducer.transfersTxHistory.LLDFailed),
);

const selectorAllHistoryTx = createSelector(
  walletReducer,
  (reducer) => [
    ...reducer.transfersTxHistory.LLM,
    ...reducer.transfersTxHistory.LLD,
  ],
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
  selectorIsUserHavePolkaStake,
  selectorCountAllRows,
  selectorCurrentPageNumber,
  selectorAllHistoryTx,
  selectorValidators,
  selectorNominatorTargets,
  selectorTxHistoryFailed,
};
