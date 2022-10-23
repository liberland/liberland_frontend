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

export {
  allWalletsSelector,
  userWalletAddressSelector,
};
