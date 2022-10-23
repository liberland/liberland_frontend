import { all } from 'redux-saga/effects';
import * as authSagas from './auth';
import * as walletSagas from './wallet';
import * as assemblySagas from './assembly';
import * as votingSagas from './voting';
import * as lawSagas from './law';
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
    walletSagas.stakeToPolkaWatcher(),
    walletSagas.stakeToLiberlandWatcher(),
    walletSagas.getThreeTxWatcher(),
    walletSagas.getMoreTxWatcher(),
    walletSagas.getValidatorsWatcher(),
    walletSagas.getNominatorTargetsWatcher(),

    // ASSEMBLY
    assemblySagas.addMyDraftWatcher(),
    assemblySagas.getByHashesWatcher(),
    assemblySagas.getMyProposalsWatcher(),
    assemblySagas.deleteProposalWatcher(),
    assemblySagas.editDraftWatcher(),
    assemblySagas.updateAllProposalsWatcher(),
    assemblySagas.voteByProposalWatcher(),
    assemblySagas.getConstitutionalChangeWatcher(),
    assemblySagas.getLegislationWatcher(),
    assemblySagas.getDecisionWatcher(),
    assemblySagas.getTextPdfWatcher(),

    // VOTING
    votingSagas.addMyCandidacyWatcher(),
    votingSagas.getListOFCandidacyWatcher(),
    votingSagas.sendElectoralSheetWatcher(),
    votingSagas.setIsVotingInProgressWatcher(),
    votingSagas.getAssembliesListWatcher(),
    lawSagas.getCurrentLawsWatcher(),

    // DEMOCRACY
    democracySagas.getDemocracyWatcher(),
    democracySagas.secondProposalWatcher(),
    democracySagas.voteOnReferendumWatcher(),
  ]);
}
