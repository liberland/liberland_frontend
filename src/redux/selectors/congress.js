import { createSelector } from 'reselect';
import { blockchainReducer } from './blockchainSelectors';

const congressReducer = (state) => state.congress;

export const isLoading = createSelector(
  congressReducer,
  (reducer) => reducer.loading,
);

export const isUnobtrusive = createSelector(
  congressReducer,
  (reducer) => reducer.unobtrusive,
);

export const candidates = createSelector(
  congressReducer,
  (reducer) => reducer.candidates,
);

export const userHasWalletCongressMember = createSelector(
  congressReducer,
  blockchainReducer,
  (congressState, blockchainState) => {
    const memberAddresses = congressState.members.map((member) => member.member);
    const matchedWallet = blockchainState.allWallets.find((wallet) => memberAddresses.includes(wallet.address));
    return matchedWallet?.address || null;
  },
);

export const userIsCandidate = createSelector(
  congressReducer,
  blockchainReducer,
  (congressState, blockchainState) => congressState.candidates
    .some(([address]) => blockchainState.userWalletAddress === address),
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
    .some((m) => m.member === blockchainState.userWalletAddress),
);

export const runnersUp = createSelector(
  congressReducer,
  (reducer) => reducer.runnersUp,
);

export const userIsRunnersUp = createSelector(
  congressReducer,
  blockchainReducer,
  (congressState, blockchainState) => congressState.runnersUp
    .some((m) => m.who === blockchainState.userWalletAddress),
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

export const allBalance = createSelector(
  congressReducer,
  (reducer) => reducer.allBalance,
);

export const spendingSelector = createSelector(
  congressReducer,
  (reducer) => reducer.congressSpending,
);
