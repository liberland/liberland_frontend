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
  getAssetDetails,
  transferWithRemark,
  mintAsset,
  createOrUpdateAsset,
} from '../../api/nodeRpcCall';
import { checkPayment } from '../../api/middleware';
import { getHistoryTransfers } from '../../api/explorer';

import { walletActions } from '../actions';
import { blockchainSelectors } from '../selectors';
import { blockchainWatcher } from './base';

// WORKERS

function* checkPaymentWorker(action) {
  const isPaid = yield call(checkPayment, action.payload);
  if (isPaid) {
    yield put(walletActions.checkPayment.success());
  }
}

function* getWalletWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  if (!walletAddress) {
    yield put(walletActions.getWallet.failure());
    return;
  }
  const balances = yield call(getBalanceByAddress, walletAddress);
  yield put(walletActions.getWallet.success({ balances }));
}

function* getAdditionalAssetsWorker(action) {
  const isLlmNeeded = action.payload || false;
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const additionalAssets = yield call(getAdditionalAssets, walletAddress, false, isLlmNeeded);
  yield put(walletActions.getAdditionalAssets.success(additionalAssets));
}

function* getAssetDetailsWorker(action) {
  const details = yield call(getAssetDetails, action.payload);
  yield put(walletActions.getAssetsDetails.success(details));
}

function* getAssetsBalanceWorker(action) {
  const assets = action.payload;
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const assetsBalance = yield Promise.all(
    assets.map(async (asset) => {
      if (asset === 'Native') {
        const { liquidAmount } = await getBalanceByAddress(walletAddress);
        return { [asset]: liquidAmount?.amount || 0 };
      }
      const assetData = await getAssetData(asset, walletAddress);
      return { [asset]: assetData || 0 };
    }),
  ).then((balancesArray) => balancesArray.reduce((acc, curr) => ({ ...acc, ...curr }), {}));
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

function* sendTransferRemarkWorker(action) {
  const { transferData, remarkInfo } = action.payload;
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(transferWithRemark, remarkInfo, transferData, walletAddress);
  yield put(walletActions.sendTransferRemark.success());
  yield put(walletActions.getWallet.call());
}

function* mintAssetWorker(action) {
  yield call(mintAsset, action.payload);
  yield put(walletActions.mintAsset.success());
  yield put(walletActions.getAdditionalAssets.call());
}

function* createOrUpdateAssetWorker(action) {
  yield call(createOrUpdateAsset, action.payload);
  yield put(walletActions.createOrUpdateAsset.success());
  yield put(walletActions.getAdditionalAssets.call());
}

// WATCHERS

function* checkPaymentWatcher() {
  yield* blockchainWatcher(walletActions.checkPayment, checkPaymentWorker);
}

function* sendTransferWithRemarkWatcher() {
  yield* blockchainWatcher(walletActions.sendTransferRemark, sendTransferRemarkWorker);
}

function* mintAssetWatcher() {
  yield* blockchainWatcher(walletActions.mintAsset, mintAssetWorker);
}

function* createOrUpdateAssetWatcher() {
  yield* blockchainWatcher(walletActions.createOrUpdateAsset, createOrUpdateAssetWorker);
}

function* getWalletWatcher() {
  yield* blockchainWatcher(walletActions.getWallet, getWalletWorker);
}

function* getAdditionalAssetsWatcher() {
  yield* blockchainWatcher(walletActions.getAdditionalAssets, getAdditionalAssetsWorker);
}

function* getAssetDetailsWatcher() {
  yield* blockchainWatcher(walletActions.getAssetsDetails, getAssetDetailsWorker);
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
  getAssetDetailsWatcher,
  sendTransferWithRemarkWatcher,
  mintAssetWatcher,
  createOrUpdateAssetWatcher,
  checkPaymentWatcher,
};
