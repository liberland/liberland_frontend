import {
  put, takeLatest, call, cps,
} from 'redux-saga/effects';

import {
  getLegislation, castVetoForLegislation, revertVetoForLegislation,
} from '../../api/nodeRpcCall';

import { blockchainActions, legislationActions } from '../actions';

// WORKERS

function* getLegislationWorker(action) {
  try {
    const legislation = yield call(getLegislation, action.payload);
    yield put(legislationActions.getLegislation.success({
      tier: action.payload,
      legislation,
    }));
  } catch (e) {
    yield put(legislationActions.getLegislation.failure(e));
  }
}

function* castVetoWorker(action) {
  try {
    const { blockHash, errorData } = yield cps(castVetoForLegislation, action.payload.tier, action.payload.index, action.payload.userWalletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(legislationActions.castVeto.failure(errorData));
    }
    else {
      yield put(legislationActions.castVeto.success())
      yield put(legislationActions.getLegislation.call(action.payload.tier));
    }
  } catch (errorData) {
    console.log('Error in veto legislation worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(legislationActions.castVeto.failure(errorData));
  }
}

function* revertVetoWorker(action) {
  try {
    const { blockHash, errorData } = yield cps(revertVetoForLegislation, action.payload.tier, action.payload.index, action.payload.userWalletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(legislationActions.revertVeto.failure(errorData));
    } else {
      yield put(legislationActions.revertVeto.success())
      yield put(legislationActions.getLegislation.call(action.payload.tier));
    }
  } catch (errorData) {
    console.log('Error in veto legislation worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(legislationActions.revertVeto.failure(errorData));
  }
}


// WATCHERS

function* getLegislationWatcher() {
  try {
    yield takeLatest(legislationActions.getLegislation.call, getLegislationWorker);
  } catch (e) {
    yield put(legislationActions.getLegislation.failure(e));
  }
}

function* castVetoWatcher() {
  try {
    yield takeLatest(legislationActions.castVeto.call, castVetoWorker);
  } catch (e) {
    yield put(legislationActions.castVeto.failure(e));
  }
}

function* revertVetoWatcher() {
  try {
    yield takeLatest(legislationActions.revertVeto.call, revertVetoWorker);
  } catch (e) {
    yield put(legislationActions.revertVeto.failure(e));
  }
}


export {
  getLegislationWatcher,
  castVetoWatcher,
  revertVetoWatcher,
};
