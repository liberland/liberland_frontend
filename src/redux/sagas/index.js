import { all } from 'redux-saga/effects';
import * as authSagas from './auth';
import * as walletSagas from './wallet';
import * as assemblySagas from './assembly';

export default function* rootSaga() {
  yield all([
    // AUTH
    authSagas.signInWatcher(),
    authSagas.verifySessionWatcher(),
    authSagas.signOutWatcher(),

    // WALLET
    walletSagas.getWalletWatcher(),
    walletSagas.sendTransferWatcher(),

    // ASSEMBLY
    assemblySagas.addMyDraftWatcher(),
    assemblySagas.getMyProposalsWatcher(),
  ]);
}
