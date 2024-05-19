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

export const codeName = createSelector(
  congressReducer,
  (reducer) => reducer.codeName,
);

const walletInfo = createSelector(
  congressReducer,
  (reducer) => reducer.walletInfo,
);

export const walletAddress = createSelector(
  walletInfo,
  (reducer) => reducer?.walletAddress,
);

export const balances = createSelector(
  walletInfo,
  (reducer) => reducer.balances,
);

export const liquidMeritsBalance = createSelector(
  balances,
  (reducer) => (reducer.liquidMerits.amount),
);

export const liquidDollarsBalance = createSelector(
  balances,
  (reducer) => (reducer.liquidAmount?.amount),
);

export const totalBalance = createSelector(
  balances,
  (reducer) => (
    reducer.totalAmount.amount
  ),
);

export const totalLLM = createSelector(
  balances,
  (reducer) => (
    reducer.meritsTotalAmount.amount
  ),
);

export const isUserHavePolkaStake = createSelector(
  balances,
  (reducer) => reducer.polkastake.amount,
);

export const additionalAssets = createSelector(
  congressReducer,
  (reducer) => reducer.additionalAssets,
);

export const motionDurationInDays = createSelector(
  congressReducer,
  (reducer) => reducer.motionDurationInDays,
);

export const minSpendDelayInDays = createSelector(
  congressReducer,
  (reducer) => reducer.minSpendDelayInDays,
);
