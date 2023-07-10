import {
  put, takeLatest, cps, call, select,
} from 'redux-saga/effects';

import { ethers } from 'ethers';

import {
  bridgeDeposit,
  bridgeWithdraw,
  bridgeWithdrawalDelay,
  getBlockEvents,
} from '../../api/nodeRpcCall';

import { bridgeActions, blockchainActions } from '../actions';
import { ethToSubReceiptId, ethToSubReceiptIdFromEvent, subToEthReceiptId } from '../../utils/bridge';
import { getSubstrateOutgoingReceipts } from '../../api/explorer';
import { blockchainSelectors, bridgeSelectors } from '../selectors';
import { bridgeBurn, getEthereumOutgoingReceipts, getTxReceipt } from '../../api/eth';
import { bridgeTransfersLocalStorageMiddleware } from '../store/localStorage';

// WORKERS

function* withdrawWorker(action) {
  try {
    yield put(bridgeActions.updateTransferWithdrawTx.set({
      ...action.payload.values,
      withdrawTx: true,
    }));
    const { blockHash, errorData } = yield cps(bridgeWithdraw, action.payload.values, action.payload.userWalletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(bridgeActions.withdraw.failure(errorData));
      yield put(bridgeActions.updateTransferWithdrawTx.set({
        ...action.payload.values,
        withdrawTx: false,
      }));
    }
    else {
      yield put(bridgeActions.withdraw.success());
    }
  } catch (errorData) {
    console.log('Error in bridge withdraw worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(bridgeActions.withdraw.failure(errorData));
    yield put(bridgeActions.updateTransferWithdrawTx.set({
      ...action.payload.values,
      withdrawTx: false,
    }));
  }
}

function* depositWorker(action) {
  try {
    const { blockHash, status, events, errorData } = yield cps(bridgeDeposit, action.payload.values, action.payload.userWalletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(bridgeActions.deposit.failure(errorData));
    }
    else {
      const blockEvents = yield call(getBlockEvents, blockHash);
      const extrinsicIndex = events[0].phase.asApplyExtrinsic;
      const receiptEventIndex = blockEvents.findIndex(({ phase, event }) =>
        phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(extrinsicIndex) &&
        event.method == "OutgoingReceipt"
      );
      const { amount, ethRecipient } = blockEvents[receiptEventIndex].event.data;
      let receipt_id = subToEthReceiptId(blockHash, receiptEventIndex, amount, ethRecipient);
      yield put(bridgeActions.deposit.success({
        receipt_id,
        asset: action.payload.values.asset,
        amount: amount.toHex(),
        ethRecipient: ethRecipient.toHex(),
        blockHash,
        date: Date.now(),
      }));
    }
  } catch (errorData) {
    console.log('Error in bridge deposit worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(bridgeActions.deposit.failure(errorData));
  }
}

function* burnWorker(action) {
  const txHash = yield call(bridgeBurn, action.payload);
  const { asset, amount, substrateRecipient } = action.payload;
  const transfer = {
    txHash,
    asset,
    amount: ethers.utils.formatUnits(amount, 0),
    substrateRecipient,
    date: Date.now(),
    receipt_id: null,
    blockHash: null,
    status: null,
    withdrawTx: false,
  }
  yield put(bridgeActions.burn.success(transfer));
  yield put(bridgeActions.monitorBurn.call(transfer));
}

function* monitorBurnWorker(action) {
  const ethers_receipt = yield call(getTxReceipt, action.payload);
  const receipt_id = ethToSubReceiptId(ethers_receipt);
  const { txHash, asset } = action.payload;
  yield put(bridgeActions.monitorBurn.success({ txHash, asset, receipt_id, blockHash: ethers_receipt.blockHash }));
}

function* getTransfersToEthereumWorker() {
  const preload = yield select(bridgeSelectors.toEthereumPreload);
  if (!preload) {
    console.log("No preload to eth");
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const res = yield call(getSubstrateOutgoingReceipts, walletAddress);
    yield put(bridgeActions.getTransfersToEthereum.success(res));
  } else {
    console.log("Preload to eth");
    yield put(bridgeActions.getTransfersToEthereum.success({}));
  }
}

function* getTransfersToSubstrateWorker({ payload: address }) {
  const preload = yield select(bridgeSelectors.toSubstratePreload);
  if (!preload) {
    console.log("No preload to substrate");
    const events = yield call(getEthereumOutgoingReceipts, address);
    const _reducer = asset => (transfers, event) => {
      const txHash = event.transactionHash;
      transfers[txHash] = {
        txHash,
        asset,
        amount: ethers.utils.formatUnits(event.args.amount, 0),
        substrateRecipient: event.args.substrateRecipient,
        date: 1000 * event.blockTimestamp,
        receipt_id: ethToSubReceiptIdFromEvent(event),
        blockHash: event.blockHash,
        status: null,
        withdrawTx: false,
      };
      return transfers;
    };
    let transfers = events.LLD.reduce(_reducer('LLD'), {});
    transfers = events.LLM.reduce(_reducer('LLM'), transfers);
    yield put(bridgeActions.getTransfersToSubstrate.success(transfers));
  } else {
    console.log("Preload to substrate");
    const transfers = yield select(bridgeSelectors.toSubstrateTransfers);
    const pending = Object.values(transfers).filter(t => t.receipt_id === null);
    for (const transfer of pending) {
      yield put(bridgeActions.monitorBurn.call(transfer));
    }
    yield put(bridgeActions.getTransfersToSubstrate.success({}));
  }
}

function* getWithdrawalDelaysWorker() {
  const LLM = yield call(bridgeWithdrawalDelay, 'LLM');
  const LLD = yield call(bridgeWithdrawalDelay, 'LLD');
  yield put(bridgeActions.getWithdrawalDelays.success({ LLM: LLM.toNumber(), LLD: LLD.toNumber() }));
}

// WATCHERS

function* withdrawWatcher() {
  try {
    yield takeLatest(bridgeActions.withdraw.call, withdrawWorker);
  } catch (e) {
    yield put(bridgeActions.withdraw.failure(e));
  }
}

function* depositWatcher() {
  try {
    yield takeLatest(bridgeActions.deposit.call, depositWorker);
  } catch (e) {
    yield put(bridgeActions.deposit.failure(e));
  }
}

function* burnWatcher() {
  try {
    yield takeLatest(bridgeActions.burn.call, burnWorker);
  } catch (e) {
    yield put(bridgeActions.burn.failure(e));
  }
}

function* monitorBurnWatcher() {
  try {
    yield takeLatest(bridgeActions.monitorBurn.call, monitorBurnWorker);
  } catch (e) {
    yield put(bridgeActions.monitorBurn.failure(e));
  }
}

function* getTransfersToEthereumWatcher() {
  try {
    yield takeLatest(bridgeActions.getTransfersToEthereum.call, getTransfersToEthereumWorker);
  } catch (e) {
    yield put(bridgeActions.getTransfersToEthereum.failure(e));
  }
}

function* getTransfersToSubstrateWatcher() {
  try {
    yield takeLatest(bridgeActions.getTransfersToSubstrate.call, getTransfersToSubstrateWorker);
  } catch (e) {
    yield put(bridgeActions.getTransfersToSubstrate.failure(e));
  }
}

function* getWithdrawalDelaysWatcher() {
  try {
    yield takeLatest(bridgeActions.getWithdrawalDelays.call, getWithdrawalDelaysWorker);
  } catch (e) {
    yield put(bridgeActions.getWithdrawalDelays.failure(e));
  }
}

export {
  withdrawWatcher,
  depositWatcher,
  burnWatcher,
  monitorBurnWatcher,
  getTransfersToEthereumWatcher,
  getTransfersToSubstrateWatcher,
  getWithdrawalDelaysWatcher,
};
