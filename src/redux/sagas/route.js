import { put, takeLatest } from 'redux-saga/effects';
import { routeActions } from '../actions';

function* changeRouteWorker(action) {
  try {
    yield put(routeActions.changeRoute.success(action.payload));
  } catch (e) {
    yield put(routeActions.changeRoute.failure(e));
  }
}

// WATCHERS

export function* changeRouteWatcher() {
  try {
    yield takeLatest(routeActions.changeRoute.call, changeRouteWorker);
  } catch (e) {
    yield put(routeActions.changeRoute.failure(e));
  }
}
