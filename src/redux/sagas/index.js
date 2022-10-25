import { all } from 'redux-saga/effects';
import * as authSagas from './auth';
import * as walletSagas from './wallet';
import * as blockchainSagas from './blockchain';
import * as democracySagas from './democracy';

export default function* rootSaga() {
  yield all([
    // AUTH
    authSagas.signInWatcher(),
    authSagas.verifySessionWatcher(),
    authSagas.signOutWatcher(),
    authSagas.initGetDataFromNodeWatcher(),

    // // BLOCKCHAIN
    blockchainSagas.fetchBlockNumberWatcher(),
    blockchainSagas.getAllWalletsWatcher(),

    // WALLET
    walletSagas.getWalletWatcher(),
    walletSagas.sendTransferWatcher(),
    walletSagas.sendTransferLLMWatcher(),
    walletSagas.stakeToPolkaWatcher(),
    walletSagas.stakeToLiberlandWatcher(),
    walletSagas.getThreeTxWatcher(),
    walletSagas.getMoreTxWatcher(),
    walletSagas.getValidatorsWatcher(),
    walletSagas.getNominatorTargetsWatcher(),

    // DEMOCRACY
    democracySagas.getDemocracyWatcher(),
    democracySagas.secondProposalWatcher(),
    democracySagas.voteOnReferendumWatcher(),
  ]);
}
