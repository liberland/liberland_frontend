import { createActions } from 'redux-actions';

export const {
  getNfts,
  getOwnNftPrimeCount,
  getOwnNftPrimes,
  getNftPrimesCount,
  getNftPrimes,
} = createActions({
  GET_NFTS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_OWN_NFT_PRIME_COUNT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_OWN_NFT_PRIMES: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_NFT_PRIMES_COUNT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_NFT_PRIMES: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
