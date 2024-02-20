import { createSelector } from 'reselect';
import { parseIdentityData, parseLegal } from '../../utils/identityParser';

const identityReducer = (state) => state.identity;

const selectorIdentity = createSelector(
  identityReducer,
  (reducer) => reducer.identity,
);

const selectorIsLoading = createSelector(
  identityReducer,
  (reducer) => reducer.loading,
);

export { selectorIdentity, selectorIsLoading };
