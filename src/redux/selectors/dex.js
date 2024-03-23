import { createSelector } from 'reselect';

const identityReducer = (state) => state.dex;

const selectorDex = createSelector(
  identityReducer,
  (reducer) => reducer.pools,
);

const selectorIsLoading = createSelector(
  identityReducer,
  (reducer) => reducer.loading,
);

const selectorReserves = createSelector(
  identityReducer,
  (reducer) => reducer.reserves,
);

export { selectorDex, selectorIsLoading, selectorReserves };
