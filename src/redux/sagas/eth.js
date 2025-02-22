import {
  put, call,
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
  claimRewards,
} from '../../api/ethereum';
import { ethActions } from '../actions';
import { blockchainWatcher, blockchainWatcherEvery } from './base';

// WORKERS

function* stakeLpWithEthWorker(action) {
  try {
    const userEthAddress = yield call(() => action.payload.account.getAddress());
    yield call(stakeLPWithEth, action.payload);
    yield put(ethActions.getWethLpExchangeRate.call());
    yield put(ethActions.getBalance.call({ provider: action.payload.provider, address: userEthAddress }));
    yield put(ethActions.getErc20Balance.call({
      erc20Address: process.env.REACT_APP_THIRD_WEB_LLD_ADDRESS,
      account: userEthAddress,
    }));
    yield put(ethActions.getTokenStakeAddressInfo.call({ userEthAddress }));
  } catch (e) {
    console.error(e);
    throw e;
  }
}

function* stakeTokensWorker(action) {
  const userEthAddress = yield call(() => action.payload.account.getAddress());
  yield call(stakeTokens, action.payload);
  yield put(ethActions.stakeTokens.success());
  yield put(ethActions.getTokenStakeAddressInfo.call({ userEthAddress }));
}

function* withdrawTokensWorker(action) {
  const userEthAddress = yield call(() => action.payload.account.getAddress());
  yield call(withdrawTokens, action.payload);
  yield put(ethActions.withdrawTokens.success());
  yield put(ethActions.getTokenStakeAddressInfo.call({ userEthAddress }));
}

function* claimRewardsWorker(action) {
  const userEthAddress = yield call(() => action.payload.account.getAddress());
  yield call(claimRewards, action.payload);
  yield put(ethActions.claimReward.success());
  yield put(ethActions.getTokenStakeAddressInfo.call({ userEthAddress }));
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

function* claimRewardsWatcher() {
  yield* blockchainWatcher(
    ethActions.claimReward,
    claimRewardsWorker,
  );
}

function* getBalanceWatcher() {
  yield* blockchainWatcher(
    ethActions.getBalance,
    getBalanceWorker,
  );
}

function* getWethExchangeRateWatcher() {
  yield* blockchainWatcher(
    ethActions.getWethLpExchangeRate,
    getWethExchangeRateWorker,
  );
}

function* tokenStakeContractInfoWatcher() {
  yield* blockchainWatcher(
    ethActions.getTokenStakeContractInfo,
    tokenStakeContractInfoWorker,
  );
}

function* tokenStakeAddressInfoWatcher() {
  yield* blockchainWatcher(
    ethActions.getTokenStakeAddressInfo,
    tokenStakeAddressInfoWorker,
  );
}

function* erc20InfoWatcher() {
  yield* blockchainWatcherEvery(
    ethActions.getErc20Info,
    erc20InfoWorker,
  );
}

function* erc20BalanceWatcher() {
  yield* blockchainWatcherEvery(
    ethActions.getErc20Balance,
    erc20BalanceWorker,
  );
}

function* getWalletOptionsWatcher() {
  yield* blockchainWatcher(
    ethActions.getEthWalletOptions,
    getWalletOptionsWorker,
  );
}

function* getWalletConnectingWatcher() {
  yield* blockchainWatcher(
    ethActions.getConnectedEthWallet,
    connectWalletWorker,
  );
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
  claimRewardsWatcher,
};
