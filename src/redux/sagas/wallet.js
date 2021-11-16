import {
  put, takeLatest, call, cps, select,
} from 'redux-saga/effects';

import {
  getBalanceByAddress,
  sendTransfer,
  stakeToPolkaBondAndExtra,
  stakeToLiberlandBondAndExtra,
  getResultByHashRpc,
} from '../../api/nodeRpcCall';
import api from '../../api';

import { walletActions } from '../actions';
import { blockchainSelectors, walletSelectors } from '../selectors';

// WORKERS

function* getWalletWorker() {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const balances = yield call(getBalanceByAddress, walletAddress);
    yield put(walletActions.getWallet.success({ ...walletAddress, balances }));
  } catch (e) {
    yield put(walletActions.getWallet.failure(e));
  }
}

function* stakeToPolkaWorker(action) {
  try {
    yield cps(stakeToPolkaBondAndExtra, action.payload);
    yield put(walletActions.stakeToPolka.success());
    yield put(walletActions.getWallet.call());
  } catch (e) {
    yield put(walletActions.stakeToPolka.failure(e));
  }
}

function* stakeToLiberlandWorker(action) {
  try {
    yield cps(stakeToLiberlandBondAndExtra, action.payload);
    yield put(walletActions.stakeToPolka.success());
    yield put(walletActions.getWallet.call());
  } catch
  (e) {
    yield put(walletActions.stakeToLiberland.failure(e));
  }
}

function* sendTxToDb(tx) {
  try {
    const { data: { result } } = yield call(api.post, '/wallet/insert_tx', tx);
    return result;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Error in sendTxToDb', e);
    return 'failure';
  }
}

function* sendTransferWorker(action) {
  try {
    const blockHash = yield cps(sendTransfer, action.payload);
    const status = yield call(getResultByHashRpc, blockHash);
    const tx = { ...action.payload, status };
    const result = yield call(sendTxToDb, tx);
    if (result === 'success') {
      yield put(walletActions.sendTransfer.success());
      yield put(walletActions.getWallet.call());
      yield put(walletActions.getThreeTx.call());
    } else {
      yield put(walletActions.sendTransfer.failure());
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(walletActions.sendTransfer.failure(e));
  }
}

function* getThreeTxWorker() {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const { data: { threeTx } } = yield call(api.post, 'wallet/get_tree_tx', { walletAddress });
    // eslint-disable-next-line array-callback-return
    yield threeTx.rows.map((oneTx) => {
      // eslint-disable-next-line no-param-reassign
      if (oneTx.account_from === walletAddress) oneTx.amount *= (-1);
    });
    yield put(walletActions.getThreeTx.success(threeTx));
  } catch (e) {
    yield put(walletActions.getThreeTx.failure(e));
  }
}

function* getMoreTxWorker() {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const currentPage = yield select(walletSelectors.selectorCurrentPageNumber);
    const countAllRows = yield select(walletSelectors.selectorCountAllRows);
    const allTx = yield select(walletSelectors.selectorAllHistoryTx);
    const offset = 7 * currentPage;
    if (countAllRows > offset) {
      const { data: { historyTx } } = yield call(api.post, 'wallet/get_more_tx', { walletAddress, offset });
      const updatedData = yield historyTx.map((oneRow) => {
        // eslint-disable-next-line no-param-reassign
        if (oneRow.account_from === walletAddress) oneRow.amount *= (-1);
        return oneRow;
      });
      const oldAndNew = [...updatedData, ...allTx];
      yield put(walletActions.getMoreTx.success(oldAndNew));
      yield put(walletActions.setCurrentPageNumber.success(currentPage + 1));
    } else {
      yield put(walletActions.getMoreTx.failure);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(walletActions.getMoreTx.failure(e));
  }
}

// WATCHERS

function* getWalletWatcher() {
  try {
    yield takeLatest(walletActions.getWallet.call, getWalletWorker);
  } catch (e) {
    yield put(walletActions.getWallet.failure(e));
  }
}

function* sendTransferWatcher() {
  try {
    yield takeLatest(walletActions.sendTransfer.call, sendTransferWorker);
  } catch (e) {
    yield put(walletActions.sendTransfer.failure(e));
  }
}

function* stakeToPolkaWatcher() {
  try {
    yield takeLatest(walletActions.stakeToPolka.call, stakeToPolkaWorker);
  } catch (e) {
    yield put(walletActions.stakeToPolka.failure(e));
  }
}

function* stakeToLiberlandWatcher() {
  try {
    yield takeLatest(walletActions.stakeToLiberland.call, stakeToLiberlandWorker);
  } catch (e) {
    yield put(walletActions.stakeToLiberland.failure(e));
  }
}

function* getThreeTxWatcher() {
  try {
    yield takeLatest(walletActions.getThreeTx.call, getThreeTxWorker);
  } catch (e) {
    yield put(walletActions.getThreeTx.failure(e));
  }
}

function* getMoreTxWatcher() {
  try {
    yield takeLatest(walletActions.getMoreTx.call, getMoreTxWorker);
  } catch (e) {
    yield put(walletActions.getMoreTx.failure(e));
  }
}

export {
  getWalletWatcher,
  sendTransferWatcher,
  stakeToPolkaWatcher,
  stakeToLiberlandWatcher,
  getThreeTxWatcher,
  getMoreTxWatcher,
};
