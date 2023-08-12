import {
  put, call, takeLatest, take,
} from 'redux-saga/effects';
import { web3Enable } from '@polkadot/extension-dapp';
import { blockchainActions } from '../actions';
import { eventChannel } from 'redux-saga';
import { subscribeBestBlockNumber, getAllWalletsRpc } from '../../api/nodeRpcCall';

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

// WORKERS

function* getAllWalletsWorker() {
  try {
    let retryCounter = 0;
    let extensions = yield call(web3Enable, 'Liberland dapp');
    if (extensions.length === 0) {
      // Hack, is caused by web3Enable needing a fully loaded page to work,
      // but i am not sure how to do it other way without larger refactor
      while (retryCounter < 30 && extensions.length === 0) {
        ++retryCounter;
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
  const channel = eventChannel(emitter => {
    const unsubPromise = subscribeBestBlockNumber(emitter);
    return () => unsubPromise.then(unsub => unsub());
  });

  while (true) {
    const bestNumber = yield take(channel);
    yield put(blockchainActions.bestBlockNumber.value({ bestNumber }));
  }
}


export {
  getAllWalletsWatcher,
  clearErrorsWatcher,
  subscribeBestBlockNumberSaga,
};
