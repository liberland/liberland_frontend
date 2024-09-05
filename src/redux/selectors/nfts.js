import { createSelector } from 'reselect';

const nftsReducer = (state) => state.nfts;

export const userNftsSelector = createSelector(
  nftsReducer,
  (reducer) => reducer.userNfts,
);
