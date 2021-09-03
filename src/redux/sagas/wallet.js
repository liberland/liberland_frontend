import {
  put, takeLatest, call, delay,
} from 'redux-saga/effects';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import {
  getBalanceByAddress,
  sendTransfer,
  stakeToPolkaBondAndExtra,
  stakeToLiberlandBondAndExtra,
} from '../../api/nodeRpcCall';

import { walletActions } from '../actions';

// WORKERS

function* getWalletWorker() {
  try {
    const extensions = yield web3Enable('Liberland dapp');
    if (extensions.length) {
      const [accounts] = yield web3Accounts();
      const balances = yield call(getBalanceByAddress, accounts.address);
      yield put(walletActions.getWallet.success({ ...accounts, balances }));
    } else {
      yield put(walletActions.getWallet.failure());
    }
  } catch (e) {
    yield put(walletActions.getWallet.failure(e));
  }
}

function* stakeToPolkaWorker(action) {
  try {
    const extensions = yield web3Enable('Liberland dapp');
    if (extensions.length) {
      yield call(stakeToPolkaBondAndExtra, action.payload);
      yield delay(15000);
      yield put(walletActions.stakeToPolka.success());
      yield put(walletActions.getWallet.call());
    }
  } catch (e) {
    yield put(walletActions.stakeToPolka.failure(e));
  }
}

function* stakeToLiberlandWorker(action) {
  try {
    const extensions = yield web3Enable('Liberland dapp');
    if (extensions.length) {
      yield call(stakeToLiberlandBondAndExtra, action.payload);
      yield delay(15000);
      yield put(walletActions.stakeToPolka.success());
      yield put(walletActions.getWallet.call());
    }
  } catch
  (e) {
    yield put(walletActions.stakeToLiberland.failure(e));
  }
}
function* sendTransferWorker(action) {
  try {
    yield sendTransfer(action.payload);
    yield put(walletActions.sendTransfer.success);
    yield put(walletActions.getWallet.call);
  } catch (e) {
    yield put(walletActions.sendTransfer.failure(e));
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

export {
  getWalletWatcher,
  sendTransferWatcher,
  stakeToPolkaWatcher,
  stakeToLiberlandWatcher,
};
