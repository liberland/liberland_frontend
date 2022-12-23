import { createSelector } from 'reselect';

const democracyReducer = (state) => state.democracy;

const selectorDemocracyInfo = createSelector(
  democracyReducer,
  (reducer) => reducer.democracy,
);

const selectorGettingDemocracyInfo = createSelector(
  democracyReducer,
  (reducer) => reducer.gettingDemocracyInfo,
);

export {
  selectorDemocracyInfo,
  selectorGettingDemocracyInfo,
};
