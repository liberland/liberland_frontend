import { put, takeLatest } from 'redux-saga/effects';
import { blockchainActions } from '../actions';

function errorHandler(onFailure, worker) {
  function* errorHandledWorker(action) {
    try {
      yield* worker(action);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      yield put(onFailure(e));
      yield put(blockchainActions.setError.success(e?.errorData || e.message));
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    }
  }
  return errorHandledWorker;
}

export function* blockchainWatcher({ call, failure }, worker) {
  yield takeLatest(call, errorHandler(failure, worker));
}
