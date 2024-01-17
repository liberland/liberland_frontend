import { put, call } from 'redux-saga/effects';
import { GuidedStepEnum } from '../../../utils/enums';
import { authActions, blockchainActions } from '../../actions';
import { lengthOfObject, hashToSsoAccessToken, checkIfWalletAddressIsProper } from './helpers';
import { getAllWalletsRpc, getUserRoleRpc } from '../../../api/nodeRpcCall';
import routes from '../../../router';
import api from '../../../api';

export function* guidedStepSuccess(data) {
  yield put(authActions.guidedStep.success({ status: 'loaded', ...data }));
}

export function* handleError(err) {
  yield put(authActions.verifySession.failure(err));
  yield guidedStepSuccess();
}
export function* handleUnsupportedBrowser() {
  yield put(authActions.guidedStep.success({
    component: GuidedStepEnum.UNSUPPORTED_BROWSER, data: '', isUnsupportedBrowser: true,
  }));
}

function* noHandle(wallets) {
  yield put(blockchainActions.getAllWallets.success(wallets));
  yield put(authActions.verifySession.failure());
  yield guidedStepSuccess();
}

function* handleUserSignIn(userParent, ssoTokenUrl) {
  let user = userParent;
  user.ssoAccessTokenHash = ssoTokenUrl;
  const comboUser = { ...user };
  comboUser.ssoAccessTokenHash = ssoTokenUrl;
  user = comboUser;
  yield put(authActions.signIn.success(user));
  return user;
}

function* ssoTokenUrlSuccess(isLogIn, userParent, walletAddress, ssoTokenUrl) {
  let user = userParent;
  user.role = yield call(getUserRoleRpc, walletAddress);
  if (isLogIn) {
    user = yield handleUserSignIn(user, ssoTokenUrl);
  }
  yield put(authActions.verifySession.success(user));
  yield sessionStorage.setItem('userWalletAddress', walletAddress);
  yield put(authActions.guidedStep.success({ status: 'loaded' }));
}

function* handleSignInWithToken(ssoTokenUrl, wallets, config) {
  const newConfig = { ...config };
  const { data: user } = yield call(api.get, '/users/me');
  const walletAddress = ssoTokenUrl ? user?.blockchainAddress : yield sessionStorage.getItem('userWalletAddress');
  const userId = user?.id;

  yield put(blockchainActions.setUserWallet.success(walletAddress));
  if (checkIfWalletAddressIsProper(wallets, walletAddress)) {
    const isLogIn = ssoTokenUrl || config.isTokenPushToLocalStorage;
    yield ssoTokenUrlSuccess(isLogIn, user, walletAddress, ssoTokenUrl);
    newConfig.shouldExitLoop = true;
  } else if (user?.blockchainAddress?.length) {
    const centralizedWalletAddress = user?.blockchainAddress;
    yield guidedStepSuccess({
      component: GuidedStepEnum.MISSING_WALLET,
      data: { wallets, userId, centralizedWalletAddress },
    });
  } else {
    yield guidedStepSuccess({ component: GuidedStepEnum.NO_CONNECTED_WALLET, data: { wallets, userId } });
  }
  return newConfig;
}

function* handleWalletsExist(wallets, config) {
  const newConfig = { ...config };
  const ssoTokenUrl = hashToSsoAccessToken(window.location.hash);
  const ssoAccessTokenHashStorage = yield sessionStorage.getItem('ssoAccessTokenHash');

  if (ssoTokenUrl) {
    sessionStorage.setItem('ssoAccessTokenHash', ssoTokenUrl);
    window.location.hash = '';
    newConfig.isTokenPushToLocalStorage = true;
  }

  if (!ssoAccessTokenHashStorage && window.location.pathname.includes(routes.signIn) && !ssoTokenUrl) {
    yield noHandle(wallets);
    newConfig.shouldExitLoop = true;
    return config;
  }
  return yield handleSignInWithToken(
    ssoTokenUrl,
    wallets,
    newConfig,
  );
}

export function* handleExtensionsExist(config) {
  const wallets = yield call(getAllWalletsRpc);
  const walletsLength = lengthOfObject(wallets);

  if (walletsLength > 0) {
    return yield handleWalletsExist(wallets, config);
  }
  yield guidedStepSuccess({ component: GuidedStepEnum.NO_WALLETS_AVAILABLE, data: '' });
  return config;
}
