import {
  put, call, takeLatest, take,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { blockchainActions } from '../actions';
import {
  subscribeActiveEra, subscribeBestBlockNumber, fetchPreimage,
} from '../../api/nodeRpcCall';
import { blockchainWatcherEvery } from './base';

// WORKERS
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

export function* clearErrorsWatcher() {
  yield takeLatest(blockchainActions.setErrorExistsAndUnacknowledgedByUser.call, clearErrorsWorker);
}

export function* subscribeBestBlockNumberSaga() {
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

export function* subscribeActiveEraSaga() {
  const channel = eventChannel((emitter) => {
    const unsubPromise = subscribeActiveEra(emitter);
    return () => unsubPromise.then((unsub) => unsub());
  });

  while (true) {
    const activeEra = yield take(channel);
    yield put(blockchainActions.activeEra.value(activeEra));
  }
}

export function* fetchPreimageWatcher() {
  yield* blockchainWatcherEvery(blockchainActions.fetchPreimage, fetchPreimageWorker);
}

export function* subscribeWalletsSaga() {
  const channel = eventChannel((emitter) => {
    const updateWallets = async () => {
      const extensions = await web3Enable('Liberland dApp');
      const wallets = await web3Accounts();
      emitter({ extensions, wallets });
    };
    updateWallets();
    const interval = setInterval(updateWallets, 5000);
    setTimeout(() => clearInterval(interval), 120000);
    return () => clearInterval(interval);
  });

  while (true) {
    const { extensions, wallets } = yield take(channel);
    yield put(blockchainActions.setExtensions.value(extensions));
    yield put(blockchainActions.setWallets.value(wallets));
  }
}
