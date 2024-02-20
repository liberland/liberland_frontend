import { put, takeLatest, call } from 'redux-saga/effects';

import { getIdentity, setIdentity } from '../../api/nodeRpcCall';

import { identityActions } from '../actions';
import { blockchainWatcher } from './base';

// WORKERS

function* setIdentityWorker(action) {
  yield call(
    setIdentity,
    action.payload.values,
    action.payload.userWalletAddress,
  );
  yield put(identityActions.setIdentity.success());
  yield put(identityActions.getIdentity.call(action.payload.userWalletAddress));
  if (action.payload?.isGuidedUpdate) {
    sessionStorage.setItem('SkippedOnBoardingGetLLD', true);
  }
}

function* getIdentityWorker(action) {
  try {
    const identity = yield call(getIdentity, action.payload);
    yield put(identityActions.getIdentity.success(identity));
  } catch (e) {
    yield put(identityActions.getIdentity.failure(e));
  }
}

// WATCHERS

function* setIdentityWatcher() {
  yield* blockchainWatcher(identityActions.setIdentity, setIdentityWorker);
}

function* getIdentityWatcher() {
  try {
    yield takeLatest(identityActions.getIdentity.call, getIdentityWorker);
  } catch (e) {
    yield put(identityActions.getIdentity.failure(e));
  }
}

export { setIdentityWatcher, getIdentityWatcher };
