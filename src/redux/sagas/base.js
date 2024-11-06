import {
  put, takeEvery, takeLatest,
} from 'redux-saga/effects';
import { blockchainActions, routeActions } from '../actions';

function errorHandler(onFailure, worker) {
  function* errorHandledWorker(action) {
    try {
      yield* worker(action);
    } catch (e) {
      // eslint-disable-next-line no-console
      const isWallet = !e.stack.includes('Error: web3FromAddress: Unable to find injected');
      if (!isWallet) {
        yield put(routeActions.changeRoute.call('/liberland-login'));
      }
      yield put(onFailure(e));
      yield put(blockchainActions.setError.success(
        !isWallet ? { details: 'No wallet detected, you need to login.' } : e?.errorData || { details: e.message },
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
