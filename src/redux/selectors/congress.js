import { createSelector } from 'reselect';
import { blockchainReducer } from './blockchainSelectors';

const congressReducer = (state) => state.congress;

export const isLoading = createSelector(
  congressReducer,
  (reducer) => reducer.loading,
);

export const candidates = createSelector(
  congressReducer,
  (reducer) => reducer.candidates,
);

export const userIsCandidate = createSelector(
  congressReducer,
  blockchainReducer,
  (congressState, blockchainState) => congressState.candidates
    .map((m) => m.toString())
    .includes(blockchainState.userWalletAddress),
);

export const motions = createSelector(
  congressReducer,
  (reducer) => reducer.motions,
);

export const members = createSelector(
  congressReducer,
  (reducer) => reducer.members,
);

export const userIsMember = createSelector(
  congressReducer,
  blockchainReducer,
  (congressState, blockchainState) => congressState.members
    .map((m) => m.toString())
    .includes(blockchainState.userWalletAddress),
);

export const runnersUp = createSelector(
  congressReducer,
  (reducer) => reducer.runnersUp,
);

export const userIsRunnersUp = createSelector(
  congressReducer,
  blockchainReducer,
  (congressState, blockchainState) => congressState.runnersUp
    .map((m) => m.toString())
    .includes(blockchainState.userWalletAddress),
);

export const treasury = createSelector(
  congressReducer,
  (reducer) => reducer.treasury,
);
