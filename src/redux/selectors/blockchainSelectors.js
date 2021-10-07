import { createSelector } from 'reselect';

const blockchainReducer = (state) => state.blockchain;

const currentDate = new Date();

const currentBlockNumberSelector = createSelector(
  blockchainReducer,
  (reducer) => reducer.currentBlockNumber,
);

const periodAndVotingDurationSelector = createSelector(
  blockchainReducer,
  (reducer) => reducer.periodAndVotingDuration,
);

const assemblyDurationSelector = createSelector(
  periodAndVotingDurationSelector,
  (reducer) => reducer.assemblyVotingDuration,
);

const assemblyPeriodSelector = createSelector(
  periodAndVotingDurationSelector,
  (reducer) => reducer.assemblyElectionPeriod,
);

const genesisTimeStampSelector = createSelector(
  currentBlockNumberSelector,
  (currentBlock) => currentDate - (currentBlock * 6000),
);

const eraOfElectionSelector = createSelector(
  currentBlockNumberSelector,
  assemblyPeriodSelector,
  assemblyDurationSelector,
  (block, period, duration) => Math.trunc(block / (period + duration)),
);

const startElectionsAssemblySelector = createSelector(
  genesisTimeStampSelector,
  assemblyDurationSelector,
  assemblyPeriodSelector,
  eraOfElectionSelector,
  (genesis, duration, period, era) => ((((era + 1) * (period + duration)) * 6000) + genesis) || 0,
);

const endElectionsAssemblySelector = createSelector(
  eraOfElectionSelector,
  assemblyPeriodSelector,
  assemblyDurationSelector,
  startElectionsAssemblySelector,
  (era, period, duration, start) => (era * (period + 2 * duration)) * 600 + start || 0,
);

export {
  startElectionsAssemblySelector,
  eraOfElectionSelector,
  periodAndVotingDurationSelector,
  assemblyPeriodSelector,
  assemblyDurationSelector,
  endElectionsAssemblySelector,
};
