import { call, put, select } from 'redux-saga/effects';
import {
  congressSenateSendAssets,
  congressSenateSendLld,
  congressSenateSendLlm,
  congressSenateSendLlmToPolitipool,
  getAdditionalAssets, getAdminMinistryFinance, getBalanceByAddress,
} from '../../api/nodeRpcCall';
import { blockchainWatcher } from './base';
import { palletIdToAddress } from '../../utils/pallet';
import { ministryFinanceActions } from '../actions';
import { blockchainSelectors, ministryFinanceSelector, officesSelectors } from '../selectors';
import { OfficeType } from '../../utils/officeTypeEnum';

const officeType = OfficeType.MINISTRY_FINANCE;

function* getWalletWorker() {
  const codeName = yield select(ministryFinanceSelector.codeName);
  const pallets = yield select(officesSelectors.selectorPallets);

  if (!pallets) {
    yield put(ministryFinanceActions.getWallet.failure());
    return;
  }
  const { palletId } = pallets.find((e) => e.palletName === codeName);
  const walletAddress = palletIdToAddress(palletId);
  const balances = yield call(getBalanceByAddress, walletAddress);
  const admin = yield call(getAdminMinistryFinance, walletAddress);
  yield put(ministryFinanceActions.getWallet.success({ balances, walletAddress, admin }));
}

export function* getWalletWatcher() {
  yield* blockchainWatcher(ministryFinanceActions.getWallet, getWalletWorker);
}

function* getAdditionalAssetsWorker() {
  const ministryFinanceWallet = yield select(ministryFinanceSelector.walletAddress);
  if (!ministryFinanceWallet) {
    yield put(ministryFinanceActions.getAdditionalAssets.failure());
    return;
  }

  const additionalAssets = yield call(
    getAdditionalAssets,
    ministryFinanceWallet,
  );
  yield put(ministryFinanceActions.getAdditionalAssets.success(additionalAssets));
}

export function* getAdditionalAssetsWatcher() {
  yield* blockchainWatcher(
    ministryFinanceActions.getAdditionalAssets,
    getAdditionalAssetsWorker,
  );
}

function* sendLlmToPolitipoolWorker({
  payload: {
    transferToAddress, transferAmount, remarkInfo, executionBlock,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(congressSenateSendLlmToPolitipool, {
    walletAddress,
    transferToAddress,
    transferAmount,
    remarkInfo,
    executionBlock,
    officeType,
  });
  yield put(ministryFinanceActions.sendLlmToPolitipool.success());
}

export function* sendLlmToPolitipoolWatcher() {
  yield* blockchainWatcher(
    ministryFinanceActions.sendLlmToPolitipool,
    sendLlmToPolitipoolWorker,
  );
}

function* sendLlmWorker({
  payload: {
    transferToAddress, transferAmount, remarkInfo,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(congressSenateSendLlm, {
    walletAddress,
    transferToAddress,
    transferAmount,
    remarkInfo,
    officeType,
  });
  yield put(ministryFinanceActions.sendLlm.success());
}

export function* sendLlmWatcher() {
  yield* blockchainWatcher(
    ministryFinanceActions.sendLlm,
    sendLlmWorker,
  );
}

function* sendLldWorker({
  payload: {
    transferToAddress, transferAmount, remarkInfo, executionBlock,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(congressSenateSendLld, {
    walletAddress,
    transferToAddress,
    transferAmount,
    remarkInfo,
    executionBlock,
    officeType,
  });
  yield put(ministryFinanceActions.sendLld.success());
}

export function* sendLldWatcher() {
  yield* blockchainWatcher(
    ministryFinanceActions.sendLld,
    sendLldWorker,
  );
}

function* sendAssetsTransfer({
  payload: {
    transferToAddress, transferAmount, assetData, remarkInfo, executionBlock,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(congressSenateSendAssets, {
    walletAddress,
    transferToAddress,
    transferAmount,
    assetData,
    remarkInfo,
    executionBlock,
    officeType,
  });
  yield put(ministryFinanceActions.sendAssets.success());
}

export function* sendAssetsTransferWatcher() {
  yield* blockchainWatcher(
    ministryFinanceActions.sendAssets,
    sendAssetsTransfer,
  );
}
