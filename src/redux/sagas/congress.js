import {
  put, takeLatest, call, cps, select,
} from 'redux-saga/effects';
import { congressActions, blockchainActions } from '../actions';
import { blockchainSelectors } from '../selectors';
import {
  applyForCongress,
  getCongressCandidates,
  getMotions,
  voteAtMotions,
} from '../../api/nodeRpcCall';

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

function* getMotionsWorker() {
  const motions = yield call(getMotions);
  yield put(congressActions.getMotions.success(motions));
}

function* voteAtMotionsWorker(action) {
  const { readableProposal, index, vote } = action.payload;
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );

  const { errorData } = yield cps(
    voteAtMotions,
    walletAddress,
    readableProposal,
    index,
    vote,
  );
  if (errorData.isError) {
    yield put(
      blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true),
    );
    yield put(blockchainActions.setError.success(errorData));
    yield put(congressActions.voteAtMotions.failure(errorData));
  } else {
    yield put(congressActions.getMotions.call());
    yield put(congressActions.voteAtMotions.success());
  }
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

function* getMotionsWatcher() {
  try {
    yield takeLatest(congressActions.getMotions.call, getMotionsWorker);
  } catch (e) {
    yield put(congressActions.getMotions.failure(e));
  }
}

function* voteAtMotionsWatcher() {
  try {
    yield takeLatest(congressActions.voteAtMotions.call, voteAtMotionsWorker);
  } catch (e) {
    yield put(congressActions.voteAtMotions.failure(e));
  }
}

export {
  applyForCongressWatcher,
  getCongressCandidatesWatcher,
  getMotionsWatcher,
  voteAtMotionsWatcher,
};
