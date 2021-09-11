import { all } from 'redux-saga/effects';
import * as authSagas from './auth';
import * as walletSagas from './wallet';
import * as assemblySagas from './assembly';
import * as votingSagas from './voting';

export default function* rootSaga() {
  yield all([
    // AUTH
    authSagas.signInWatcher(),
    authSagas.verifySessionWatcher(),
    authSagas.signOutWatcher(),

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

    // VOTING
    votingSagas.addMyCandidacyWatcher(),
    votingSagas.getListOFCandidacyWatcher(),
    votingSagas.sendElectoralSheetWatcher(),
    votingSagas.setIsVotingInProgressWatcher(),
    votingSagas.getMinistersListWatcher(),
    votingSagas.getPeriodAndVotingDurationWatcher(),
  ]);
}
