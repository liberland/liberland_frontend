import { getAllWalletsList } from "thirdweb/wallets";
import { put, takeLatest, call } from 'redux-saga/effects';

import { ethActions } from '../actions';

// WORKERS

function* getWalletOptionsWorker(action) {
  try {
    const wallets = yield call(getAllWalletsList, action.payload);
    yield put(ethActions.getEthWalletOptions.success(wallets));
  } catch (e) {
    yield put(ethActions.getEthWalletOptions.failure(e));
  }
}

function* connectWalletWorker(action) {
  try {
    const connected = yield call(connectWallet, action.payload);
    yield put(ethActions.getEthWalletOptions.success(connected));
  } catch (e) {
    yield put(ethActions.getEthWalletOptions.failure(e));
  }
}

// WATCHERS

function* getWalletOptionsWatcher() {
  try {
    yield takeLatest(ethActions.getEthWalletOptions.call, getWalletOptionsWorker);
  } catch (e) {
    yield put(ethActions.getEthWalletOptions.failure(e));
  }
}

function* getWalletConnectingWatcher() {
  try {
    yield takeLatest(ethActions.getConnectedEthWallet.call, connectWalletWorker);
  } catch (e) {
    yield put(ethActions.getConnectedEthWallet.failure(e));
  }
}

export { getWalletOptionsWatcher, getWalletConnectingWatcher };