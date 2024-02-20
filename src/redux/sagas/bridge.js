import {
  put, takeLatest, call, select,
} from 'redux-saga/effects';

import { ethers } from 'ethers';

import {
  bridgeDeposit,
  bridgeWithdraw,
  bridgeConstants,
  getBlockEvents,
} from '../../api/nodeRpcCall';

import { bridgeActions, walletActions } from '../actions';
import { ethToSubReceiptId, ethToSubReceiptIdFromEvent, subToEthReceiptId } from '../../utils/bridge';
import { getSubstrateOutgoingReceipts } from '../../api/explorer';
import { blockchainSelectors, bridgeSelectors } from '../selectors';
import { bridgeBurn, getEthereumOutgoingReceipts, getTxReceipt } from '../../api/eth';

import { blockchainWatcher } from './base';

// WORKERS

function* withdrawWorker(action) {
  yield put(bridgeActions.updateTransferWithdrawTx.set({
    ...action.payload.values,
    withdrawTx: true,
  }));
  try {
    yield call(bridgeWithdraw, action.payload.values, action.payload.userWalletAddress);
    yield put(bridgeActions.withdraw.success());
  } catch (error) {
    yield put(bridgeActions.updateTransferWithdrawTx.set({
      ...action.payload.values,
      withdrawTx: false,
    }));
    throw error;
  }
}

function* depositWorker(action) {
  const { blockHash, events } = yield call(
    bridgeDeposit,
    action.payload.values,
    action.payload.userWalletAddress,
  );
  const blockEvents = yield call(getBlockEvents, blockHash);
  const extrinsicIndex = events[0].phase.asApplyExtrinsic;
  const receiptEventIndex = blockEvents.findIndex(
    ({ phase, event }) => phase.isApplyExtrinsic
    && phase.asApplyExtrinsic.eq(extrinsicIndex)
    && event.method === 'OutgoingReceipt',
  );
  const { amount, ethRecipient } = blockEvents[receiptEventIndex].event.data;
  const receipt_id = subToEthReceiptId(blockHash, receiptEventIndex, amount, ethRecipient);

  yield put(bridgeActions.deposit.success({
    receipt_id,
    asset: action.payload.values.asset,
    amount: amount.toHex(),
    ethRecipient: ethRecipient.toHex(),
    blockHash,
    date: Date.now(),
  }));
  yield put(walletActions.getWallet.call());
}

function* burnWorker(action) {
  try {
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
    };
    yield put(bridgeActions.burn.success(transfer));
    yield put(bridgeActions.monitorBurn.call(transfer));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
}

function* monitorBurnWorker(action) {
  try {
    const ethers_receipt = yield call(getTxReceipt, action.payload);
    const receipt_id = ethToSubReceiptId(ethers_receipt);
    const { txHash, asset } = action.payload;
    yield put(bridgeActions.monitorBurn.success({
      txHash, asset, receipt_id, blockHash: ethers_receipt.blockHash,
    }));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
}

function* getTransfersToEthereumWorker() {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const res = yield call(getSubstrateOutgoingReceipts, walletAddress);
    yield put(bridgeActions.getTransfersToEthereum.success(res));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(bridgeActions.getTransfersToEthereum.failure());
  }
}

function* getTransfersToSubstrateWorker({ payload: address }) {
  try {
    const events = yield call(getEthereumOutgoingReceipts, address);
    const _reducer = (asset) => (transfers, event) => ({
      ...transfers,
      [event.transactionHash]: {
        txHash: event.transactionHash,
        asset,
        amount: ethers.utils.formatUnits(event.args.amount, 0),
        substrateRecipient: event.args.substrateRecipient,
        date: 1000 * event.blockTimestamp,
        receipt_id: ethToSubReceiptIdFromEvent(event),
        blockHash: event.blockHash,
        status: null,
        withdrawTx: false,
      },
    });

    let transfersGlobal = {};
    transfersGlobal = events.LLD.reduce(_reducer('LLD'), {});
    transfersGlobal = events.LLM.reduce(_reducer('LLM'), transfersGlobal);

    const transfers = yield select(bridgeSelectors.toSubstrateTransfers);
    const pending = Object.values(transfers).filter((t) => t.receipt_id === null);
    for (const transfer of pending) {
      yield put(bridgeActions.monitorBurn.call(transfer));
    }

    yield put(bridgeActions.getTransfersToSubstrate.success(transfersGlobal));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
}

function* getBridgesConstantsWorker() {
  try {
    const LLM = yield call(bridgeConstants, 'LLM');
    const LLD = yield call(bridgeConstants, 'LLD');
    yield put(bridgeActions.getBridgesConstants.success({ LLM, LLD }));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    throw e;
  }
}

// WATCHERS

function* withdrawWatcher() {
  yield* blockchainWatcher(bridgeActions.withdraw, withdrawWorker);
}

function* depositWatcher() {
  yield* blockchainWatcher(bridgeActions.deposit, depositWorker);
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
  yield takeLatest(bridgeActions.getTransfersToEthereum.call, getTransfersToEthereumWorker);
}

function* getTransfersToSubstrateWatcher() {
  try {
    yield takeLatest(bridgeActions.getTransfersToSubstrate.call, getTransfersToSubstrateWorker);
  } catch (e) {
    yield put(bridgeActions.getTransfersToSubstrate.failure(e));
  }
}

function* getBridgesConstantsWatcher() {
  try {
    yield takeLatest(bridgeActions.getBridgesConstants.call, getBridgesConstantsWorker);
  } catch (e) {
    yield put(bridgeActions.getBridgesConstants.failure(e));
  }
}

export {
  withdrawWatcher,
  depositWatcher,
  burnWatcher,
  monitorBurnWatcher,
  getTransfersToEthereumWatcher,
  getTransfersToSubstrateWatcher,
  getBridgesConstantsWatcher,
};
