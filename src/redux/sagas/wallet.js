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
  unpool,
} from '../../api/nodeRpcCall';
// import api from '../../api';
import { blockchainWatcher } from "./base";

import { blockchainActions, walletActions } from '../actions';
import { blockchainSelectors } from '../selectors';

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
  const { amount, isUserHavePolkaStake } = action.payload;
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(stakeToPolkaBondAndExtra, amount, isUserHavePolkaStake, walletAddress);
  yield put(walletActions.stakeToPolka.success());
  yield put(walletActions.getWallet.call());
}

function* unpoolWorker() {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const { blockHash, errorData } = yield cps(unpool, walletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(walletActions.unpool.failure())
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

function* sendTransferLLMWorker(action) {
  const userWalletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const { recipient, amount } = action.payload;
  yield call(sendTransferLLM, recipient, amount, userWalletAddress)
  yield put(walletActions.sendTransferLLM.success());
  yield put(walletActions.getWallet.call());
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

function* setNominatorTargetsWorker(action) {
  try {
    const { blockHash, errorData } = yield cps(setNominatorTargets, action.payload);
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

// WATCHERS

function* getWalletWatcher() {
  try {
    yield takeLatest(walletActions.getWallet.call, getWalletWorker);
  } catch (e) {
    yield put(walletActions.getWallet.failure(e));
  }
}

function* sendTransferWatcher() {
  yield* blockchainWatcher(walletActions.sendTransfer, sendTransferWorker);
}

function* sendTransferLLMWatcher() {
  yield* blockchainWatcher(walletActions.sendTransferLLM, sendTransferLLMWorker)
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

function* setNominatorTargetsWatcher() {
  try {
    yield takeLatest(walletActions.setNominatorTargets.call, setNominatorTargetsWorker);
  } catch (e) {
    yield put(walletActions.setNominatorTargets.failure(e));
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
  setNominatorTargetsWatcher,
  unpoolWatcher,
};
