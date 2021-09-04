import { createSelector } from 'reselect';

const votingReducer = (state) => state.voting;

const isVotingRequested = createSelector(
  votingReducer,
  (reducer) => reducer.isVotingRequested,
);

export {
  isVotingRequested,
};
