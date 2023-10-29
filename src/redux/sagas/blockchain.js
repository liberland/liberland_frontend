import {
  put, call, takeLatest, take,
} from 'redux-saga/effects';
import { web3Enable } from '@polkadot/extension-dapp';
import { eventChannel } from 'redux-saga';
import { blockchainActions } from '../actions';
import { subscribeActiveEra, subscribeBestBlockNumber, getAllWalletsRpc, fetchPreimage } from '../../api/nodeRpcCall';
import { blockchainWatcherEvery } from './base';

const delay = (time) => new Promise((resolve) => { setTimeout(resolve, time); });

// WORKERS

function* getAllWalletsWorker() {
  try {
    let retryCounter = 0;
    let extensions = yield call(web3Enable, 'Liberland dapp');
    if (extensions.length === 0) {
      // Hack, is caused by web3Enable needing a fully loaded page to work,
      // but i am not sure how to do it other way without larger refactor
      while (retryCounter < 30 && extensions.length === 0) {
        retryCounter += 1;
        yield call(delay, 1000);
        extensions = yield call(web3Enable, 'Liberland dapp');
      }
    }
    if (extensions.length) {
      const allWallets = yield call(getAllWalletsRpc);
      yield put(blockchainActions.getAllWallets.success(allWallets));
    } else {
      alert('You need a wallet manager like polkadot{js} browser extension to use this page');
      yield put(blockchainActions.getAllWallets.failure('No enable Extensione'));
    }
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

function* fetchPreimageWorker({ payload: { hash, len }}) {
  const preimage = yield call(fetchPreimage, hash, len);
  yield put(blockchainActions.fetchPreimage.success({
    hash, preimage
  }))
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
    yield put(blockchainActions.bestBlockNumber.value({ bestNumber }));
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
