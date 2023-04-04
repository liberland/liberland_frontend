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
  try {
    const { blockHash, errorData } = yield cps(stakeToPolkaBondAndExtra, action.payload);
    console.log('errorData')
    console.log(errorData)
    if (errorData.isError) {
      console.log('is error')
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(walletActions.stakeToPolka.failure())
    } else {
      yield put(walletActions.stakeToPolka.success());
      yield put(walletActions.getWallet.call());
    }
  } catch (errorData) {
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(walletActions.stakeToPolka.failure(errorData));
  }
}

function* unpoolWorker(action) {
  try {
    const { blockHash, errorData } = yield cps(unpool, action.payload);
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
  try {
    const { blockHash, errorData } = yield cps(politiPool, action.payload);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(walletActions.stakeToLiberland.failure())
    } else {
      yield put(walletActions.stakeToLiberland.success());
      yield put(walletActions.getWallet.call());
    }
  } catch (errorData) {
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(walletActions.stakeToLiberland.failure(errorData));
  }
}

function* sendTransferWorker(action) {
  try {
    const { blockHash, errorData } = yield cps(sendTransfer, action.payload);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(walletActions.sendTransfer.failure(errorData));
    } else {
      yield put(walletActions.sendTransfer.success());
      yield put(walletActions.getWallet.call());
    }
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.error(errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(walletActions.sendTransfer.failure(errorData));
  }
}

function* sendTransferLLMWorker(action) {
  try {
    const { blockHash, errorData } = yield cps(sendTransferLLM, action.payload);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(walletActions.sendTransferLLM.failure(errorData));
    } else {
      yield put(walletActions.sendTransferLLM.success());
      yield put(walletActions.getWallet.call());
    }
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.error(errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(walletActions.sendTransferLLM.failure(errorData));
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

function* unpoolWatcher() {
  try {
    yield takeLatest(walletActions.unpool.call, unpoolWorker);
  } catch (e) {
    yield put(walletActions.unpool.failure(e));
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
