import { createSelector } from 'reselect';

const votingReducer = (state) => state.voting;

const selectorIsVotingRequested = createSelector(
  votingReducer,
  (reducer) => reducer.isVotingRequested,
);

const selectorCandidateList = createSelector(
  votingReducer,
  (reducer) => reducer.candidateList,
);

export {
  selectorIsVotingRequested,
  selectorCandidateList,
};
