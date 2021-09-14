import {
  takeLatest,
  put,
  call,
} from 'redux-saga/effects';
import { web3Enable } from '@polkadot/extension-dapp';

import { getUserRoleRpc } from '../../api/nodeRpcCall';
import { authActions } from '../actions';
import routes from '../../router';
import api from '../../api';

function* signInWorker(action) {
  try {
    const { credentials, history } = action.payload;
    const { data: user } = yield call(api.post, '/users/signin', credentials);
    const extensions = yield web3Enable('Liberland dapp');
    if (extensions.length) user.role = yield call(getUserRoleRpc);
    yield put(authActions.signIn.success(user));
    yield call(history.push, routes.home.index);
  } catch (error) {
    yield put(authActions.signIn.failure(error.response));
  }
}

function* verifySessionWorker() {
  try {
    const { data: { user, success } } = yield call(api.get, '/users/check_session');
    const extensions = yield web3Enable('Liberland dapp');
    if (extensions.length) user.role = yield call(getUserRoleRpc);
    if (success) {
      yield put(authActions.verifySession.success(user));
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
  } catch (error) {
    yield put(authActions.signOut.failure);
  }
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

export {
  signInWatcher,
  verifySessionWatcher,
  signOutWatcher,
};
