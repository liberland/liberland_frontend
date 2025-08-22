import { all } from 'redux-saga/effects';
import * as authSagas from './auth/auth';
import * as walletSagas from './wallet';
import * as blockchainSagas from './blockchain';
import * as democracySagas from './democracy';
import * as legislationSagas from './legislation';
import * as officesSagas from './offices';
import * as registriesSagas from './registries';
import * as identitySagas from './identity';
import * as validatorSagas from './validator';
import * as congressSagas from './congress';
import * as onboardingSagas from './onboarding';
import * as dexSagas from './dex';
import * as contractsSagas from './contracts';
import * as senateSagas from './senate';
import * as nftsSagas from './nfts';
import * as ethSagas from './eth';
import * as financesSagas from './finances';
import * as ministryFinanceSagas from './ministryFinance';

export default function* rootSaga() {
  yield all([
    // AUTH
    authSagas.verifySessionWatcher(),
    authSagas.signOutWatcher(),

    // // BLOCKCHAIN
    blockchainSagas.subscribeBestBlockNumberSaga(),
    blockchainSagas.clearErrorsWatcher(),
    blockchainSagas.subscribeActiveEraSaga(),
    blockchainSagas.fetchPreimageWatcher(),
    blockchainSagas.subscribeWalletsSaga(),

    // WALLET
    walletSagas.getWalletWatcher(),
    walletSagas.sendTransferWatcher(),
    walletSagas.sendAssetsWatcher(),
    walletSagas.sendTransferLLMWatcher(),
    walletSagas.stakeToPolkaWatcher(),
    walletSagas.stakeToLiberlandWatcher(),
    walletSagas.getValidatorsWatcher(),
    walletSagas.getNominatorTargetsWatcher(),
    walletSagas.setNominatorTargetsWatcher(),
    walletSagas.unpoolWatcher(),
    walletSagas.getTransfersTxWatcher(),
    walletSagas.getAdditionalAssetsWatcher(),
    walletSagas.getAssetsBalanceWatcher(),
    walletSagas.getAssetDetailsWatcher(),
    walletSagas.sendTransferWithRemarkWatcher(),
    walletSagas.createOrUpdateAssetWatcher(),
    walletSagas.mintAssetWatcher(),
    walletSagas.checkPaymentWatcher(),
    walletSagas.createPaymentWatcher(),

    // DEMOCRACY
    democracySagas.getDemocracyWatcher(),
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
    identitySagas.getIdentityMotionsWatcher(),

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
    officesSagas.getPendingAdditionalMeritsWatcher(),
    officesSagas.getTaxPayersWatcher(),
    officesSagas.getTopHoldersWatcher(),

    // REGISTRIES
    registriesSagas.getOfficialRegistryEntriesWatcher(),
    registriesSagas.getOfficialUserRegistryEntriesWatcher(),
    registriesSagas.requestCompanyRegistrationWatcher(),
    registriesSagas.requestEditCompanyRegistrationWatcher(),
    registriesSagas.cancelCompanyRequestWatcher(),
    registriesSagas.requestUnregisterCompanyRegistrationWatcher(),

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
    validatorSagas.getStakingDataWatcher(),
    validatorSagas.updateCommissionWatcher(),

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
    congressSagas.congressSendLldWatcher(),
    congressSagas.congressSendAssetsTransferWatcher(),
    congressSagas.congressSendTreasuryLldWatcher(),
    congressSagas.getCandidatesWatcher(),
    congressSagas.getMembersWatcher(),
    congressSagas.getMotionsWatcher(),
    congressSagas.getRunnersUpWatcher(),
    congressSagas.getTreasuryInfoWatcher(),
    congressSagas.renounceCandidacyWatcher(),
    congressSagas.unapproveTreasurySpendWatcher(),
    congressSagas.voteAtMotionsWatcher(),
    congressSagas.getWalletWatcher(),
    congressSagas.getAllBalanceForCongressWatcher(),
    congressSagas.congressBudgetProposeWatcher(),
    congressSagas.congressSpendingWatcher(),

    // ONBOARDING
    onboardingSagas.claimComplimentaryLLDWatcher(),
    onboardingSagas.getIsEligibleForComplimentaryLLDWatcher(),

    // DEX
    dexSagas.getPoolsWatcher(),
    dexSagas.addLiquidityWatcher(),
    dexSagas.swapExactTokensForTokensWatcher(),
    dexSagas.swapTokensForExactTokensWatcher(),
    dexSagas.getDexReservesWatcher(),
    dexSagas.removeLiquiditWatcher(),
    dexSagas.getWithdrawalFeeWatcher(),

    // CONTRACTS
    contractsSagas.getContractsWorkerWatcher(),
    contractsSagas.signContractAsPartyWatcher(),
    contractsSagas.signContractAsJudgeWatcher(),
    contractsSagas.removeContractWatcher(),
    contractsSagas.getMyContractsWatcher(),
    contractsSagas.getSingleContractWatcher(),
    contractsSagas.createContractWatcher(),
    contractsSagas.getSignaturesForContractsWatcher(),

    // SENATE
    senateSagas.getSenateMotionsWatcher(),
    senateSagas.getWalletWatcher(),
    senateSagas.getAdditionalAssetsWatcher(),
    senateSagas.senateSendLldWatcher(),
    senateSagas.senateSendLlmToPolitipoolWatcher(),
    senateSagas.senateSendLlmWatcher(),
    senateSagas.senateSendAssetsTransferWatcher(),
    senateSagas.closeMotionWatcher(),
    senateSagas.voteAtMotionsWatcher(),
    senateSagas.getScheduledCongressSpendingWatcher(),
    senateSagas.proposeCloseMotionWatcher(),
    senateSagas.getSenateMembersWatcher(),

    // NFTS
    nftsSagas.getUserNftsWatcher(),

    // ETH
    ethSagas.getWalletOptionsWatcher(),
    ethSagas.getWalletConnectingWatcher(),
    ethSagas.tokenStakeContractInfoWatcher(),
    ethSagas.tokenStakeAddressInfoWatcher(),
    ethSagas.erc20InfoWatcher(),
    ethSagas.erc20BalanceWatcher(),
    ethSagas.getWethExchangeRateWatcher(),
    ethSagas.getBalanceWatcher(),
    ethSagas.withdrawTokensWatcher(),
    ethSagas.stakeLpWithEthWatcher(),
    ethSagas.stakeTokensWatcher(),
    ethSagas.claimRewardsWatcher(),

    // FINANCES
    financesSagas.getFinancesWatcher(),
    nftsSagas.createCollectionWatcher(),
    nftsSagas.mintNftWatcher(),
    nftsSagas.destroyNftWatcher(),
    nftsSagas.setMetadataWatcher(),
    nftsSagas.setAttributesWatcher(),
    nftsSagas.sellNftWatcher(),
    nftsSagas.bidNftWatcher(),
    nftsSagas.transferNftWatcher(),
    nftsSagas.getUserCollectionstWatcher(),
    nftsSagas.getNftsWatcher(),
    nftsSagas.getNftsOnSaleWatcher(),

    // MINISTRY FINANCE
    ministryFinanceSagas.getWalletWatcher(),
    ministryFinanceSagas.getAdditionalAssetsWatcher(),
    ministryFinanceSagas.sendAssetsTransferWatcher(),
    ministryFinanceSagas.sendLldWatcher(),
    ministryFinanceSagas.sendLlmToPolitipoolWatcher(),
    ministryFinanceSagas.sendLlmWatcher(),
    ministryFinanceSagas.ministryOfFinanceSpendingWatcher(),
  ]);
}
