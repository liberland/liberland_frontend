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

const selectIsIdentityEmpty = createSelector(
  identityReducer,
  (reducer) => {
    const identityData = reducer.identity;
    if (!identityData) return null;
    if (identityData?.isSome) {
      const identity = identityData.unwrap();
      const { info } = identity;
      return (
        !parseIdentityData(info?.display)
        && !parseLegal(info)
        && !parseIdentityData(info?.web)
        && !parseIdentityData(info?.email)
      );
    }
    return true;
  },
);

export { selectorIdentity, selectorIsLoading, selectIsIdentityEmpty };
