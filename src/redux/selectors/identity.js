import { createSelector } from 'reselect';

const identityReducer = (state) => state.identity;

const selectorIdentity = createSelector(
  identityReducer,
  (reducer) => reducer.identity,
);

const selectorIsLoading = createSelector(
  identityReducer,
  (reducer) => reducer.loading,
);

const selectorIdentityMotions = createSelector(
  identityReducer,
  (reducer) => reducer.identityMotions,
);

export { selectorIdentity, selectorIsLoading, selectorIdentityMotions };
