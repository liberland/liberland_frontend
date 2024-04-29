import { createSelector } from 'reselect';

const dexReducer = (state) => state.dex;

const selectorDex = createSelector(
  dexReducer,
  (reducer) => reducer.pools,
);

const selectorIsLoading = createSelector(
  dexReducer,
  (reducer) => reducer.loading,
);

const selectorReserves = createSelector(
  dexReducer,
  (reducer) => reducer.reserves,
);

const selectorWithdrawlFee = createSelector(
  dexReducer,
  (reducer) => reducer.withdrawlFee,
);

export {
  selectorDex, selectorIsLoading, selectorReserves, selectorWithdrawlFee,
};
