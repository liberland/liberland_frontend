import {
  takeLatest,
  put,
  call,
} from 'redux-saga/effects';
import {
  authActions, blockchainActions,
} from '../../actions';
import { getMe } from '../../../api/backend';
import { hashToSsoAccessToken } from './helpers';
import { getUserRoleRpc } from '../../../api/nodeRpcCall';

function* verifySessionWorker() {
  // check if we have token in URL - used right after user gets redirected from SSO
  const ssoTokenUrl = hashToSsoAccessToken(window.location.hash);
  if (ssoTokenUrl) {
    // we've got a fresh token from SSO
    localStorage.setItem('ssoAccessTokenHash', ssoTokenUrl);
    // clear it to prevent accidential leak of token by user copying URL
    window.location.hash = '';
  }

  // check if we have some older token and if it's valid
  const ssoAccessTokenHashStorage = yield localStorage.getItem('ssoAccessTokenHash');
  if (ssoAccessTokenHashStorage) {
    try {
      const { data: user } = yield call(getMe);
      // stored token is valid
      // FIXME we should have to do it here, refactor stuff to fetch it separately
      user.role = yield call(getUserRoleRpc, user.blockchainAddress);
      yield put(authActions.verifySession.success(user));
      return;
    } catch (e) {
      // stored token is no longer valid, clear it
      localStorage.removeItem('ssoAccessTokenHash');
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  // no tokens or they're not valid
  yield put(authActions.verifySession.failure());
}

function* signOutWorker() {
  try {
    yield put(authActions.signOut.success());
    yield put(blockchainActions.setUserWallet.success(''));
    localStorage.clear();
  } catch (error) {
    yield put(authActions.signOut.failure);
  }
}

function* verifySessionWatcher() {
  yield takeLatest(authActions.verifySession.call, verifySessionWorker);
}

function* signOutWatcher() {
  yield takeLatest(authActions.signOut.call, signOutWorker);
}

export {
  verifySessionWatcher,
  signOutWatcher,
};
