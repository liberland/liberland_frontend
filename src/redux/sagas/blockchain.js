import {
  put, call, takeLatest, take,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { blockchainActions } from '../actions';
import {
  subscribeActiveEra, subscribeBestBlockNumber, getAllWalletsRpc, fetchPreimage,
} from '../../api/nodeRpcCall';
import { blockchainWatcherEvery } from './base';

// WORKERS
function* getAllWalletsWorker() {
  try {
    const allWallets = yield call(getAllWalletsRpc);
    yield put(blockchainActions.getAllWallets.success(allWallets));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(blockchainActions.getAllWallets.failure(e));
  }
}

function* clearErrorsWorker(action) {
  yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(action.payload));
  yield put(blockchainActions.setError.success(''));
}

function* fetchPreimageWorker({ payload: { hash, len } }) {
  const preimage = yield call(fetchPreimage, hash, len);
  yield put(blockchainActions.fetchPreimage.success({
    hash, preimage,
  }));
}

// WATCHERS

function* getAllWalletsWatcher() {
  try {
    yield takeLatest(blockchainActions.getAllWallets.call, getAllWalletsWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(blockchainActions.updateDateElections.failure(e));
  }
}

function* clearErrorsWatcher() {
  yield takeLatest(blockchainActions.setErrorExistsAndUnacknowledgedByUser.call, clearErrorsWorker);
}

function* subscribeBestBlockNumberSaga() {
  const channel = eventChannel((emitter) => {
    const unsubPromise = subscribeBestBlockNumber(emitter);
    return () => unsubPromise.then((unsub) => unsub());
  });

  while (true) {
    const bestNumber = yield take(channel);
    yield put(blockchainActions.bestBlockNumber.value({
      bestNumber,
      timestamp: Date.now(),
    }));
  }
}

function* subscribeActiveEraSaga() {
  const channel = eventChannel((emitter) => {
    const unsubPromise = subscribeActiveEra(emitter);
    return () => unsubPromise.then((unsub) => unsub());
  });

  while (true) {
    const activeEra = yield take(channel);
    yield put(blockchainActions.activeEra.value(activeEra));
  }
}

function* fetchPreimageWatcher() {
  yield* blockchainWatcherEvery(blockchainActions.fetchPreimage, fetchPreimageWorker);
}

export {
  getAllWalletsWatcher,
  clearErrorsWatcher,
  subscribeBestBlockNumberSaga,
  subscribeActiveEraSaga,
  fetchPreimageWatcher,
};
