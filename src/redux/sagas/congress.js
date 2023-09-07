import {
  put, takeLatest, call, cps, select,
} from 'redux-saga/effects';
import { congressActions, blockchainActions } from '../actions';
import { blockchainSelectors } from '../selectors';
import {
  applyForCongress,
  congressSendLlm,
  congressSendLlmToPolitipool,
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

function* congressSendLlmWorker({
  payload: {
    transferToAddress, transferAmount,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  const { errorData } = yield cps(congressSendLlm, {
    walletAddress, transferToAddress, transferAmount,
  });
  if (errorData.isError) {
    yield put(
      blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true),
    );
    yield put(blockchainActions.setError.success(errorData));
    yield put(congressActions.congressSendLlm.failure(errorData));
  } else {
    yield put(congressActions.congressSendLlm.success());
  }
}

function* congressSendLlmToPolitipoolWorker({
  payload: {
    transferToAddress, transferAmount,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  const { errorData } = yield cps(congressSendLlmToPolitipool, {
    walletAddress, transferToAddress, transferAmount,
  });
  if (errorData.isError) {
    yield put(
      blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true),
    );
    yield put(blockchainActions.setError.success(errorData));
    yield put(congressActions.congressSendLlmToPolitipool.failure(errorData));
  } else {
    yield put(congressActions.congressSendLlmToPolitipool.success());
  }
}

// WATCHERS

export function* applyForCongressWatcher() {
  try {
    yield takeLatest(
      congressActions.applyForCongress.call,
      applyForCongressWorker,
    );
  } catch (e) {
    yield put(congressActions.applyForCongress.failure(e));
  }
}

export function* getCongressCandidatesWatcher() {
  try {
    yield takeLatest(
      congressActions.getCongressCandidates.call,
      getCongressCandidatesWorker,
    );
  } catch (e) {
    yield put(congressActions.getCongressCandidates.failure(e));
  }
}

export function* getMotionsWatcher() {
  try {
    yield takeLatest(congressActions.getMotions.call, getMotionsWorker);
  } catch (e) {
    yield put(congressActions.getMotions.failure(e));
  }
}

export function* voteAtMotionsWatcher() {
  try {
    yield takeLatest(congressActions.voteAtMotions.call, voteAtMotionsWorker);
  } catch (e) {
    yield put(congressActions.voteAtMotions.failure(e));
  }
}

export function* congressSendLlmWatcher() {
  try {
    yield takeLatest(
      congressActions.congressSendLlm.call,
      congressSendLlmWorker,
    );
  } catch (e) {
    yield put(congressActions.congressSendLlm.failure(e));
  }
}

export function* congressSendLlmToPolitipoolWatcher() {
  try {
    yield takeLatest(
      congressActions.congressSendLlmToPolitipool.call,
      congressSendLlmToPolitipoolWorker,
    );
  } catch (e) {
    yield put(congressActions.congressSendLlmToPolitipool.failure(e));
  }
}