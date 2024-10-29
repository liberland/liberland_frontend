import { createSelector } from 'reselect';

const nftsReducer = (state) => state.nfts;

export const userNftsSelector = createSelector(
  nftsReducer,
  (reducer) => reducer.userNfts,
);

export const isLoading = createSelector(
  nftsReducer,
  (reducer) => reducer.isLoading,
);

export const userCollections = createSelector(
  nftsReducer,
  (reducer) => reducer.userCollections,
);

export const nfts = createSelector(
  nftsReducer,
  (reducer) => reducer.nfts,
);

export const nftsOnSale = createSelector(
  nftsReducer,
  (reducer) => reducer.nftsOnSale,
);
