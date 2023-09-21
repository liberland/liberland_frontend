import {
  put, takeLatest, call, select,
} from 'redux-saga/effects';

import {
  getLegislation, castVetoForLegislation, revertVetoForLegislation, getCitizenCount,
} from '../../api/nodeRpcCall';
import { blockchainWatcher } from './base';
import { legislationActions } from '../actions';
import { blockchainSelectors } from '../selectors';

// WORKERS

function* getLegislationWorker({ payload: { tier } }) {
  const legislation = yield call(getLegislation, tier);
  yield put(legislationActions.getLegislation.success({
    tier,
    legislation,
  }));
}

function* getCitizenCountWorker() {
  try {
    const count = yield call(getCitizenCount);
    yield put(legislationActions.getCitizenCount.success(count));
  } catch (e) {
    yield put(legislationActions.getCitizenCount.failure(e));
  }
}

function* castVetoWorker({ payload: { tier, id, section } }) {
  const userWalletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(castVetoForLegislation, tier, id, section, userWalletAddress);
  yield put(legislationActions.castVeto.success());
  yield put(legislationActions.getLegislation.call({ tier }));
}

function* revertVetoWorker({ payload: { tier, id, section } }) {
  const userWalletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(revertVetoForLegislation, tier, id, section, userWalletAddress);
  yield put(legislationActions.revertVeto.success());
  yield put(legislationActions.getLegislation.call({ tier }));
}

// WATCHERS

function* getLegislationWatcher() {
  yield* blockchainWatcher(legislationActions.getLegislation, getLegislationWorker);
}

function* getCitizenCountWatcher() {
  try {
    yield takeLatest(legislationActions.getCitizenCount.call, getCitizenCountWorker);
  } catch (e) {
    yield put(legislationActions.getCitizenCount.failure(e));
  }
}

function* castVetoWatcher() {
  yield* blockchainWatcher(legislationActions.castVeto, castVetoWorker);
}

function* revertVetoWatcher() {
  yield* blockchainWatcher(legislationActions.revertVeto, revertVetoWorker);
}

export {
  getLegislationWatcher,
  getCitizenCountWatcher,
  castVetoWatcher,
  revertVetoWatcher,
};
