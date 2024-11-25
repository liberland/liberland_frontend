import { combineActions, handleActions } from 'redux-actions';
import { nftsActions } from '../actions';

const initialState = {
  isLoading: false,
  ownNftPrimeLoading: false,
  nftPrimeLoading: false,
  ownNftPrimesError: null,
  nftPrimesError: null,
  ownNftPrimes: {},
  ownNftPrimesCount: {},
  nftPrimes: [],
  nftPrimesCount: [],
  userNfts: [],
};

const combineArrays = (original, next, from, to) => {
  const combined = [...original];
  for (let i = 0; i < (to - from); i += 1) {
    combined[i + from] = next[i];
  }
  return combined;
};

const nftsReducer = handleActions({
  [combineActions(
    nftsActions.getNfts.call,
  )]: (state) => ({
    ...state,
    isLoading: true,
  }),
  [combineActions(
    nftsActions.getNftPrimes.call,
    nftsActions.getNftPrimesCount.call,
  )]: (state) => ({
    ...state,
    nftPrimeLoading: true,
    nftPrimesError: null,
  }),
  [combineActions(
    nftsActions.getOwnNftPrimes.call,
    nftsActions.getOwnNftPrimeCount.call,
  )]: (state) => ({
    ...state,
    ownNftPrimeLoading: true,
    ownNftPrimesError: null,
  }),
  [nftsActions.getNfts.success]: (state, action) => ({
    ...state,
    userNfts: action.payload,
  }),
  [nftsActions.getNftPrimesCount.success]: (state, action) => ({
    ...state,
    nftPrimeLoading: false,
    nftPrimesCount: action.payload.length,
  }),
  [nftsActions.getOwnNftPrimeCount.success]: (state, action) => ({
    ...state,
    ownNftPrimeLoading: false,
    ownNftPrimesCount: {
      ...state.ownNftPrimesCount,
      [action.payload.address]: action.payload.length,
    },
  }),
  [nftsActions.getNftPrimes.success]: (state, action) => ({
    ...state,
    nftPrimeLoading: false,
    nftPrimes: combineArrays(state.nftPrimes, action.payload.primes, action.payload.from, action.payload.to),
  }),
  [nftsActions.getOwnNftPrimes.success]: (state, action) => ({
    ...state,
    ownNftPrimeLoading: false,
    ownNftPrimes: {
      ...state.ownNftPrimes,
      [action.payload.address]: combineArrays(
        state.ownNftPrimes[action.payload.address] || [],
        action.payload.primes,
        action.payload.from,
        action.payload.to,
      ),
    },
  }),
  [combineActions(
    nftsActions.getNftPrimes.failure,
    nftsActions.getNftPrimesCount.failure,
  )]: (state, action) => ({
    ...state,
    nftPrimeLoading: false,
    nftPrimesError: action.payload,
  }),
  [combineActions(
    nftsActions.getOwnNftPrimes.failure,
    nftsActions.getOwnNftPrimeCount.failure,
  )]: (state, action) => ({
    ...state,
    ownNftPrimeLoading: false,
    ownNftPrimesError: action.payload,
  }),
  [combineActions(
    nftsActions.getNfts.failure,
    nftsActions.getNfts.success,
  )]: (state) => ({
    ...state,
    isLoading: initialState.isLoading,
  }),
}, initialState);

export default nftsReducer;
