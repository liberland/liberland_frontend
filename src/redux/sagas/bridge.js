import {
  put, takeLatest, cps, call, select,
} from 'redux-saga/effects';

import { ethers } from 'ethers';

import {
  bridgeDeposit,
  bridgeWithdraw,
  bridgeConstants,
  getBlockEvents,
} from '../../api/nodeRpcCall';

import { bridgeActions, blockchainActions, walletActions } from '../actions';
import { ethToSubReceiptId, ethToSubReceiptIdFromEvent, subToEthReceiptId } from '../../utils/bridge';
import { getSubstrateOutgoingReceipts } from '../../api/explorer';
import { blockchainSelectors, bridgeSelectors } from '../selectors';
import { bridgeBurn, getEthereumOutgoingReceipts, getTxReceipt } from '../../api/eth';

// WORKERS

function* withdrawWorker(action) {
  try {
    yield put(bridgeActions.updateTransferWithdrawTx.set({
      ...action.payload.values,
      withdrawTx: true,
    }));
    const { errorData } = yield cps(bridgeWithdraw, action.payload.values, action.payload.userWalletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(bridgeActions.withdraw.failure(errorData));
      yield put(bridgeActions.updateTransferWithdrawTx.set({
        ...action.payload.values,
        withdrawTx: false,
      }));
    } else {
      yield put(bridgeActions.withdraw.success());
    }
  } catch (errorData) {
    // eslint-disable-next-line no-console
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
    const { blockHash, events, errorData } = yield cps(
      bridgeDeposit,
      action.payload.values,
      action.payload.userWalletAddress,
    );
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(bridgeActions.deposit.failure(errorData));
    } else {
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
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.log('Error in bridge deposit worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(bridgeActions.deposit.failure(errorData));
  }
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
    const preload = yield select(bridgeSelectors.toEthereumPreload);
    if (!preload) {
      // eslint-disable-next-line no-console
      console.log('No preload to eth');
      const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
      const res = yield call(getSubstrateOutgoingReceipts, walletAddress);
      yield put(bridgeActions.getTransfersToEthereum.success(res));
    } else {
      // eslint-disable-next-line no-console
      console.log('Preload to eth');
      yield put(bridgeActions.getTransfersToEthereum.success({}));
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(bridgeActions.getTransfersToEthereum.failure());
  }
}

function* getTransfersToSubstrateWorker({ payload: address }) {
  try {
    const preload = yield select(bridgeSelectors.toSubstratePreload);
    if (!preload) {
      // eslint-disable-next-line no-console
      console.log('No preload to substrate');
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

      let transfers = events.LLD.reduce(_reducer('LLD'), {});
      transfers = events.LLM.reduce(_reducer('LLM'), transfers);
      yield put(bridgeActions.getTransfersToSubstrate.success(transfers));
    } else {
      // eslint-disable-next-line no-console
      console.log('Preload to substrate');
      const transfers = yield select(bridgeSelectors.toSubstrateTransfers);
      const pending = Object.values(transfers).filter((t) => t.receipt_id === null);
      for (const transfer of pending) {
        yield put(bridgeActions.monitorBurn.call(transfer));
      }
      yield put(bridgeActions.getTransfersToSubstrate.success({}));
    }
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
