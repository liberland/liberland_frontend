import {
  put, select, takeEvery, takeLatest,
} from 'redux-saga/effects';
import { blockchainActions, routeActions } from '../actions';
import { blockchainSelectors } from '../selectors';

function errorHandler(onFailure, worker) {
  function* errorHandledWorker(action) {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    try {
      yield* worker(action);
    } catch (e) {
      // eslint-disable-next-line no-console
      if (!walletAddress) {
        yield put(routeActions.changeRoute.call('/liberland-login'));
      }
      yield put(onFailure(e));
      yield put(blockchainActions.setError.success(
        !walletAddress ? { details: 'No wallet detected, you need to login.' } : e?.errorData || { details: e.message },
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
