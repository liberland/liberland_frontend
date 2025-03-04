import {
  put, takeLatest, call, select,
} from 'redux-saga/effects';
import {
  congressActions,
  democracyActions,
  legislationActions,
} from '../actions';
import {
  blockchainSelectors,
  congressSelectors,
} from '../selectors';
import {
  applyForCongress,
  closeCongressMotion,
  congressAmendLegislation,
  congressAmendLegislationViaReferendum,
  congressApproveTreasurySpend,
  congressDemocracyBlacklist,
  congressProposeLegislation,
  congressProposeLegislationViaReferendum,
  congressProposeRepealLegislation,
  congressRepealLegislation,
  congressSendTreasuryLld,
  congressUnapproveTreasurySpend,
  getCongressCandidates,
  getCongressMembers,
  getMotions,
  getRunnersUp,
  getTreasuryBudget,
  getTreasurySpendPeriod,
  getTreasurySpendProposals,
  renounceCandidacy,
  voteAtMotions,
  getBalanceByAddress,
  getAdditionalAssets,
  congressSenateSendLlmToPolitipool,
  congressSenateSendAssets,
  congressSenateSendLld,
  congressSenateSendLlm,
  congressProposeBudget,
  getPalletIds,
  getIdentitiesNames,
} from '../../api/nodeRpcCall';
import { blockchainWatcher } from './base';
import { daysToBlocks } from '../../utils/nodeRpcCall';
import { palletIdToAddress } from '../../utils/pallet';
import { formatMerits } from '../../utils/walletHelpers';
import { IndexHelper } from '../../utils/council/councilEnum';
import { OfficeType } from '../../utils/officeTypeEnum';
import { fetchCongressSpending } from '../../api/middleware';

const officeType = OfficeType.CONGRESS;

function* getWalletWorker() {
  const codeName = yield select(congressSelectors.codeName);
  const pallets = yield call(getPalletIds);

  if (!pallets) {
    yield put(congressActions.congressGetWallet.failure());
    return;
  }

  const { palletId } = pallets.find((e) => e.palletName === codeName);
  const walletAddress = palletIdToAddress(palletId);
  const balances = yield call(getBalanceByAddress, walletAddress);
  yield put(congressActions.congressGetWallet.success({ balances, walletAddress }));

  const congressWalletAddress = yield select(congressSelectors.walletAddress);
  if (!congressWalletAddress) {
    yield put(congressActions.congressGetAdditionalAssets.failure());
    return;
  }

  const additionalAssets = yield call(
    getAdditionalAssets,
    congressWalletAddress,
    false,
  );
  yield put(congressActions.congressGetAdditionalAssets.success(additionalAssets));
}

function* applyForCongressWorker() {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(applyForCongress, walletAddress);
  yield put(congressActions.getCandidates.call());
  yield put(congressActions.applyForCongress.success());
}

function* spendingWorker() {
  const spending = yield call(fetchCongressSpending);
  yield put(congressActions.congressSpending.success(spending));
}

function* getCandidatesWorker() {
  const candidates = yield call(getCongressCandidates);
  yield put(congressActions.getCandidates.success(candidates));
}

function* getMotionsWorker() {
  const motions = yield call(getMotions);
  yield put(congressActions.getMotions.success(motions));
}

function* voteAtMotionsWorker(action) {
  const { proposal, index, vote } = action.payload;
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(voteAtMotions, walletAddress, proposal, index, vote);
  yield put(congressActions.getMotions.call());
  yield put(congressActions.voteAtMotions.success());
}

function* congressSendLlmWorker({
  payload: {
    transferToAddress, transferAmount, remarkInfo, executionBlock,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(congressSenateSendLlm, {
    walletAddress,
    transferToAddress,
    transferAmount,
    remarkInfo,
    executionBlock,
    officeType,
  });
  yield put(congressActions.congressSendLlm.success());
}

function* congressSendLldWorker({
  payload: {
    transferToAddress, transferAmount, remarkInfo, executionBlock,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(congressSenateSendLld, {
    walletAddress,
    transferToAddress,
    transferAmount,
    remarkInfo,
    executionBlock,
    officeType,
  });
  yield put(congressActions.congressSendLld.success());
}

function* congressSendAssetsTransfer({
  payload: {
    transferToAddress, transferAmount, assetData, remarkInfo, executionBlock,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(congressSenateSendAssets, {
    walletAddress,
    transferToAddress,
    transferAmount,
    assetData,
    remarkInfo,
    executionBlock,
    officeType,
  });
  yield put(congressActions.congressSendAssets.success());
}

function* congressSendLlmToPolitipoolWorker({
  payload: {
    transferToAddress, transferAmount, remarkInfo, executionBlock,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(congressSenateSendLlmToPolitipool, {
    walletAddress,
    transferToAddress,
    transferAmount,
    remarkInfo,
    executionBlock,
    officeType,
  });
  yield put(congressActions.congressSendLlmToPolitipool.success());
}

function* getMembersWorker() {
  const members = yield call(getCongressMembers);
  const membersUnique = members.map((item) => item.toString());
  const identities = yield call(getIdentitiesNames, membersUnique);
  const membersWithIdentities = membersUnique.map((member) => ({
    member,
    identity: identities[member] || null,
  }));
  yield put(congressActions.getMembers.success(membersWithIdentities));
}

function* getRunnersUpWorker() {
  const runnersUp = yield call(getRunnersUp);
  yield put(congressActions.getRunnersUp.success(runnersUp));
}

function* renounceCandidacyWorker(action) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(renounceCandidacy, walletAddress, action.payload);
  yield put(congressActions.getMembers.call());
  yield put(congressActions.getCandidates.call());
  yield put(congressActions.renounceCandidacy.success());
}

function* congressProposeLegislationWorker({
  payload: { tier, id, sections },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );

  yield call(congressProposeLegislation, tier, id, sections, walletAddress);
  yield put(congressActions.congressProposeLegislation.success());
  yield put(congressActions.getMotions.call());
}

function* congressRepealLegislationWorker({ payload: { tier, id, section } }) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );

  yield call(congressRepealLegislation, tier, id, section, walletAddress);

  yield put(congressActions.congressRepealLegislation.success());
  yield put(congressActions.getMotions.call());
  yield put(legislationActions.getLegislation.call({ tier }));
}

function* congressProposeRepealLegislationWorker({
  payload: {
    discussionName,
    discussionDescription,
    discussionLink,
    tier,
    id,
    section,
    fastTrack,
    fastTrackVotingPeriod,
    fastTrackEnactmentPeriod,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );

  yield call(
    congressProposeRepealLegislation,
    discussionName,
    discussionDescription,
    discussionLink,
    tier,
    id,
    section,
    fastTrack,
    daysToBlocks(fastTrackVotingPeriod),
    daysToBlocks(fastTrackEnactmentPeriod),
    walletAddress,
  );

  yield put(congressActions.congressProposeRepealLegislation.success());
  yield put(congressActions.getMotions.call());
  yield put(legislationActions.getLegislation.call({ tier }));
}

function* getTreasuryInfoWorker() {
  const proposals = yield call(getTreasurySpendProposals);
  const budget = yield call(getTreasuryBudget);
  const period = yield call(getTreasurySpendPeriod);
  yield put(
    congressActions.getTreasuryInfo.success({
      proposals,
      budget,
      period,
    }),
  );
}

function* approveTreasurySpendWorker({ payload: { id } }) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );

  yield call(congressApproveTreasurySpend, id, walletAddress);
  yield put(congressActions.approveTreasurySpend.success());
  yield put(congressActions.getTreasuryInfo.call());
}

function* unapproveTreasurySpendWorker({ payload: { id } }) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );

  yield call(congressUnapproveTreasurySpend, id, walletAddress);
  yield put(congressActions.unapproveTreasurySpend.success());
  yield put(congressActions.getTreasuryInfo.call());
}

function* closeMotionWorker({ payload: { proposal, index } }) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(closeCongressMotion, proposal, index, walletAddress);
  yield put(congressActions.closeMotion.success());
  yield put(congressActions.getMotions.call());
}

function* congressProposeLegislationViaReferendumWorker({
  payload: {
    discussionName,
    discussionDescription,
    discussionLink,
    tier,
    id,
    sections,
    fastTrack,
    fastTrackVotingPeriod,
    fastTrackEnactmentPeriod,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );

  yield call(
    congressProposeLegislationViaReferendum,
    discussionName,
    discussionDescription,
    discussionLink,
    tier,
    id,
    sections,
    fastTrack,
    daysToBlocks(fastTrackVotingPeriod),
    daysToBlocks(fastTrackEnactmentPeriod),
    walletAddress,
  );

  yield put(congressActions.congressProposeLegislationViaReferendum.success());
  yield put(congressActions.getMotions.call());
}

function* congressSendTreasuryLldWorker({
  payload: { transferToAddress, transferAmount },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(
    congressSendTreasuryLld,
    transferToAddress,
    transferAmount,
    walletAddress,
  );

  yield put(congressActions.congressSendTreasuryLld.success());
}

function* congressDemocracyBlacklistWorker({
  payload: { hash, referendumIndex },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );

  yield call(congressDemocracyBlacklist, hash, referendumIndex, walletAddress);
  yield put(congressActions.congressDemocracyBlacklist.success());
  yield put(democracyActions.getDemocracy.call());
}

function* congressAmendLegislationWorker({
  payload: {
    tier, id, section, content,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );

  yield call(
    congressAmendLegislation,
    tier,
    id,
    section,
    content,
    walletAddress,
  );

  yield put(congressActions.congressAmendLegislation.success());
  yield put(congressActions.getMotions.call());
}

function* congressAmendLegislationViaReferendumWorker({
  payload: {
    discussionName,
    discussionDescription,
    discussionLink,
    tier,
    id,
    section,
    content,
    fastTrack,
    fastTrackVotingPeriod,
    fastTrackEnactmentPeriod,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );

  yield call(
    congressAmendLegislationViaReferendum,
    discussionName,
    discussionDescription,
    discussionLink,
    tier,
    id,
    section,
    content,
    fastTrack,
    daysToBlocks(fastTrackVotingPeriod),
    daysToBlocks(fastTrackEnactmentPeriod),
    walletAddress,
  );

  yield put(congressActions.congressAmendLegislationViaReferendum.success());
  yield put(congressActions.getMotions.call());
}

function* getAllBalanceForCongressWorker(action) {
  const congressWalletAddress = yield select(congressSelectors.walletAddress);

  if (!congressWalletAddress) {
    yield put(congressActions.getAllBalanceForCongress.failure());
    return;
  }

  const additionalAssets = yield call(
    getAdditionalAssets,
    congressWalletAddress,
    false,
    action.payload?.isLlmNeeded,
  );

  const balances = yield select(
    congressSelectors.balances,
  );
  const lldBalance = yield select(
    congressSelectors.liquidDollarsBalance,
  );
  const llmItem = additionalAssets.find((item) => item.index === 1);

  const politiPoolLlm = formatMerits(
    balances.liberstake.amount,
  );

  const llmPolitiPool = {
    balance: {
      balance: politiPoolLlm,
    },
    index: IndexHelper.POLITIPOOL_LLM,
    metadata: {
      name: 'PolitiPool LLM',
      symbol: 'POLITIPOOL_LLM',
      decimals: llmItem.metadata.decimals,
    },
  };

  const lldItem = {
    balance: {
      balance: lldBalance,
    },
    index: IndexHelper.LLD,
    metadata: {
      decimals: '12',
      name: 'Liberland Dolar',
      symbol: 'LLD',
    },
  };
  yield put(congressActions.getAllBalanceForCongress.success([...additionalAssets, lldItem, llmPolitiPool]));
}

function* congressBudgetProposeWorker({
  payload: {
    budgetProposalItems, executionBlock,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );

  yield call(congressProposeBudget, {
    walletAddress, itemsCouncilPropose: budgetProposalItems, executionBlock,
  });
  yield put(congressActions.congressBudgetPropose.success());
  yield put(congressActions.getMotions.call());
}

// WATCHERS

export function* congressBudgetProposeWatcher() {
  yield* blockchainWatcher(
    congressActions.congressBudgetPropose,
    congressBudgetProposeWorker,
  );
}

export function* getAllBalanceForCongressWatcher() {
  yield* blockchainWatcher(
    congressActions.getAllBalanceForCongress,
    getAllBalanceForCongressWorker,
  );
}

export function* applyForCongressWatcher() {
  yield* blockchainWatcher(
    congressActions.applyForCongress,
    applyForCongressWorker,
  );
}

export function* getCandidatesWatcher() {
  try {
    yield takeLatest(congressActions.getCandidates.call, getCandidatesWorker);
  } catch (e) {
    yield put(congressActions.getCandidates.failure(e));
  }
}

export function* getMotionsWatcher() {
  try {
    yield takeLatest(congressActions.getMotions.call, getMotionsWorker);
  } catch (e) {
    yield put(congressActions.getMotions.failure(e));
  }
}

export function* voteAtMotionsWatcher() {
  yield* blockchainWatcher(congressActions.voteAtMotions, voteAtMotionsWorker);
}

export function* congressSendLlmWatcher() {
  yield* blockchainWatcher(
    congressActions.congressSendLlm,
    congressSendLlmWorker,
  );
}

export function* congressSendLldWatcher() {
  yield* blockchainWatcher(
    congressActions.congressSendLld,
    congressSendLldWorker,
  );
}

export function* congressSendAssetsTransferWatcher() {
  yield* blockchainWatcher(
    congressActions.congressSendAssets,
    congressSendAssetsTransfer,
  );
}

export function* congressSendLlmToPolitipoolWatcher() {
  yield* blockchainWatcher(
    congressActions.congressSendLlmToPolitipool,
    congressSendLlmToPolitipoolWorker,
  );
}

export function* getMembersWatcher() {
  try {
    yield takeLatest(congressActions.getMembers.call, getMembersWorker);
  } catch (e) {
    yield put(congressActions.getMembers.failure(e));
  }
}

export function* renounceCandidacyWatcher() {
  yield* blockchainWatcher(
    congressActions.renounceCandidacy,
    renounceCandidacyWorker,
  );
}

export function* getRunnersUpWatcher() {
  try {
    yield takeLatest(congressActions.getRunnersUp.call, getRunnersUpWorker);
  } catch (e) {
    yield put(congressActions.getRunnersUp.failure(e));
  }
}

export function* congressProposeLegislationWatcher() {
  yield* blockchainWatcher(
    congressActions.congressProposeLegislation,
    congressProposeLegislationWorker,
  );
}

export function* congressRepealLegislationWatcher() {
  yield* blockchainWatcher(
    congressActions.congressRepealLegislation,
    congressRepealLegislationWorker,
  );
}

export function* congressProposeRepealLegislationWatcher() {
  yield* blockchainWatcher(
    congressActions.congressProposeRepealLegislation,
    congressProposeRepealLegislationWorker,
  );
}

export function* getTreasuryInfoWatcher() {
  yield* blockchainWatcher(
    congressActions.getTreasuryInfo,
    getTreasuryInfoWorker,
  );
}

export function* approveTreasurySpendWatcher() {
  yield* blockchainWatcher(
    congressActions.approveTreasurySpend,
    approveTreasurySpendWorker,
  );
}

export function* unapproveTreasurySpendWatcher() {
  yield* blockchainWatcher(
    congressActions.unapproveTreasurySpend,
    unapproveTreasurySpendWorker,
  );
}

export function* closeMotionWatcher() {
  yield* blockchainWatcher(congressActions.closeMotion, closeMotionWorker);
}

export function* congressProposeLegislationViaReferendumWatcher() {
  yield* blockchainWatcher(
    congressActions.congressProposeLegislationViaReferendum,
    congressProposeLegislationViaReferendumWorker,
  );
}

export function* congressSendTreasuryLldWatcher() {
  yield* blockchainWatcher(
    congressActions.congressSendTreasuryLld,
    congressSendTreasuryLldWorker,
  );
}

export function* congressDemocracyBlacklistWatcher() {
  yield* blockchainWatcher(
    congressActions.congressDemocracyBlacklist,
    congressDemocracyBlacklistWorker,
  );
}

export function* congressAmendLegislationWatcher() {
  yield* blockchainWatcher(
    congressActions.congressAmendLegislation,
    congressAmendLegislationWorker,
  );
}

export function* congressAmendLegislationViaReferendumWatcher() {
  yield* blockchainWatcher(
    congressActions.congressAmendLegislationViaReferendum,
    congressAmendLegislationViaReferendumWorker,
  );
}

export function* congressSpendingWatcher() {
  yield* blockchainWatcher(
    congressActions.congressSpending,
    spendingWorker,
  );
}

export function* getWalletWatcher() {
  yield* blockchainWatcher(congressActions.congressGetWallet, getWalletWorker);
}
