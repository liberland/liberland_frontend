import {
  put, takeLatest, call, cps, select,
} from 'redux-saga/effects';
import { congressActions, blockchainActions } from '../actions';
import { blockchainSelectors } from '../selectors';
import { applyForCongress, getCongressCandidates } from '../../api/nodeRpcCall';

// WORKERS

function* applyForCongressWorker() {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );

  const { errorData } = yield cps(applyForCongress, walletAddress);
  if (errorData.isError) {
    yield put(
      blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true),
    );
    yield put(blockchainActions.setError.success(errorData));
    yield put(congressActions.applyForCongress.failure(errorData));
  } else {
    yield put(congressActions.getCongressCandidates.call());
    yield put(congressActions.applyForCongress.success());
  }
}

function* getCongressCandidatesWorker() {
  const candidates = yield call(getCongressCandidates);
  yield put(congressActions.getCongressCandidates.success(candidates));
}

// WATCHERS

function* applyForCongressWatcher() {
  try {
    yield takeLatest(
      congressActions.applyForCongress.call,
      applyForCongressWorker,
    );
  } catch (e) {
    yield put(congressActions.applyForCongress.failure(e));
  }
}

function* getCongressCandidatesWatcher() {
  try {
    yield takeLatest(
      congressActions.getCongressCandidates.call,
      getCongressCandidatesWorker,
    );
  } catch (e) {
    yield put(congressActions.getCongressCandidates.failure(e));
  }
}
export { applyForCongressWatcher, getCongressCandidatesWatcher };
