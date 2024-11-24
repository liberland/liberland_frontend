import { createSelector } from 'reselect';

const nftsReducer = (state) => state.nfts;

export const userNftsSelector = createSelector(
  nftsReducer,
  (reducer) => reducer.userNfts,
);

export const ownNftPrimesSelector = createSelector(
  nftsReducer,
  (reducer) => reducer.ownNftPrimes,
);

export const nftPrimesSelector = createSelector(
  nftsReducer,
  (reducer) => reducer.nftPrimes,
);

export const ownNftPrimesLoadingSelector = createSelector(
  nftsReducer,
  (reducer) => reducer.ownNftPrimeLoading,
);

export const nftPrimesLoadingSelector = createSelector(
  nftsReducer,
  (reducer) => reducer.nftPrimeLoading,
);
