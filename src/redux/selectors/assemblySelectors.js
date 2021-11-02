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

const allSendProposalsSelector = createSelector(
  assemblyReducer,
  (reducer) => reducer.allSendProposals,
);

const allProposalsInProgressSelector = createSelector(
  allSendProposalsSelector,
  (reducer) => (reducer.filter((proposal) => proposal.proposalStatus === 'InProgress')),
);

const constitutionalChangeSelector = createSelector(
  assemblyReducer,
  (reducer) => reducer.constitutionalChange,
);

const legislationSelector = createSelector(
  assemblyReducer,
  (reducer) => reducer.legislation,
);

const decisionSelector = createSelector(
  assemblyReducer,
  (reducer) => reducer.decision,
);

const textPdfSelector = createSelector(
  assemblyReducer,
  (reducer) => reducer.textPdf.text,
);

export {
  isDraftSendSelector,
  proposalsSelector,
  allSendProposalsSelector,
  allProposalsInProgressSelector,
  constitutionalChangeSelector,
  legislationSelector,
  decisionSelector,
  textPdfSelector,
};
