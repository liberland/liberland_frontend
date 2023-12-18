import { createSelector } from 'reselect';

const identityReducer = (state) => state.identity;

const selectorIdentity = createSelector(
  identityReducer,
  (reducer) => reducer.identity,
);

const selectorIdentities = createSelector(
  identityReducer,
  (reducer) => reducer.identities,
);

const selectorIsLoading = createSelector(
  identityReducer,
  (reducer) => reducer.loading,
);

export {
  selectorIdentity,
  selectorIsLoading,
  selectorIdentities,
};
