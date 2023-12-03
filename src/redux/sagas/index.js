import { all } from 'redux-saga/effects';
import * as authSagas from './auth';
import * as walletSagas from './wallet';
import * as blockchainSagas from './blockchain';
import * as democracySagas from './democracy';
import * as legislationSagas from './legislation';
import * as officesSagas from './offices';
import * as registriesSagas from './registries';
import * as identitySagas from './identity';
import * as bridgeSagas from './bridge';
import * as validatorSagas from './validator';
import * as congressSagas from './congress';
import * as onboardingSagas from './onboarding';

export default function* rootSaga() {
  yield all([
    // AUTH
    authSagas.signInWatcher(),
    authSagas.verifySessionWatcher(),
    authSagas.signOutWatcher(),
    authSagas.initGetDataFromNodeWatcher(),

    // // BLOCKCHAIN
    blockchainSagas.subscribeBestBlockNumberSaga(),
    blockchainSagas.getAllWalletsWatcher(),
    blockchainSagas.clearErrorsWatcher(),
    blockchainSagas.subscribeActiveEraSaga(),
    blockchainSagas.fetchPreimageWatcher(),

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
    walletSagas.getLlmTransfersWatcher(),
    walletSagas.getLldTransfersWatcher(),

    // DEMOCRACY
    democracySagas.getDemocracyWatcher(),
    democracySagas.secondProposalWatcher(),
    democracySagas.voteOnReferendumWatcher(),
    democracySagas.proposeWatcher(),
    democracySagas.voteForCongressWatcher(),
    democracySagas.delegateWatcher(),
    democracySagas.undelegateWatcher(),
    democracySagas.proposeAmendLegislationWatcher(),
    democracySagas.citizenProposeRepealLegislationWatcher(),

    // LEGISLATION
    legislationSagas.getLegislationWatcher(),
    legislationSagas.castVetoWatcher(),
    legislationSagas.revertVetoWatcher(),
    legislationSagas.getCitizenCountWatcher(),

    // IDENTITY
    identitySagas.setIdentityWatcher(),
    identitySagas.getIdentityWatcher(),

    // OFFICES
    officesSagas.getIdentityWatcher(),
    officesSagas.provideJudgementAndAssetsWatcher(),
    officesSagas.getCompanyRequestWatcher(),
    officesSagas.getCompanyRegistrationWatcher(),
    officesSagas.registerCompanyWatcher(),
    officesSagas.getBalancesWatcher(),
    officesSagas.getPalletIdsWatcher(),
    officesSagas.unregisterCompanyWatcher(),
    officesSagas.setRegisteredCompanyDataWatcher(),

    // REGISTRIES
    registriesSagas.getOfficialUserRegistryEntriesWatcher(),
    registriesSagas.requestCompanyRegistrationWatcher(),
    registriesSagas.requestEditCompanyRegistrationWatcher(),
    registriesSagas.cancelCompanyRequestWatcher(),
    registriesSagas.requestUnregisterCompanyRegistrationWatcher(),

    // BRIDGE
    bridgeSagas.withdrawWatcher(),
    bridgeSagas.depositWatcher(),
    bridgeSagas.burnWatcher(),
    bridgeSagas.monitorBurnWatcher(),
    bridgeSagas.getTransfersToEthereumWatcher(),
    bridgeSagas.getTransfersToSubstrateWatcher(),
    bridgeSagas.getBridgesConstantsWatcher(),

    // VALIDATOR
    validatorSagas.payoutWatcher(),
    validatorSagas.getPendingRewardsWatcher(),
    validatorSagas.getInfoWatcher(),
    validatorSagas.getSlashesWatcher(),
    validatorSagas.setSessionKeysWatcher(),
    validatorSagas.getPayeeWatcher(),
    validatorSagas.setPayeeWatcher(),
    validatorSagas.getNominatorsWatcher(),
    validatorSagas.getStakerRewardsWatcher(),
    validatorSagas.validateWatcher(),
    validatorSagas.chillWatcher(),
    validatorSagas.createValidatorWatcher(),
    validatorSagas.stakeLldWatcher(),
    validatorSagas.getBondingDurationWatcher(),
    validatorSagas.unbondWatcher(),
    validatorSagas.withdrawUnbondedWatcher(),

    // CONGRESS
    congressSagas.applyForCongressWatcher(),
    congressSagas.approveTreasurySpendWatcher(),
    congressSagas.closeMotionWatcher(),
    congressSagas.congressAmendLegislationViaReferendumWatcher(),
    congressSagas.congressAmendLegislationWatcher(),
    congressSagas.congressDemocracyBlacklistWatcher(),
    congressSagas.congressProposeLegislationViaReferendumWatcher(),
    congressSagas.congressProposeLegislationWatcher(),
    congressSagas.congressProposeRepealLegislationWatcher(),
    congressSagas.congressRepealLegislationWatcher(),
    congressSagas.congressSendLlmToPolitipoolWatcher(),
    congressSagas.congressSendLlmWatcher(),
    congressSagas.congressSendTreasuryLldWatcher(),
    congressSagas.getCandidatesWatcher(),
    congressSagas.getMembersWatcher(),
    congressSagas.getMotionsWatcher(),
    congressSagas.getRunnersUpWatcher(),
    congressSagas.getTreasuryInfoWatcher(),
    congressSagas.renounceCandidacyWatcher(),
    congressSagas.unapproveTreasurySpendWatcher(),
    congressSagas.voteAtMotionsWatcher(),

    // ONBOARDING
    onboardingSagas.claimComplimentaryLLDWatcher(),
    onboardingSagas.getIsEligibleForComplimentaryLLDWatcher(),
  ]);
}
