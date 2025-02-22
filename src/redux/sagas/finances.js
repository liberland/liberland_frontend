import { put, takeLatest, call } from 'redux-saga/effects';

import { getFinancialMetrics } from '../../api/middleware';

import { financesActions } from '../actions';

// WORKERS

function* getFinances(action) {
  try {
    const finances = yield call(getFinancialMetrics, action.payload);
    yield put(financesActions.getFinances.success(finances));
  } catch (e) {
    yield put(financesActions.getFinances.failure(e));
  }
}

// WATCHERS

function* getFinancesWatcher() {
  try {
    yield takeLatest(financesActions.getFinances.call, getFinances);
  } catch (e) {
    yield put(financesActions.getFinances.failure(e));
  }
}

export { getFinancesWatcher };
