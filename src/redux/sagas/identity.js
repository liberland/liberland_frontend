import {
  put,
  takeLatest,
  call,
} from 'redux-saga/effects';
import { getIdentitiesNames, getIdentity, setIdentity } from '../../api/nodeRpcCall';
import { identityActions } from '../actions';
import { blockchainWatcher } from './base';
import { getX } from '../../api/middleware';

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

function* getXWorker(action) {
  try {
    const x = yield call(getX, action.payload);
    yield put(identityActions.getX.success({ handle: action.payload.handle, profile: x }));
  } catch (e) {
    yield put(identityActions.getX.failure(e));
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

function* getIdentityMotionsWorker(action) {
  try {
    const identities = yield call(getIdentitiesNames, action.payload);
    yield put(identityActions.getIdentityMotions.success(identities));
  } catch (e) {
    yield put(identityActions.getIdentityMotions.failure(e));
  }
}

// WATCHERS

function* getXWatcher() {
  yield* blockchainWatcher(identityActions.getX, getXWorker);
}

function* getIdentityMotionsWatcher() {
  try {
    yield takeLatest(identityActions.getIdentityMotions.call, getIdentityMotionsWorker);
  } catch (e) {
    yield put(identityActions.getIdentityMotions.failure(e));
  }
}

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

export {
  setIdentityWatcher,
  getIdentityWatcher,
  getIdentityMotionsWatcher,
  getXWatcher,
};
