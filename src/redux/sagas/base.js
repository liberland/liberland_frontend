import {
  put, select, takeEvery, takeLatest,
} from 'redux-saga/effects';
import { blockchainActions } from '../actions';
import { blockchainSelectors } from '../selectors';

function errorHandler(onFailure, worker) {
  function* errorHandledWorker(action) {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    try {
      yield* worker(action);
    } catch (e) {
      yield put(onFailure(e));
      yield put(blockchainActions.setError.success(
        !walletAddress
          ? { details: 'No wallet detected, you need to login.', type: 'LOGIN_ERROR' }
          : e?.errorData || { details: e.message, type: 'LOGIN_ERROR' },
      ));
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    }
  }
  return errorHandledWorker;
}

export function* blockchainWatcher({ call, failure }, worker) {
  yield takeLatest(call, errorHandler(failure, worker));
}

export function* blockchainWatcherEvery({ call, failure }, worker) {
  yield takeEvery(call, errorHandler(failure, worker));
}
