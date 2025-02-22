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

const selectorGettingWalletInfoUnobtrusive = createSelector(
  walletReducer,
  (reducer) => reducer.unobtrusive,
);

// FIXME delete or make functional
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

const selectorLiquidDollarsBalance = createSelector(
  selectorBalances,
  (reducer) => (reducer.liquidAmount?.amount),
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
  (reducer) => (reducer.transfersTxHistoryFailed),
);

const selectorAllHistoryTx = createSelector(
  walletReducer,
  (reducer) => [
    ...reducer.transfersTxHistory.transfersTxHistory,
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

const selectorAdditionalAssets = createSelector(
  walletReducer,
  (reducer) => reducer.additionalAssets,
);

const selectorAssetsDetails = createSelector(
  walletReducer,
  (reducer) => reducer.assetDetails,
);

const selectorAssetBalance = createSelector(
  walletReducer,
  (reducer) => reducer.assetBalance,
);

const selectorAssetsBalance = createSelector(
  walletReducer,
  (reducer) => reducer.assetsBalance,
);

const selectorTransferState = createSelector(
  walletReducer,
  (reducer) => reducer.transferState,
);

export {
  selectorWalletInfo,
  selectorGettingWalletInfo,
  selectorLiquidMeritsBalance,
  selectorLiquidDollarsBalance,
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
  selectorAdditionalAssets,
  selectorAssetBalance,
  selectorAssetsBalance,
  selectorAssetsDetails,
  selectorTransferState,
  selectorGettingWalletInfoUnobtrusive,
};
