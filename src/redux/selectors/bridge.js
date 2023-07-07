import { createSelector } from 'reselect';

const bridgeReducer = (state) => state.bridge;

const isLoading = createSelector(
  bridgeReducer,
  (reducer) => reducer.loading,
);

const areToEthereumTransfersInitialized = createSelector(
  bridgeReducer,
  (reducer) => reducer.transfers.toEthereumInitialized,
);

const toEthereumTransfers = createSelector(
  bridgeReducer,
  (reducer) => reducer.transfers.toEthereum,
);

const areToSubstrateTransfersInitialized = createSelector(
  bridgeReducer,
  (reducer) => reducer.transfers.toSubstrateInitialized,
);

const toSubstrateTransfers = createSelector(
  bridgeReducer,
  (reducer) => reducer.transfers.toSubstrate,
);

export {
  isLoading,
  toSubstrateTransfers,
  toEthereumTransfers,
  areToEthereumTransfersInitialized,
  areToSubstrateTransfersInitialized,
};
