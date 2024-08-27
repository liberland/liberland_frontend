import { createSelector } from 'reselect';

export const blockchainReducer = (state) => state.blockchain;

const extensionsSelector = createSelector(
  blockchainReducer,
  (reducer) => reducer.extensions,
);
const allWalletsSelector = createSelector(
  blockchainReducer,
  (reducer) => reducer.allWallets,
);
const userWalletAddressSelector = createSelector(
  blockchainReducer,
  (reducer) => reducer?.userWalletAddress,
);
const isUserWalletAddressSameAsUserAdress = createSelector(
  (state) => state,
  (reducer) => reducer?.user?.user?.blockchainAddress
      === reducer?.blockchain?.userWalletAddress,
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
const blockTimestamp = createSelector(
  blockchainReducer,
  (reducer) => reducer.currentBlockTimestamp,
);
const activeEra = createSelector(
  blockchainReducer,
  (reducer) => reducer.activeEra,
);

const preimages = createSelector(
  blockchainReducer,
  (reducer) => reducer.preimages,
);

export {
  extensionsSelector,
  allWalletsSelector,
  userWalletAddressSelector,
  errorExistsAndUnacknowledgedByUser,
  blockchainError,
  blockNumber,
  activeEra,
  preimages,
  blockTimestamp,
  isUserWalletAddressSameAsUserAdress,
};
