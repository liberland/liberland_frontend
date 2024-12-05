import { createSelector } from 'reselect';

const ministryFinanceReducer = (state) => state.ministryFinance;

export const codeName = createSelector(
  ministryFinanceReducer,
  (reducer) => reducer.codeName,
);

export const isLoading = createSelector(
  ministryFinanceReducer,
  (reducer) => reducer.loading,
);

const walletInfo = createSelector(
  ministryFinanceReducer,
  (reducer) => reducer.walletInfo,
);

export const walletAddress = createSelector(
  walletInfo,
  (reducer) => reducer?.walletAddress,
);

export const balances = createSelector(
  walletInfo,
  (reducer) => reducer.balances,
);

export const adminMinistryFinance = createSelector(
  walletInfo,
  (reducer) => reducer.admin,
);

export const additionalAssets = createSelector(
  ministryFinanceReducer,
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
