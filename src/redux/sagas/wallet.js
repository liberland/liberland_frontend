import {
  put, takeLatest, call, cps, select,
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
} from '../../api/nodeRpcCall';
import { getDollarsTransfers, getMeritsTransfers } from '../../api/explorer';

import { blockchainActions, walletActions } from '../actions';
import { blockchainSelectors } from '../selectors';
import { blockchainWatcher } from './base';
import {sendAssetsTransfer} from "../actions/wallet";

// WORKERS

function* getWalletWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const balances = yield call(getBalanceByAddress, walletAddress);
  yield put(walletActions.getWallet.success({ ...walletAddress, balances }));
}

function* getAdditionalAssetsWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const additionalAssets = yield call(getAdditionalAssets, walletAddress)
  yield put(walletActions.getAdditionalAssets.success(additionalAssets))
}

function* stakeToPolkaWorker(action) {
  const { amount, isUserHavePolkaStake } = action.payload;
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(stakeToPolkaBondAndExtra, amount, isUserHavePolkaStake, walletAddress);
  yield put(walletActions.stakeToPolka.success());
  yield put(walletActions.getWallet.call());
}

function* unpoolWorker() {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const { errorData } = yield cps(unpool, walletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(walletActions.unpool.failure());
    } else {
      yield put(walletActions.unpool.success());
      yield put(walletActions.getWallet.call());
    }
  } catch (errorData) {
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(walletActions.unpool.failure(errorData));
  }
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
  yield call(sendAssetTransfer, recipient, amount, walletAddress, assetData)
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
  try {
    const { errorData } = yield cps(setNominatorTargets, action.payload);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(walletActions.setNominatorTargets.failure());
    } else {
      yield put(walletActions.setNominatorTargets.success());
      yield put(walletActions.getWallet.call());
      yield put(walletActions.getNominatorTargets.call());
    }
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.error(errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(walletActions.setNominatorTargets.failure(errorData));
  }
}

function* getLlmTransfersWorker() {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  try {
    const transfers = yield call(getMeritsTransfers, walletAddress);
    yield put(walletActions.getLlmTransfers.success(transfers));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(walletActions.getLlmTransfers.failure());
  }
}

function* getLldTransfersWorker() {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  try {
    const transfers = yield call(getDollarsTransfers, walletAddress);
    yield put(walletActions.getLldTransfers.success(transfers));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(walletActions.getLldTransfers.failure());
  }
}

// WATCHERS

function* getWalletWatcher() {
  yield* blockchainWatcher(walletActions.getWallet, getWalletWorker);
}

function* getAdditionalAssetsWatcher() {
  yield* blockchainWatcher(walletActions.getAdditionalAssets, getAdditionalAssetsWorker);
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
  try {
    yield takeLatest(walletActions.unpool.call, unpoolWorker);
  } catch (e) {
    yield put(walletActions.unpool.failure(e));
  }
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
  try {
    yield takeLatest(walletActions.setNominatorTargets.call, setNominatorTargetsWorker);
  } catch (e) {
    yield put(walletActions.setNominatorTargets.failure(e));
  }
}

export function* getLlmTransfersWatcher() {
  yield takeLatest(walletActions.getLlmTransfers.call, getLlmTransfersWorker);
}

export function* getLldTransfersWatcher() {
  yield takeLatest(walletActions.getLldTransfers.call, getLldTransfersWorker);
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
};
