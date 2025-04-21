import { call, put, select } from 'redux-saga/effects';
import {
  congressSenateSendAssets,
  congressSenateSendLld,
  congressSenateSendLlm,
  congressSenateSendLlmToPolitipool,
  getAdditionalAssets, getClerksMinistryFinance, getBalanceByAddress,
} from '../../api/nodeRpcCall';
import { blockchainWatcher } from './base';
import { palletIdToAddress } from '../../utils/pallet';
import { ministryFinanceActions } from '../actions';
import { blockchainSelectors, ministryFinanceSelector, officesSelectors } from '../selectors';
import { OfficeType } from '../../utils/officeTypeEnum';
import { fetchMinistryOfFinanceSpending, fetchMinistryOfFinanceSpendingCount } from '../../api/middleware';

const officeType = OfficeType.MINISTRY_FINANCE;

function* getWalletWorker() {
  const codeName = yield select(ministryFinanceSelector.codeName);
  const pallets = yield select(officesSelectors.selectorPallets);

  if (!pallets) {
    yield put(ministryFinanceActions.ministryFinanceGetWallet.failure());
    return;
  }
  const { palletId } = pallets.find((e) => e.palletName === codeName);
  const walletAddress = palletIdToAddress(palletId);
  const balances = yield call(getBalanceByAddress, walletAddress);
  const clerksIds = yield call(getClerksMinistryFinance, walletAddress);
  yield put(ministryFinanceActions.ministryFinanceGetWallet.success({ balances, walletAddress, clerksIds }));
}

function* spendingWorker({ payload: { skip, take } }) {
  const spending = yield call(fetchMinistryOfFinanceSpending, skip, take);
  yield put(ministryFinanceActions.ministryFinanceSpending.success({ data: spending, from: skip }));
}

function* spendingCountWorker() {
  const count = yield call(fetchMinistryOfFinanceSpendingCount);
  yield put(ministryFinanceActions.ministryFinanceSpendingCount.success({ count }));
}

export function* getWalletWatcher() {
  yield* blockchainWatcher(ministryFinanceActions.ministryFinanceGetWallet, getWalletWorker);
}

function* getAdditionalAssetsWorker() {
  const ministryFinanceWallet = yield select(ministryFinanceSelector.walletAddress);
  if (!ministryFinanceWallet) {
    yield put(ministryFinanceActions.ministryFinanceGetAdditionalAssets.failure());
    return;
  }

  const additionalAssets = yield call(
    getAdditionalAssets,
    ministryFinanceWallet,
  );
  yield put(ministryFinanceActions.ministryFinanceGetAdditionalAssets.success(additionalAssets));
}

export function* getAdditionalAssetsWatcher() {
  yield* blockchainWatcher(
    ministryFinanceActions.ministryFinanceGetAdditionalAssets,
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
  yield put(ministryFinanceActions.ministryFinanceSendLlmToPolitipool.success());
  yield call(getWalletWorker);
}

export function* sendLlmToPolitipoolWatcher() {
  yield* blockchainWatcher(
    ministryFinanceActions.ministryFinanceSendLlmToPolitipool,
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
  yield put(ministryFinanceActions.ministryFinanceSendLlm.success());
  yield call(getWalletWorker);
}

export function* sendLlmWatcher() {
  yield* blockchainWatcher(
    ministryFinanceActions.ministryFinanceSendLlm,
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
  yield put(ministryFinanceActions.ministryFinanceSendLld.success());
  yield call(getWalletWorker);
}

export function* sendLldWatcher() {
  yield* blockchainWatcher(
    ministryFinanceActions.ministryFinanceSendLld,
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
  yield put(ministryFinanceActions.ministryFinanceSendAssets.success());
  yield call(getAdditionalAssetsWorker);
}

export function* sendAssetsTransferWatcher() {
  yield* blockchainWatcher(
    ministryFinanceActions.ministryFinanceSendAssets,
    sendAssetsTransfer,
  );
}

export function* ministryOfFinanceSpendingWatcher() {
  yield* blockchainWatcher(
    ministryFinanceActions.ministryFinanceSpending,
    spendingWorker,
  );
}

export function* ministryOfFinanceSpendingCountWatcher() {
  yield* blockchainWatcher(
    ministryFinanceActions.ministryFinanceSpendingCount,
    spendingCountWorker,
  );
}
