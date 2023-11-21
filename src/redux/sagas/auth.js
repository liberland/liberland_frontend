import {
  takeLatest,
  put,
  call,
} from 'redux-saga/effects';
import { web3Enable } from '@polkadot/extension-dapp';

import { getUserRoleRpc } from '../../api/nodeRpcCall';
import {
  authActions, votingActions, walletActions, blockchainActions, democracyActions,
  identityActions,
} from '../actions';
import routes from '../../router';
import api from '../../api';
import { waitForInjectedWeb3 } from '../../utils/walletHelpers';

function* signInWorker(action) {
  try {
    const { credentials, history, ssoAccessTokenHash } = action.payload;
    api.defaults.headers.common['X-token'] = ssoAccessTokenHash;
    const { data: user } = yield call(api.get, '/users/me');

    user.ssoAccessTokenHash = ssoAccessTokenHash;
    yield put(blockchainActions.setUserWallet.success(credentials.wallet_address));
    yield sessionStorage.setItem('userWalletAddress', credentials.wallet_address);
    yield sessionStorage.setItem('ssoAccessTokenHash', ssoAccessTokenHash);
    yield call(waitForInjectedWeb3);
    const extensions = yield web3Enable('Liberland dapp');
    if (extensions.length) {
      user.role = yield call(getUserRoleRpc, credentials.wallet_address);
      // const comboUser = { ...fakeUser, ...user };
      const comboUser = { ...user };
      comboUser.ssoAccessTokenHash = ssoAccessTokenHash;
      comboUser.role = yield call(getUserRoleRpc, credentials.wallet_address);
      yield put(authActions.signIn.success(comboUser));
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
    const ssoAccessTokenHash = yield sessionStorage.getItem('ssoAccessTokenHash');
    api.defaults.headers.common['X-token'] = ssoAccessTokenHash;
    const { data: user } = yield call(api.get, '/users/me');
    yield call(waitForInjectedWeb3);
    const extensions = yield web3Enable('Liberland dapp');
    yield put(blockchainActions.setUserWallet.success(walletAddress));
    if (extensions.length) {
      user.role = yield call(getUserRoleRpc, walletAddress);
    }
    yield put(authActions.verifySession.success(user));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    yield put(authActions.verifySession.failure());
  }
}

function* signOutWorker() {
  try {
    yield put(authActions.signOut.success());
    yield put(blockchainActions.setUserWallet.success(''));
    yield sessionStorage.clear();
  } catch (error) {
    yield put(authActions.signOut.failure);
  }
}

function* initGetDataFromNodeWorker() {
  yield put(walletActions.getWallet.call());
  yield put(walletActions.getValidators.call());
  const walletAddress = yield sessionStorage.getItem('userWalletAddress');
  yield put(walletActions.getNominatorTargets.call(walletAddress));
  yield put(blockchainActions.getPeriodAndVotingDuration.call());
  yield put(votingActions.getAssembliesList.call());
  yield put(democracyActions.getDemocracy.call(walletAddress));
  yield put(identityActions.getIdentity.call(walletAddress));
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
