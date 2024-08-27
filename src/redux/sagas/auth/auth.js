import {
  takeLatest,
  put,
  call,
} from 'redux-saga/effects';
import {
  authActions, blockchainActions,
} from '../../actions';
import { getMe } from '../../../api/backend';
import { getUserRoleRpc } from '../../../api/nodeRpcCall';

function* verifySessionWorker() {
  // check if we have some older token and if it's valid
  const ssoAccessTokenHashStorage = yield localStorage.getItem('ROCP_token');
  if (ssoAccessTokenHashStorage) {
    try {
      const { data: user } = yield call(getMe);
      // stored token is valid
      // FIXME we should have to do it here, refactor stuff to fetch it separately
      user.role = yield call(getUserRoleRpc, user.blockchainAddress);
      const userBlockchainAdressStorage = yield localStorage.getItem('BlockchainAdress');
      yield put(blockchainActions.setUserWallet.success(userBlockchainAdressStorage || user.blockchainAddress));
      yield put(authActions.verifySession.success(user));
      return;
    } catch (e) {
      // stored token is no longer valid, clear it
      localStorage.removeItem('ROCP_token');
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
    localStorage.clear();
    sessionStorage.clear();
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
