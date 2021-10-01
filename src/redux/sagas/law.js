import { takeLatest, call, put } from 'redux-saga/effects';
import { lawsActions } from '../actions';

import api from '../../api';

// WORKERS

function* getCurrentLawsWorker() {
  try {
    const { data: { proposals } } = yield call(api.get, '/assembly/get_all_proposals_approved');
    yield put(lawsActions.getCurrentLaws.success(proposals));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(lawsActions.getCurrentLaws.failure(e));
  }
}

// WATCHERS

function* getCurrentLawsWatcher() {
  try {
    yield takeLatest(lawsActions.getCurrentLaws.call, getCurrentLawsWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(lawsActions.getCurrentLaws.failure(e));
  }
}

export {
  getCurrentLawsWatcher,
};
