import {
  put, call, takeLatest, select, take, all,
} from 'redux-saga/effects';
import { web3Enable } from '@polkadot/extension-dapp';
import { blockchainActions } from '../actions';

import { getCurrentBlockNumberRpc, getAllWalletsRpc } from '../../api/nodeRpcCall';

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

// WORKERS

function* getCurrentBlockNumberWorker() {
  try {
    const bockNumber = yield call(getCurrentBlockNumberRpc);
    yield put(blockchainActions.getCurrentBlockNumber.success(bockNumber));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.getCurrentBlockNumber.failure(e));
  }
}

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
    console.log(e);
    yield put(blockchainActions.getAllWallets.failure(e));
  }
}

function* clearErrorsWorker(action) {
  console.log('action');
  console.log(action);
  yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(action.payload));
  yield put(blockchainActions.setError.success(''));
}

// WATCHERS

function* fetchBlockNumberWatcher() {
  yield takeLatest(blockchainActions.getCurrentBlockNumber.call, getCurrentBlockNumberWorker);
}

function* getAllWalletsWatcher() {
  try {
    yield takeLatest(blockchainActions.getAllWallets.call, getAllWalletsWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.updateDateElections.failure(e));
  }
}

function* clearErrorsWatcher() {
  yield takeLatest(blockchainActions.setErrorExistsAndUnacknowledgedByUser.call, clearErrorsWorker);
}

export {
  fetchBlockNumberWatcher,
  getAllWalletsWatcher,
  clearErrorsWatcher,
};
