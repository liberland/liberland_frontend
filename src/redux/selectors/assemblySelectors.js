import { createSelector } from 'reselect';

const assemblyReducer = (state) => state.assembly;

const proposalsSelector = createSelector(
  assemblyReducer,
  (reducer) => reducer.proposals,
);

export {
  proposalsSelector,
};
