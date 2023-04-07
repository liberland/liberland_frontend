import { all } from 'redux-saga/effects';
import * as authSagas from './auth';
import * as walletSagas from './wallet';
import * as blockchainSagas from './blockchain';
import * as democracySagas from './democracy';
import * as legislationSagas from './legislation';
import * as officesSagas from './offices';
import * as registriesSagas from './registries';
import * as identitySagas from './identity';

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
    walletSagas.unpoolWatcher(),

    // DEMOCRACY
    democracySagas.getDemocracyWatcher(),
    democracySagas.secondProposalWatcher(),
    democracySagas.voteOnReferendumWatcher(),
    democracySagas.proposeWatcher(),
    democracySagas.voteForCongressWatcher(),
    democracySagas.delegateWatcher(),
    democracySagas.undelegateWatcher(),

    // LEGISLATION
    legislationSagas.getLegislationWatcher(),
    legislationSagas.castVetoWatcher(),
    legislationSagas.revertVetoWatcher(),

    // IDENTITY
    identitySagas.setIdentityWatcher(),
    identitySagas.getIdentityWatcher(),

    // OFFICES
    officesSagas.getIdentityWatcher(),
    officesSagas.provideJudgementWatcher(),
    officesSagas.getCompanyRequestWatcher(),
    officesSagas.getCompanyRegistrationWatcher(),
    officesSagas.registerCompanyWatcher(),

    //REGISTRIES
    registriesSagas.getOfficialUserRegistryEntriesWatcher(),
    registriesSagas.setRegistryCRUDActionWatcher(),
    registriesSagas.requestCompanyRegistrationWatcher()
  ]);
}
