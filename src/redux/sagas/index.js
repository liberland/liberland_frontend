import { all } from 'redux-saga/effects';
import * as authSagas from './auth';
import * as walletSagas from './wallet';
import * as blockchainSagas from './blockchain';
import * as democracySagas from './democracy';
import * as legislationSagas from './legislation';

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
    blockchainSagas.clearErrorsWatcher(),

    // WALLET
    walletSagas.getWalletWatcher(),
    walletSagas.sendTransferWatcher(),
    walletSagas.sendTransferLLMWatcher(),
    walletSagas.stakeToPolkaWatcher(),
    walletSagas.stakeToLiberlandWatcher(),
    walletSagas.getValidatorsWatcher(),
    walletSagas.getNominatorTargetsWatcher(),
    walletSagas.setNominatorTargetsWatcher(),

    // DEMOCRACY
    democracySagas.getDemocracyWatcher(),
    democracySagas.secondProposalWatcher(),
    democracySagas.voteOnReferendumWatcher(),

    // LEGISLATION
    legislationSagas.getLegislationWatcher(),
  ]);
}
