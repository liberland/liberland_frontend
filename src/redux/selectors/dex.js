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

const selectorIsUnobtrusive = createSelector(
  dexReducer,
  (reducer) => reducer.unobtrusive,
);

const selectorReserves = createSelector(
  dexReducer,
  (reducer) => reducer.reserves,
);

const selectorWithdrawalFee = createSelector(
  dexReducer,
  (reducer) => reducer.withdrawalFee,
);

export {
  selectorDex,
  selectorIsLoading,
  selectorReserves,
  selectorWithdrawalFee,
  selectorIsUnobtrusive,
};
