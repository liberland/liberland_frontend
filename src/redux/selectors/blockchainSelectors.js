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

const electionsBlockNumberSelector = createSelector(
  blockchainReducer,
  (reducer) => reducer.electionsBlock,
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

const startFromGenesisElectionsAssemblySelector = createSelector(
  electionsBlockNumberSelector,
  genesisTimeStampSelector,
  (elecBlock, genesis) => (elecBlock * 6000) + genesis + 18000 || 0,
);

const endElectionsAssemblySelector = createSelector(
  assemblyPeriodSelector,
  assemblyDurationSelector,
  startFromGenesisElectionsAssemblySelector,
  (period, duration, start) => duration * 6000 + start - 18000 || 0,
);

const electionsBlockSelector = createSelector(
  eraOfElectionSelector,
  assemblyPeriodSelector,
  assemblyDurationSelector,
  (era, period, duration) => (period + duration) * (era + 1),
);

const nextElectionsBlockSelector = createSelector(
  eraOfElectionSelector,
  assemblyPeriodSelector,
  assemblyDurationSelector,
  (era, period, duration) => (period + duration) * (era + 2) || 0,
);

const nextElectionsTimeStampSelector = createSelector(
  eraOfElectionSelector,
  assemblyPeriodSelector,
  assemblyDurationSelector,
  genesisTimeStampSelector,
  (era, period, duration, genesis) => (((period + duration) * (era + 2)) * 6000) + genesis || 0,
);

export {
  startFromGenesisElectionsAssemblySelector,
  eraOfElectionSelector,
  periodAndVotingDurationSelector,
  assemblyPeriodSelector,
  assemblyDurationSelector,
  endElectionsAssemblySelector,
  electionsBlockSelector,
  nextElectionsBlockSelector,
  nextElectionsTimeStampSelector,
};
