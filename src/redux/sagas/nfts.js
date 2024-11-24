import { put, call } from 'redux-saga/effects';

import {
  getOwnNftPrimeCount,
  getOwnNftPrimes,
  getNftPrimes,
  getNftPrimesCount,
} from '../../api/ethereum';
import { getUserNfts } from '../../api/nodeRpcCall';

import { nftsActions } from '../actions';
import { blockchainWatcher } from './base';

// WORKERS

function* getUserNftsWorker(action) {
  try {
    const nfts = yield call(getUserNfts, action.payload);
    yield put(nftsActions.getNfts.success(nfts));
  } catch (e) {
    yield put(nftsActions.getNfts.failure(e));
  }
}

function* getOwnNftPrimeCountWorker(action) {
  try {
    const nfts = yield call(getOwnNftPrimeCount, action.payload);
    yield put(nftsActions.getOwnNftPrimeCount.success(nfts));
  } catch (e) {
    yield put(nftsActions.getOwnNftPrimeCount.failure(e));
  }
}

function* getOwnNftPrimesWorker(action) {
  try {
    const nfts = yield call(getOwnNftPrimes, action.payload);
    yield put(nftsActions.getOwnNftPrimes.success(nfts));
  } catch (e) {
    yield put(nftsActions.getOwnNftPrimes.failure(e));
  }
}

function* getNftPrimesWorker(action) {
  try {
    const nfts = yield call(getNftPrimes, action.payload);
    yield put(nftsActions.getNftPrimes.success(nfts));
  } catch (e) {
    yield put(nftsActions.getNftPrimes.failure(e));
  }
}

function* getNftPrimesCountWorker(action) {
  try {
    const nfts = yield call(getNftPrimesCount, action.payload);
    yield put(nftsActions.getNftPrimesCount.success(nfts));
  } catch (e) {
    yield put(nftsActions.getNftPrimesCount.failure(e));
  }
}

// WATCHERS

export function* getUserNftsWatcher() {
  yield* blockchainWatcher(nftsActions.getNfts, getUserNftsWorker);
}

export function* getOwnNftPrimeCountWatcher() {
  yield* blockchainWatcher(nftsActions.getOwnNftPrimeCount, getOwnNftPrimeCountWorker);
}

export function* getOwnNftPrimesWatcher() {
  yield* blockchainWatcher(nftsActions.getOwnNftPrimes, getOwnNftPrimesWorker);
}

export function* getNftPrimesWatcher() {
  yield* blockchainWatcher(nftsActions.getNftPrimes, getNftPrimesWorker);
}

export function* getNftPrimesCountWatcher() {
  yield* blockchainWatcher(nftsActions.getNftPrimesCount, getNftPrimesCountWorker);
}
