import { createSelector } from 'reselect';

export const blockchainReducer = (state) => state.blockchain;

const allWalletsSelector = createSelector(
  blockchainReducer,
  (reducer) => reducer.allWallets,
);
const userWalletAddressSelector = createSelector(
  blockchainReducer,
  (reducer) => reducer.userWalletAddress,
);
const errorExistsAndUnacknowledgedByUser = createSelector(
  blockchainReducer,
  (reducer) => reducer.errorExistsAndUnacknowledgedByUser,
);
const blockchainError = createSelector(
  blockchainReducer,
  (reducer) => reducer.error,
);
const blockNumber = createSelector(
  blockchainReducer,
  (reducer) => reducer.currentBlockNumber,
);
const activeEra = createSelector(
  blockchainReducer,
  (reducer) => reducer.activeEra,
);

const preimages = createSelector(
  blockchainReducer,
  (reducer) => reducer.preimages
)

export {
  allWalletsSelector,
  userWalletAddressSelector,
  errorExistsAndUnacknowledgedByUser,
  blockchainError,
  blockNumber,
  activeEra,
  preimages,
};
