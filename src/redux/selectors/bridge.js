import { createSelector } from 'reselect';

const bridgeReducer = (state) => state.bridge;

export const isLoading = createSelector(
  bridgeReducer,
  (reducer) => reducer.loading,
);

export const toEthereumInitialized = createSelector(
  bridgeReducer,
  (reducer) => reducer.transfers.toEthereumInitialized,
);

export const toSubstrateInitialized = createSelector(
  bridgeReducer,
  (reducer) => reducer.transfers.toSubstrateInitialized,
);

export const toEthereumTransfers = createSelector(
  bridgeReducer,
  (reducer) => reducer.transfers.toEthereum,
);

export const toSubstrateTransfers = createSelector(
  bridgeReducer,
  (reducer) => reducer.transfers.toSubstrate,
);

export const bridgesConstants = createSelector(
  bridgeReducer,
  (reducer) => reducer.bridgesConstants,
);

export const toEthereumTransfersFailed = createSelector(
  bridgeReducer,
  (reducer) => reducer.transfers.toEthereumFailed,
);
