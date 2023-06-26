import { createSelector } from 'reselect';

const bridgeReducer = (state) => state.bridge;

const isLoading = createSelector(
  bridgeReducer,
  (reducer) => reducer.loading,
);

const toEthereumTransfers = createSelector(
  bridgeReducer,
  (reducer) => reducer.transfers.toEthereum,
);

const toSubstrateTransfers = createSelector(
  bridgeReducer,
  (reducer) => reducer.transfers.toSubstrate,
);

export {
  isLoading,
  toSubstrateTransfers,
  toEthereumTransfers,
};
