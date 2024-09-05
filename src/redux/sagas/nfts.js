import { put, call } from 'redux-saga/effects';

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

// WATCHERS

export function* getUserNftsWatcher() {
  yield* blockchainWatcher(nftsActions.getNfts, getUserNftsWorker);
}
