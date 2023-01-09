import {
  put, takeLatest, call, cps, select,
} from 'redux-saga/effects';

import {
  getBalanceByAddress,
  sendTransfer,
  sendTransferLLM,
  stakeToPolkaBondAndExtra,
  politiPool,
  getResultByHashRpc, getValidators, getNominatorTargets,
} from '../../api/nodeRpcCall';
// import api from '../../api';

import { blockchainActions, walletActions } from '../actions';
import { blockchainSelectors, walletSelectors } from '../selectors';
import { setErrorExistsAndUnacknowledgedByUser } from '../actions/blockchain';

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
    const blockHash = yield cps(politiPool, action.payload);
    const status = yield call(getResultByHashRpc, blockHash);
    yield put(walletActions.stakeToPolka.success());
    yield put(walletActions.getWallet.call());
  } catch
  (e) {
    yield put(walletActions.stakeToLiberland.failure(e));
  }
}

function* sendTransferWorker(action) {
  try {
    const blockHash = yield cps(sendTransfer, action.payload);
    const status = yield call(getResultByHashRpc, blockHash);
    if (status.result === 'failure') {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(status.error));
    }
    // TODO use block explorer for this
    if (result === 'success') {
      yield put(walletActions.sendTransfer.success());
      yield put(walletActions.getWallet.call());
    } else {
      yield put(walletActions.sendTransfer.failure());
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(walletActions.sendTransfer.failure(e));
  }
}

function* sendTransferLLMWorker(action) {
  try {
    const blockHash = yield cps(sendTransferLLM, action.payload);
    const status = yield call(getResultByHashRpc, blockHash);
    if (status.result === 'failure') {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(status.error));
    }
    if (result === 'success') {
      yield put(walletActions.sendTransferLLM.success());
      yield put(walletActions.getWallet.call());
    } else {
      yield put(walletActions.sendTransferLLM.failure());
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(walletActions.sendTransferLLM.failure(e));
  }
}

function* getValidatorsWorker() {
  try {
    const validators = yield call(getValidators);
    yield put(walletActions.getValidators.success(validators));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(walletActions.getValidators.failure(e));
  }
}

function* getNominatorTargetsWorker() {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const nominatorTargets = yield call(getNominatorTargets, walletAddress);
    yield put(walletActions.getNominatorTargets.success(nominatorTargets));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(walletActions.getNominatorTargets.failure(e));
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

function* sendTransferLLMWatcher() {
  try {
    yield takeLatest(walletActions.sendTransferLLM.call, sendTransferLLMWorker);
  } catch (e) {
    yield put(walletActions.sendTransferLLM.failure(e));
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

function* getValidatorsWatcher() {
  try {
    yield takeLatest(walletActions.getValidators.call, getValidatorsWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(walletActions.getValidators.failure(e));
  }
}

function* getNominatorTargetsWatcher() {
  try {
    yield takeLatest(walletActions.getNominatorTargets.call, getNominatorTargetsWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(walletActions.getNominatorTargets.failure(e));
  }
}

export {
  getWalletWatcher,
  sendTransferWatcher,
  sendTransferLLMWatcher,
  stakeToPolkaWatcher,
  stakeToLiberlandWatcher,
  getValidatorsWatcher,
  getNominatorTargetsWatcher,
};
