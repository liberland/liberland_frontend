import { createSelector } from 'reselect';

const assemblyReducer = (state) => state.assembly;

const proposalsSelector = createSelector(
  assemblyReducer,
  (reducer) => reducer.proposals,
);

const isDraftSendSelector = createSelector(
  assemblyReducer,
  (reducer) => reducer.isDraftSend,
);

export {
  isDraftSendSelector,
  proposalsSelector,
};
