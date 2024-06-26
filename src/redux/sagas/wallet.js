import {
  put, takeLatest, call, select,
} from 'redux-saga/effects';

import {
  getBalanceByAddress,
  sendTransfer,
  sendTransferLLM,
  stakeToPolkaBondAndExtra,
  politiPool,
  getValidators, getNominatorTargets,
  setNominatorTargets,
  unpool, getAdditionalAssets, sendAssetTransfer,
  getAssetData,
} from '../../api/nodeRpcCall';
import { getHistoryTransfers } from '../../api/explorer';

import { walletActions } from '../actions';
import { blockchainSelectors } from '../selectors';
import { blockchainWatcher } from './base';

// WORKERS

function* getWalletWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const balances = yield call(getBalanceByAddress, walletAddress);
  yield put(walletActions.getWallet.success({ ...walletAddress, balances }));
}

function* getAdditionalAssetsWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const additionalAssets = yield call(getAdditionalAssets, walletAddress);
  yield put(walletActions.getAdditionalAssets.success(additionalAssets));
}

function* getAssetsBalanceWorker(action) {
  const assets = action.payload;
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const assetsBalance = yield Promise.all(assets.map(async (asset) => {
    if (asset === 'Native') {
      const { liquidAmount } = await getBalanceByAddress(walletAddress);
      return liquidAmount?.amount || 0;
    }
    const assetData = await getAssetData(asset, walletAddress);
    return assetData || 0;
  }));
  yield put(walletActions.getAssetsBalance.success(assetsBalance));
}

function* stakeToPolkaWorker(action) {
  const { amount, isUserHavePolkaStake } = action.payload;
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(stakeToPolkaBondAndExtra, amount, isUserHavePolkaStake, walletAddress);
  yield put(walletActions.stakeToPolka.success());
  yield put(walletActions.getWallet.call());
}

function* unpoolWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(unpool, walletAddress);
  yield put(walletActions.unpool.success());
  yield put(walletActions.getWallet.call());
}

function* stakeToLiberlandWorker(action) {
  const { amount } = action.payload;
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(politiPool, amount, walletAddress);
  yield put(walletActions.stakeToLiberland.success());
  yield put(walletActions.getWallet.call());
}

function* sendTransferWorker(action) {
  const { recipient, amount } = action.payload;
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(sendTransfer, recipient, amount, walletAddress);
  yield put(walletActions.sendTransfer.success());
  yield put(walletActions.getWallet.call());
}

function* sendAssetsWorker(action) {
  const { recipient, amount, assetData } = action.payload;
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(sendAssetTransfer, recipient, amount, walletAddress, assetData);
  yield put(walletActions.sendAssetsTransfer.success());
  yield put(walletActions.getAdditionalAssets.call());
}

function* sendTransferLLMWorker(action) {
  const userWalletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const { recipient, amount } = action.payload;
  yield call(sendTransferLLM, recipient, amount, userWalletAddress);
  yield put(walletActions.sendTransferLLM.success());
  yield put(walletActions.getWallet.call());
}

function* getValidatorsWorker() {
  const validators = yield call(getValidators);
  yield put(walletActions.getValidators.success(validators));
}

function* getNominatorTargetsWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const nominatorTargets = yield call(getNominatorTargets, walletAddress);
  yield put(walletActions.getNominatorTargets.success(nominatorTargets));
}

function* setNominatorTargetsWorker(action) {
  yield call(setNominatorTargets, action.payload);
  yield put(walletActions.setNominatorTargets.success());
  yield put(walletActions.getWallet.call());
  yield put(walletActions.getNominatorTargets.call());
}

function* getTransfersTxWorker() {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  try {
    const transfers = yield call(getHistoryTransfers, walletAddress);
    yield put(walletActions.getTxTransfers.success(transfers));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(walletActions.getTxTransfers.failure());
  }
}

// WATCHERS

function* getWalletWatcher() {
  yield* blockchainWatcher(walletActions.getWallet, getWalletWorker);
}

function* getAdditionalAssetsWatcher() {
  yield* blockchainWatcher(walletActions.getAdditionalAssets, getAdditionalAssetsWorker);
}

function* getAssetsBalanceWatcher() {
  yield* blockchainWatcher(walletActions.getAssetsBalance, getAssetsBalanceWorker);
}

function* sendTransferWatcher() {
  yield* blockchainWatcher(walletActions.sendTransfer, sendTransferWorker);
}

function* sendAssetsWatcher() {
  yield* blockchainWatcher(walletActions.sendAssetsTransfer, sendAssetsWorker);
}

function* sendTransferLLMWatcher() {
  yield* blockchainWatcher(walletActions.sendTransferLLM, sendTransferLLMWorker);
}

function* stakeToPolkaWatcher() {
  yield* blockchainWatcher(walletActions.stakeToPolka, stakeToPolkaWorker);
}

function* unpoolWatcher() {
  yield* blockchainWatcher(walletActions.unpool, unpoolWorker);
}

function* stakeToLiberlandWatcher() {
  yield* blockchainWatcher(walletActions.stakeToLiberland, stakeToLiberlandWorker);
}

function* getValidatorsWatcher() {
  yield* blockchainWatcher(walletActions.getValidators, getValidatorsWorker);
}

function* getNominatorTargetsWatcher() {
  yield* blockchainWatcher(walletActions.getNominatorTargets, getNominatorTargetsWorker);
}

function* setNominatorTargetsWatcher() {
  yield* blockchainWatcher(walletActions.setNominatorTargets, setNominatorTargetsWorker);
}

export function* getTransfersTxWatcher() {
  yield takeLatest(walletActions.getTxTransfers.call, getTransfersTxWorker);
}

export {
  getWalletWatcher,
  getAdditionalAssetsWatcher,
  sendTransferWatcher,
  sendAssetsWatcher,
  sendTransferLLMWatcher,
  stakeToPolkaWatcher,
  stakeToLiberlandWatcher,
  getValidatorsWatcher,
  getNominatorTargetsWatcher,
  setNominatorTargetsWatcher,
  unpoolWatcher,
  getAssetsBalanceWatcher,
};
