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

const selectorElectoralSheet = createSelector(
  votingReducer,
  (reducer) => reducer.electoralSheet,
);

const selectorIsVotingInProgress = createSelector(
  votingReducer,
  (reducer) => reducer.isVotingInProgress,
);

const selectorMinistersList = createSelector(
  votingReducer,
  (reducer) => reducer.ministersList,
);

const selectorAssemblyVotingDuration = createSelector(
  votingReducer,
  (reducer) => reducer.periodAndVotingDuration.assemblyVotingDuration,
);

const selectorAssemblyElectionPeriod = createSelector(
  votingReducer,
  (reducer) => reducer.periodAndVotingDuration.assemblyElectionPeriod,
);

const selectorCurrentBlockNumber = createSelector(
  votingReducer,
  (reducer) => reducer.currentBlockNumber,
);

const selectorLiberStakeAmount = createSelector(
  votingReducer,
  (reducer) => reducer.liberStakeAmount,
);

const selectorNumberCongressionalAssemble = createSelector(
  selectorCurrentBlockNumber,
  selectorAssemblyVotingDuration,
  selectorAssemblyElectionPeriod,
  (block, duration, Period) => block / (duration + Period),
);

export {
  selectorIsVotingRequested,
  selectorCandidateList,
  selectorElectoralSheet,
  selectorIsVotingInProgress,
  selectorMinistersList,
  selectorNumberCongressionalAssemble,
  selectorLiberStakeAmount,
};
