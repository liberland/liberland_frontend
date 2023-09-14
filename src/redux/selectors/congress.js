import { createSelector } from 'reselect';

const congressReducer = (state) => state.congress;

export const isLoading = createSelector(
  congressReducer,
  (reducer) => reducer.loading,
);

export const congressCandidates = createSelector(
  congressReducer,
  (reducer) => reducer.congressCandidates,
);

export const congressMotions = createSelector(
  congressReducer,
  (reducer) => reducer.motions,
);

export const congressMembers = createSelector(
  congressReducer,
  (reducer) => reducer.congressMembers,
);

export const runnersUp = createSelector(
  congressReducer,
  (reducer) => reducer.runnersUp,
);
