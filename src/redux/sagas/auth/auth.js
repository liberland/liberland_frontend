import {
  takeLatest,
  put,
  call,
} from 'redux-saga/effects';
import { web3Enable } from '@polkadot/extension-dapp';
import {
  authActions, votingActions, walletActions, blockchainActions, democracyActions,
  identityActions,
} from '../../actions';
import { GuidedStepEnum } from '../../../utils/enums';
import {
  handleExtensionsExist, guidedStepSuccess,
  handleError,
} from './handlingExceptions';
import {
  checkUnsupportedBrowser, intervalTime, lengthOfObject, timeoutInterval,
} from './helpers';

function* verifySessionWorker() {
  try {
    let config = { shouldExitLoop: false, isTokenPushToLocalStorage: false };
    const isUnsupportedBrowser = yield checkUnsupportedBrowser();
    if (isUnsupportedBrowser) {
      const checkIfExist = sessionStorage.getItem('isUnsupportedBrowser');
      if (!checkIfExist) {
        sessionStorage.setItem('isUnsupportedBrowser', false);
      }
    }
    const enteredTime = Date.now();
    const delay = (time) => new Promise((resolve) => { setTimeout(resolve, time); });
    while (!config.shouldExitLoop) {
      yield call(delay, intervalTime);
      const extensions = yield call(web3Enable, 'Liberland dapp');
      const extensionsLength = lengthOfObject(extensions);
      const isUnsupportedBrowserStorage = sessionStorage.getItem('isUnsupportedBrowser');
      if (extensionsLength > 0) {
        config = yield handleExtensionsExist(config);
      } else if (isUnsupportedBrowser && isUnsupportedBrowserStorage === 'false') {
        yield guidedStepSuccess({ component: GuidedStepEnum.UNSUPPORTED_BROWSER, data: '' });
      } else {
        yield guidedStepSuccess({ component: GuidedStepEnum.NO_WALLETS_AVAILABLE, data: '' });
      }

      if (Date.now() - enteredTime > timeoutInterval) {
        config.shouldExitLoop = true;
      }
    }
  } catch (err) {
    yield handleError(err);
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
  verifySessionWatcher,
  signOutWatcher,
  initGetDataFromNodeWatcher,
};
