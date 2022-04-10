import {
  takeLatest,
  put,
  call,
} from 'redux-saga/effects';
import { web3Enable } from '@polkadot/extension-dapp';

import { getUserRoleRpc, getUserPassportId } from '../../api/nodeRpcCall';
import {
  authActions, votingActions, walletActions, blockchainActions,
} from '../actions';
import routes from '../../router';
import api from '../../api';

function* signInWorker(action) {
  try {
    const { credentials, history } = action.payload;
    const { data: user } = yield call(api.post, '/users/signin', credentials);
    yield put(blockchainActions.setUserWallet.success(credentials.wallet_address));
    yield sessionStorage.setItem('userWalletAddress', credentials.wallet_address);
    const extensions = yield web3Enable('Liberland dapp');
    if (extensions.length) {
      user.role = yield call(getUserRoleRpc, credentials.wallet_address);
      user.passportId = yield call(getUserPassportId, credentials.wallet_address);
      yield put(authActions.signIn.success(user));
      yield put(blockchainActions.getCurrentBlockNumber.call());
      yield call(history.push, routes.home.index);
    } else {
      yield put(authActions.signIn.failure());
    }
  } catch (error) {
    yield put(authActions.signIn.failure(error.response));
  }
}

function* verifySessionWorker() {
  try {
    const walletAddress = yield sessionStorage.getItem('userWalletAddress');
    const { data: { user, success } } = yield call(api.get, '/users/check_session');
    const extensions = yield web3Enable('Liberland dapp');
    yield put(blockchainActions.setUserWallet.success(walletAddress));
    if (extensions.length) {
      user.role = yield call(getUserRoleRpc, walletAddress);
      user.passportId = yield call(getUserPassportId, walletAddress);
    }
    if (success) {
      yield put(authActions.verifySession.success(user));
      yield put(blockchainActions.getCurrentBlockNumber.call());
    } else {
      throw new Error();
    }
  } catch (error) {
    yield put(authActions.verifySession.failure());
  }
}

function* signOutWorker() {
  try {
    yield call(api.post, '/users/logout');
    yield put(authActions.signOut.success());
    yield put(blockchainActions.setUserWallet.success(''));
    yield sessionStorage.clear();
  } catch (error) {
    yield put(authActions.signOut.failure);
  }
}

function* initGetDataFromNodeWorker() {
  yield put(walletActions.getWallet.call());
  yield put(walletActions.getThreeTx.call());
  yield put(walletActions.getValidators.call());
  const walletAddress = yield sessionStorage.getItem('userWalletAddress');
  yield put(walletActions.getNominatorTargets.call(walletAddress));
  yield put(blockchainActions.getPeriodAndVotingDuration.call());
  yield put(votingActions.getAssembliesList.call());
}

function* signInWatcher() {
  yield takeLatest(authActions.signIn.call, signInWorker);
}

function* verifySessionWatcher() {
  yield takeLatest(authActions.verifySession.call, verifySessionWorker);
}

function* signOutWatcher() {
  yield takeLatest(authActions.signOut.call, signOutWorker);
}

function* initGetDataFromNodeWatcher() {
  yield takeLatest([
    authActions.signIn.success,
    authActions.verifySession.success,
  ], initGetDataFromNodeWorker);
}

export {
  signInWatcher,
  verifySessionWatcher,
  signOutWatcher,
  initGetDataFromNodeWatcher,
};
