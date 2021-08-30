import { createSelector } from 'reselect';

const assemblyReducer = (state) => state.user;

const proposalsSelector = createSelector(
  assemblyReducer,
  (reducer) => reducer.proposals,
);

export {
  proposalsSelector,
};
