import { createSelector } from 'reselect';

const routeReducer = (state) => state.route;

export const isLoading = createSelector(
  routeReducer,
  (reducer) => reducer.loading,
);

export const routeLink = createSelector(
  routeReducer,
  (reducer) => reducer.routeLink,
);
