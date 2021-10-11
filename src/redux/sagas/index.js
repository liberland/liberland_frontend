import { all } from 'redux-saga/effects';
import * as authSagas from './auth';
import * as walletSagas from './wallet';
import * as assemblySagas from './assembly';
import * as votingSagas from './voting';
import * as lawSagas from './law';
import * as blockchainSagas from './blockchain';

export default function* rootSaga() {
  yield all([
    // AUTH
    authSagas.signInWatcher(),
    authSagas.verifySessionWatcher(),
    authSagas.signOutWatcher(),
    authSagas.initGetDataFromNodeWatcher(),

    // // BLOCKCHAIN
    blockchainSagas.fetchBlockNumberWatcher(),
    blockchainSagas.getPeriodAndVotingDurationWatcher(),
    blockchainSagas.setElectionsBlockWatcher(),
    blockchainSagas.runSetElectionsBlockWorker(),
    blockchainSagas.updateDateElectionsWatcher(),

    // WALLET
    walletSagas.getWalletWatcher(),
    walletSagas.sendTransferWatcher(),
    walletSagas.stakeToPolkaWatcher(),
    walletSagas.stakeToLiberlandWatcher(),

    // ASSEMBLY
    assemblySagas.addMyDraftWatcher(),
    assemblySagas.submitProposalWatcher(),
    assemblySagas.getByHashesWatcher(),
    assemblySagas.getMyProposalsWatcher(),
    assemblySagas.deleteProposalWatcher(),
    assemblySagas.editDraftWatcher(),
    assemblySagas.updateAllProposalsWatcher(),
    assemblySagas.voteByProposalWatcher(),

    // VOTING
    votingSagas.addMyCandidacyWatcher(),
    votingSagas.getListOFCandidacyWatcher(),
    votingSagas.sendElectoralSheetWatcher(),
    votingSagas.setIsVotingInProgressWatcher(),
    votingSagas.getMinistersListWatcher(),
    lawSagas.getCurrentLawsWatcher(),
  ]);
}
