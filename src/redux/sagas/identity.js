import {
  put,
  takeLatest,
  call,
  takeEvery,
} from 'redux-saga/effects';
import { getIdentitiesNames, getIdentity, setIdentity } from '../../api/nodeRpcCall';
import { identityActions } from '../actions';
import { blockchainWatcher } from './base';

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

function* getIdentityOfWorker(action) {
  try {
    const identity = yield call(getIdentity, action.payload);
    yield put(identityActions.getIdentityOf.success({ [action.payload]: identity }));
  } catch (e) {
    yield put(identityActions.getIdentityOf.failure(e));
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

function* getIdentityOfWatcher() {
  try {
    yield takeEvery(identityActions.getIdentityOf.call, getIdentityOfWorker);
  } catch (e) {
    yield put(identityActions.getIdentityOf.failure(e));
  }
}

export {
  setIdentityWatcher,
  getIdentityWatcher,
  getIdentityOfWatcher,
  getIdentityMotionsWatcher,
};
