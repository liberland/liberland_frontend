import {
  put, takeLatest, cps, call,
} from 'redux-saga/effects';

import {
  bridgeDeposit,
  bridgeWithdraw,
  getBlockEvents,
} from '../../api/nodeRpcCall';

import { bridgeActions, blockchainActions } from '../actions';
import { subToEthReceiptId } from '../../utils/bridge';

// WORKERS

function* withdrawWorker(action) {
  try {
    yield put(bridgeActions.updateTransferWithdrawTx.set({
      asset: action.payload.values.asset,
      receipt_id: action.payload.values.receipt_id,
      withdraw_tx: true,
    }));
    const { blockHash, errorData } = yield cps(bridgeWithdraw, action.payload.values, action.payload.userWalletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(bridgeActions.withdraw.failure(errorData));
      yield put(bridgeActions.updateTransferWithdrawTx.set({
        asset: action.payload.values.asset,
        receipt_id: action.payload.values.receipt_id,
        withdraw_tx: false,
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
      asset: action.payload.values.asset,
      receipt_id: action.payload.values.receipt_id,
      withdraw_tx: false,
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

export {
  withdrawWatcher,
  depositWatcher,
};
