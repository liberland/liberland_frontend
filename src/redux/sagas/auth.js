import {
  takeLatest,
  put,
  call,
} from 'redux-saga/effects';
import { web3Enable } from '@polkadot/extension-dapp';

import { getUserRoleRpc } from '../../api/nodeRpcCall';
import {
  authActions, votingActions, walletActions, blockchainActions, democracyActions,
} from '../actions';
import routes from '../../router';
import api from '../../api';

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const fakeUser = {
  email: 'fake eimail',
  about: 'fake about',
  gender: 'soviet Bukhanka ambulance truck',
  id: 13,
  languages: ['english'],
  lastName: 'Utajinovic',
  name: 'Porezije',
  occupation: 'Theftstopper',
  origin: 'schizo brain',
  role: { non_citizen: 'non_citizen' },
};
function* signInWorker(action) {
  try {
    const { credentials, history, ssoAccessTokenHash } = action.payload;
    api.defaults.headers.common['X-token'] = ssoAccessTokenHash;
    const { data: user } = yield call(api.get, '/users/me');
    console.log('user');
    console.log(user);
    user.ssoAccessTokenHash = ssoAccessTokenHash;
    yield put(blockchainActions.setUserWallet.success(credentials.wallet_address));
    yield sessionStorage.setItem('userWalletAddress', credentials.wallet_address);
    yield sessionStorage.setItem('ssoAccessTokenHash', ssoAccessTokenHash);
    const extensions = yield web3Enable('Liberland dapp');
    if (extensions.length) {
      user.role = yield call(getUserRoleRpc, credentials.wallet_address);
      const comboUser = { ...fakeUser, ...user };
      comboUser.ssoAccessTokenHash = ssoAccessTokenHash;
      comboUser.role = yield call(getUserRoleRpc, credentials.wallet_address);
      yield put(authActions.signIn.success(comboUser));
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
    console.log('verify sesh');
    const walletAddress = yield sessionStorage.getItem('userWalletAddress');
    const ssoAccessTokenHash = yield sessionStorage.getItem('ssoAccessTokenHash');
    console.log('ssoAccessTokenHash');
    console.log(ssoAccessTokenHash);
    api.defaults.headers.common['X-token'] = ssoAccessTokenHash;
    const { data: user } = yield call(api.get, '/users/me');
    console.log('user');
    console.log(user);
    let extensions = yield web3Enable('Liberland dapp');
    yield put(blockchainActions.setUserWallet.success(walletAddress));
    if (extensions.length === 0) {
      let retryCounter = 0;
      // Hack, is caused by web3Enable needing a fully loaded page to work,
      // but i am not sure how to do it other way without larger refactor
      while (retryCounter < 30 && extensions.length === 0) {
        ++retryCounter;
        yield call(delay, 1000);
        extensions = yield call(web3Enable, 'Liberland dapp');
      }
    }
    if (extensions.length) {
      user.role = yield call(getUserRoleRpc, walletAddress);
    }
    const comboUser = { ...fakeUser, ...user };
    yield put(authActions.verifySession.success(comboUser));
    yield put(blockchainActions.getCurrentBlockNumber.call());
  } catch (error) {
    console.log('verify sesh fail');
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
