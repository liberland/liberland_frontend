import { createSelector } from 'reselect';

const blockchainReducer = (state) => state.blockchain;

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

export {
  allWalletsSelector,
  userWalletAddressSelector,
  errorExistsAndUnacknowledgedByUser,
};
