import {
  put, takeLatest, call,
} from 'redux-saga/effects';

import {
  getIdentity,
  setIdentity,
  getIdentities,
} from '../../api/nodeRpcCall';

import { identityActions } from '../actions';
import { blockchainWatcher } from './base';

// WORKERS

function* setIdentityWorker(action) {
  yield call(setIdentity, action.payload.values, action.payload.userWalletAddress);
  yield put(identityActions.setIdentity.success());
  yield put(identityActions.getIdentity.call(action.payload.userWalletAddress));
}

function* getIdentityWorker(action) {
  try {
    const identity = yield call(getIdentity, action.payload);
    yield put(identityActions.getIdentity.success(identity));
  } catch (e) {
    yield put(identityActions.getIdentity.failure(e));
  }
}

function* getIdentitiesWorker(action) {
  try {
    const identities = yield call(getIdentities, action.payload);
    yield put(identityActions.getIdentities.success(identities));
  } catch (e) {
    yield put(identityActions.getIdentities.failure(e));
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

function* getIdentitiesWatcher() {
  try {
    yield takeLatest(identityActions.getIdentities.call, getIdentitiesWorker);
  } catch (e) {
    yield put(identityActions.getIdentities.failure(e));
  }
}

export {
  setIdentityWatcher,
  getIdentityWatcher,
  getIdentitiesWatcher,
};
