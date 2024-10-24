import { put, takeLatest, takeEvery, call } from 'redux-saga/effects';
import {
  connectWallet,
  getTokenStakeContractInfo,
  getTokenStakeAddressInfo,
  getERC20Info,
  getERC20Balance,
  getAvailableWallets,
} from '../../api/ethereum';
import { ethActions } from '../actions';

// WORKERS

function* getWalletOptionsWorker(action) {
  try {
    const wallets = yield call(getAvailableWallets, action.payload);
    yield put(ethActions.getEthWalletOptions.success(wallets));
  } catch (e) {
    yield put(ethActions.getEthWalletOptions.failure(e));
  }
}

function* connectWalletWorker(action) {
  try {
    const connected = yield call(connectWallet, action.payload);
    yield put(ethActions.getConnectedEthWallet.success(connected));
  } catch (e) {
    yield put(ethActions.getConnectedEthWallet.failure(e));
  }
}

function* tokenStakeContractInfoWorker(action) {
  try {
    const tokenStakeContractInfo = yield call(getTokenStakeContractInfo, action.payload);
    yield put(ethActions.getTokenStakeContractInfo.success(tokenStakeContractInfo));
  } catch (e) {
    yield put(ethActions.getTokenStakeContractInfo.failure(e));
  }
}

function* tokenStakeAddressInfoWorker(action) {
  try {
    const tokenStakeAddressInfo = yield call(getTokenStakeAddressInfo, action.payload);
    yield put(ethActions.getTokenStakeAddressInfo.success({
      ...tokenStakeAddressInfo,
      ...action.payload,
    }))
  } catch (e) {
    yield put(ethActions.getTokenStakeAddressInfo.failure({
      ...e,
      ...action.payload,
    }));
  }
}

function* erc20InfoWorker(action) {
  try {
    const erc20Info = yield call(getERC20Info, action.payload);
    yield put(ethActions.getErc20Info.success({
      ...erc20Info,
      ...action.payload,
    }))
  } catch (e) {
    yield put(ethActions.getErc20Info.failure({
      ...e,
      ...action.payload,
    }));
  }
}

function* erc20BalanceWorker(action) {
  try {
    const erc20Balance = yield call(getERC20Balance, action.payload);
    yield put(ethActions.getErc20Balance.success({
      ...erc20Balance,
      ...action.payload,
    }));
  } catch (e) {
    yield put(ethActions.getErc20Balance.failure({
      ...e,
      ...action.payload,
    }));
  }
}

// WATCHERS

function* tokenStakeContractInfoWatcher() {
  try {
    yield takeLatest(ethActions.getTokenStakeContractInfo.call, tokenStakeContractInfoWorker);
  } catch (e) {
    yield put(ethActions.getTokenStakeContractInfo.failure(e));
  }
}

function* tokenStakeAddressInfoWatcher() {
  try {
    yield takeLatest(ethActions.getTokenStakeAddressInfo.call, tokenStakeAddressInfoWorker);
  } catch (e) {
    yield put(ethActions.getTokenStakeAddressInfo.failure(e));
  }
}

function* erc20InfoWatcher() {
  try {
    yield takeEvery(ethActions.getErc20Info.call, erc20InfoWorker);
  } catch (e) {
    yield put(ethActions.getErc20Info.failure(e));
  }
}

function* erc20BalanceWatcher() {
  try {
    yield takeEvery(ethActions.getErc20Balance.call, erc20BalanceWorker);
  } catch (e) {
    yield put(ethActions.getErc20Balance.failure(e));
  }
}

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

export {
  getWalletOptionsWatcher,
  getWalletConnectingWatcher,
  tokenStakeContractInfoWatcher,
  tokenStakeAddressInfoWatcher,
  erc20InfoWatcher,
  erc20BalanceWatcher,
};