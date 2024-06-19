import { createSelector } from 'reselect';

const senateReducer = (state) => state.senate;

export const isLoading = createSelector(
  senateReducer,
  (reducer) => reducer.loading,
);

export const members = createSelector(
  senateReducer,
  (reducer) => reducer.members,
);

export const motions = createSelector(
  senateReducer,
  (reducer) => reducer.motions,
);

export const scheduledCalls = createSelector(
  senateReducer,
  (reducer) => reducer.scheduledCalls,
);

export const codeName = createSelector(
  senateReducer,
  (reducer) => reducer.codeName,
);

const walletInfo = createSelector(
  senateReducer,
  (reducer) => reducer.senateWalletInfo,
);

export const walletAddress = createSelector(
  walletInfo,
  (reducer) => reducer?.walletAddress,
);

export const balances = createSelector(
  walletInfo,
  (reducer) => reducer.balances,
);

export const additionalAssets = createSelector(
  senateReducer,
  (reducer) => reducer.additionalAssets,
);

export const liquidMeritsBalance = createSelector(
  balances,
  (reducer) => (reducer.liquidMerits.amount),
);

export const liquidDollarsBalance = createSelector(
  balances,
  (reducer) => (reducer.liquidAmount?.amount),
);

export const totalBalance = createSelector(
  balances,
  (reducer) => (
    reducer.totalAmount.amount
  ),
);
