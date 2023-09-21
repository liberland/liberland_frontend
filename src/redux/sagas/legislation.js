import {
  put, takeLatest, call, cps,
} from 'redux-saga/effects';

import {
  getLegislation, castVetoForLegislation, revertVetoForLegislation, getCitizenCount,
} from '../../api/nodeRpcCall';

import { blockchainActions, legislationActions } from '../actions';

// WORKERS

function* getLegislationWorker({ payload: { tier } }) {
  try {
    const legislation = yield call(getLegislation, tier);
    yield put(legislationActions.getLegislation.success({
      tier,
      legislation,
    }));
  } catch (e) {
    yield put(legislationActions.getLegislation.failure(e));
  }
}

function* getCitizenCountWorker() {
  try {
    const count = yield call(getCitizenCount);
    yield put(legislationActions.getCitizenCount.success(count));
  } catch (e) {
    yield put(legislationActions.getCitizenCount.failure(e));
  }
}

function* castVetoWorker({ payload: { tier, id, userWalletAddress } }) {
  try {
    const { errorData } = yield cps(castVetoForLegislation, tier, id, userWalletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(legislationActions.castVeto.failure(errorData));
    } else {
      yield put(legislationActions.castVeto.success());
      yield put(legislationActions.getLegislation.call({ tier }));
    }
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.log('Error in veto legislation worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(legislationActions.castVeto.failure(errorData));
  }
}

function* revertVetoWorker({ payload: { tier, id, userWalletAddress } }) {
  try {
    const { errorData } = yield cps(revertVetoForLegislation, tier, id, userWalletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(legislationActions.revertVeto.failure(errorData));
    } else {
      yield put(legislationActions.revertVeto.success());
      yield put(legislationActions.getLegislation.call({ tier }));
    }
  } catch (errorData) {
    // eslint-disable-next-line no-console
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

function* getCitizenCountWatcher() {
  try {
    yield takeLatest(legislationActions.getCitizenCount.call, getCitizenCountWorker);
  } catch (e) {
    yield put(legislationActions.getCitizenCount.failure(e));
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
  getCitizenCountWatcher,
  castVetoWatcher,
  revertVetoWatcher,
};
