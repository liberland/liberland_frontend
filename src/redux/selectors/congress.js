import { createSelector } from 'reselect';

const congressReducer = (state) => state.congress;

export const isLoading = createSelector(
  congressReducer,
  (reducer) => reducer.loading,
);

export const candidates = createSelector(
  congressReducer,
  (reducer) => reducer.candidates,
);

export const motions = createSelector(
  congressReducer,
  (reducer) => reducer.motions,
);

export const members = createSelector(
  congressReducer,
  (reducer) => reducer.members,
);

export const runnersUp = createSelector(
  congressReducer,
  (reducer) => reducer.runnersUp,
);
