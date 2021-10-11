import {
  put, call, takeLatest, select, take, all,
} from 'redux-saga/effects';
import { blockchainActions } from '../actions';

import { blockchainSelectors } from '../selectors';

import { getCurrentBlockNumberRpc, getPeriodAndVotingDurationRpc } from '../../api/nodeRpcCall';

// WORKERS

function* getCurrentBlockNumberWorker() {
  try {
    const bockNumber = yield call(getCurrentBlockNumberRpc);
    yield put(blockchainActions.getCurrentBlockNumber.success(bockNumber));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.getCurrentBlockNumber.failure(e));
  }
}

function* getPeriodAndVotingDurationWorker() {
  try {
    const result = yield call(getPeriodAndVotingDurationRpc);
    yield put(blockchainActions.getPeriodAndVotingDuration.success(result));
  } catch (e) {
    yield put(blockchainActions.getPeriodAndVotingDuration.failure(e));
  }
}

function* setElectionsBlockWorker() {
  try {
    const block = yield select(blockchainSelectors.electionsBlockSelector);
    yield put(blockchainActions.setElectionsBlock.success(block));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.setElectionsBlock.failure(e));
  }
}

function* updateDateElectionsWorker() {
  try {
    yield put(blockchainActions.getCurrentBlockNumber.call());
    const nextElection = yield select(blockchainSelectors.nextElectionsBlockSelector);
    yield put(blockchainActions.setElectionsBlock.success(nextElection));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.updateDateElections.failure(e));
  }
}

// WATCHERS

function* fetchBlockNumberWatcher() {
  yield takeLatest(blockchainActions.getCurrentBlockNumber.call, getCurrentBlockNumberWorker);
}

function* getPeriodAndVotingDurationWatcher() {
  try {
    // eslint-disable-next-line max-len
    yield takeLatest(blockchainActions.getPeriodAndVotingDuration.call, getPeriodAndVotingDurationWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.getPeriodAndVotingDuration.failure(e));
  }
}

function* setElectionsBlockWatcher() {
  try {
    yield takeLatest(blockchainActions.setElectionsBlock.call, setElectionsBlockWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.setElectionsBlock.failure(e));
  }
}

function* runSetElectionsBlockWorker() {
  yield all([
    take(blockchainActions.getCurrentBlockNumber.success),
    take(blockchainActions.getPeriodAndVotingDuration.success),
  ]);
  yield put(blockchainActions.setElectionsBlock.call());
}

function* updateDateElectionsWatcher() {
  try {
    yield takeLatest(blockchainActions.updateDateElections.call, updateDateElectionsWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.updateDateElections.failure(e));
  }
}

export {
  fetchBlockNumberWatcher,
  getPeriodAndVotingDurationWatcher,
  setElectionsBlockWatcher,
  runSetElectionsBlockWorker,
  updateDateElectionsWatcher,
};
