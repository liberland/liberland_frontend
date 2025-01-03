import {
  put, takeLatest, takeEvery, call,
} from 'redux-saga/effects';
import {
  connectWallet,
  getTokenStakeContractInfo,
  getTokenStakeAddressInfo,
  getERC20Info,
  getERC20Balance,
  getAvailableWallets,
  getSwapExchangeRate,
  getBalance,
  stakeLPWithEth,
  stakeTokens,
  withdrawTokens,
} from '../../api/ethereum';
import { ethActions } from '../actions';
import { blockchainWatcher } from './base';

// WORKERS

function* stakeLpWithEthWorker(action) {
  yield call(stakeLPWithEth, action.payload);
  yield put(ethActions.getWethLpExchangeRate.call());
  yield put(ethActions.getBalance.call({ provider: action.payload.provider, address: action.payload.account }));
  yield put(ethActions.getErc20Balance.call(
    process.env.REACT_APP_THIRD_WEB_LLD_ADDRESS,
    action.payload.account,
  ));
}

function* stakeTokensWorker(action) {
  yield call(stakeTokens, action.payload);
}

function* withdrawTokensWorker(action) {
  yield call(withdrawTokens, action.payload);
}

function* getWethExchangeRateWorker(action) {
  try {
    const wallets = yield call(getSwapExchangeRate, action.payload);
    yield put(ethActions.getWethLpExchangeRate.success(wallets));
  } catch (e) {
    yield put(ethActions.getWethLpExchangeRate.failure(e));
  }
}

function* getBalanceWorker(action) {
  try {
    const balance = yield call(getBalance, action.payload);
    yield put(ethActions.getBalance.success(balance));
  } catch (e) {
    yield put(ethActions.getBalance.failure(e));
  }
}

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
    }));
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
    }));
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

function* stakeLpWithEthWatcher() {
  yield* blockchainWatcher(
    ethActions.stakeLpWithEth,
    stakeLpWithEthWorker,
  );
}

function* stakeTokensWatcher() {
  yield* blockchainWatcher(
    ethActions.stakeTokens,
    stakeTokensWorker,
  );
}

function* withdrawTokensWatcher() {
  yield* blockchainWatcher(
    ethActions.withdrawTokens,
    withdrawTokensWorker,
  );
}

function* getBalanceWatcher() {
  try {
    yield takeLatest(ethActions.getBalance.call, getBalanceWorker);
  } catch (e) {
    yield put(ethActions.getBalance.failure(e));
  }
}

function* getWethExchangeRateWatcher() {
  try {
    yield takeLatest(ethActions.getWethLpExchangeRate.call, getWethExchangeRateWorker);
  } catch (e) {
    yield put(ethActions.getWethLpExchangeRate.failure(e));
  }
}

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
  stakeTokensWatcher,
  stakeLpWithEthWatcher,
  withdrawTokensWatcher,
  getWethExchangeRateWatcher,
  getWalletOptionsWatcher,
  getWalletConnectingWatcher,
  tokenStakeContractInfoWatcher,
  tokenStakeAddressInfoWatcher,
  erc20InfoWatcher,
  erc20BalanceWatcher,
  getBalanceWatcher,
};
