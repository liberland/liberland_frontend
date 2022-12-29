import {
  put, takeLatest, call,
} from 'redux-saga/effects';

import {
  getLegislation,
} from '../../api/nodeRpcCall';

import { legislationActions } from '../actions';

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

// WATCHERS

function* getLegislationWatcher() {
  try {
    yield takeLatest(legislationActions.getLegislation.call, getLegislationWorker);
  } catch (e) {
    yield put(legislationActions.getLegislation.failure(e));
  }
}

export {
  getLegislationWatcher,
};
