import {
  put, takeLatest, cps, call,
} from 'redux-saga/effects';

import {
  getIdentity,
  setIdentity,
  getIdentities,
} from '../../api/nodeRpcCall';

import { identityActions, blockchainActions } from '../actions';

// WORKERS

function* setIdentityWorker(action) {
  try {
    const { errorData } = yield cps(setIdentity, action.payload.values, action.payload.userWalletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(identityActions.setIdentity.failure(errorData));
    } else {
      yield put(identityActions.setIdentity.success());
      yield put(identityActions.getIdentity.call(action.payload.userWalletAddress));
    }
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.log('Error in set identity worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(identityActions.setIdentity.failure(errorData));
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
  try {
    yield takeLatest(identityActions.setIdentity.call, setIdentityWorker);
  } catch (e) {
    yield put(identityActions.setIdentity.failure(e));
  }
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
