import {
  put, call, takeLatest,
} from 'redux-saga/effects';
import { blockchainActions } from '../actions';

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
export {
  fetchBlockNumberWatcher,
  getPeriodAndVotingDurationWatcher,
};
