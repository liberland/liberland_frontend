import {
  put, call, select,
} from 'redux-saga/effects';

import {
  getCongressMembersWithIdentity,
  getDemocracyReferendums,
  voteOnReferendum,
  submitProposal,
  voteForCongress,
  delegateDemocracy,
  undelegateDemocracy,
  proposeAmendLegislation,
  citizenProposeRepealLegislation,
  getScheduledCalls,
  getIdentitiesNames,
} from '../../api/nodeRpcCall';
import { blockchainWatcher } from './base';
import { blockchainSelectors } from '../selectors';
import {
  democracyActions, congressActions, legislationActions,
} from '../actions';

// WORKERS

function getProposers(crossReferencedList, isProposer = false) {
  const newMapedList = crossReferencedList.map((proposal) => {
    const list = proposal.centralizedDatas.map((item) => item.proposerAddress);
    return isProposer ? [proposal.proposer, ...list] : [...list];
  });
  return newMapedList.flat();
}

function* addNameForProposers(referendumsData, proposalData) {
  const proposersFromReferendum = getProposers(proposalData, true);
  const proposersFromProposal = getProposers(referendumsData);
  const proposerList = Array.from(new Set([...proposersFromReferendum, ...proposersFromProposal]));
  const identitiesNames = yield call(getIdentitiesNames, proposerList);
  return identitiesNames;
}

function* getDemocracyWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const directDemocracyInfo = yield call(getDemocracyReferendums, walletAddress);
  const currentCongressMembers = yield call(getCongressMembersWithIdentity, walletAddress);
  const { lookupItemsData } = yield call(getScheduledCalls);
  const democracyHelper = { ...directDemocracyInfo, ...currentCongressMembers, scheduledCalls: lookupItemsData };
  const identitiesName = yield addNameForProposers(
    democracyHelper.crossReferencedReferendumsData,
    democracyHelper.crossReferencedProposalsData,
  );
  const democracy = { ...democracyHelper, identitiesName };
  yield put(democracyActions.getDemocracy.success({ democracy }));
}

function* voteReferendumWorker(action) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const { referendumIndex, voteType } = action.payload;
  yield call(voteOnReferendum, walletAddress, referendumIndex, voteType);
  yield put(democracyActions.voteOnReferendum.success());
  yield put(democracyActions.getDemocracy.call());
}

function* proposeWorker(action) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const {
    tier, index,
    discussionName,
    discussionDescription,
    discussionLink,
    sections,
  } = action.payload;
  const year = new Date().getFullYear();
  yield call(
    submitProposal,
    discussionName,
    discussionDescription,
    discussionLink,
    tier,
    year,
    index,
    sections,
    walletAddress,
  );
  yield put(democracyActions.propose.success());
  yield put(democracyActions.getDemocracy.call());
}

function* voteForCongressWorker(action) {
  const { selectedCandidates, userWalletAddress } = action.payload;
  yield call(voteForCongress, selectedCandidates, userWalletAddress);
  yield put(democracyActions.voteForCongress.success());
  yield put(democracyActions.getDemocracy.call());
}

function* delegateWorker(action) {
  const { values, userWalletAddress } = action.payload;
  yield call(delegateDemocracy, values.delegateAddress, userWalletAddress);
  yield put(democracyActions.delegate.success());
  yield put(democracyActions.getDemocracy.call());
}

function* undelegateWorker(action) {
  yield call(undelegateDemocracy, action.payload.userWalletAddress);
  yield put(democracyActions.undelegate.success());
  yield put(democracyActions.getDemocracy.call());
}

function* proposeAmendLegislationWorker(action) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const {
    discussionName,
    discussionDescription,
    discussionLink,
    tier,
    id,
    section,
    content,
  } = action.payload;
  yield call(
    proposeAmendLegislation,
    discussionName,
    discussionDescription,
    discussionLink,
    tier,
    id,
    section,
    content,
    walletAddress,
  );
  yield put(democracyActions.proposeAmendLegislation.success());
  yield put(democracyActions.getDemocracy.call());
}

function* citizenProposeRepealLegislationWorker({
  payload: {
    discussionName,
    discussionDescription,
    discussionLink,
    tier,
    id,
    section,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );

  yield call(
    citizenProposeRepealLegislation,
    discussionName,
    discussionDescription,
    discussionLink,
    tier,
    id,
    section,
    walletAddress,
  );

  yield put(democracyActions.citizenProposeRepealLegislation.success());
  yield put(congressActions.getMotions.call());
  yield put(legislationActions.getLegislation.call({ tier }));
}

// WATCHERS

function* getDemocracyWatcher() {
  yield* blockchainWatcher(democracyActions.getDemocracy, getDemocracyWorker);
}

function* voteOnReferendumWatcher() {
  yield* blockchainWatcher(democracyActions.voteOnReferendum, voteReferendumWorker);
}

function* proposeWatcher() {
  yield* blockchainWatcher(democracyActions.propose, proposeWorker);
}

function* voteForCongressWatcher() {
  yield* blockchainWatcher(democracyActions.voteForCongress, voteForCongressWorker);
}

function* delegateWatcher() {
  yield* blockchainWatcher(democracyActions.delegate, delegateWorker);
}

function* undelegateWatcher() {
  yield* blockchainWatcher(democracyActions.undelegate, undelegateWorker);
}

function* proposeAmendLegislationWatcher() {
  yield* blockchainWatcher(democracyActions.proposeAmendLegislation, proposeAmendLegislationWorker);
}

export function* citizenProposeRepealLegislationWatcher() {
  yield* blockchainWatcher(
    democracyActions.citizenProposeRepealLegislation,
    citizenProposeRepealLegislationWorker,
  );
}

export {
  delegateWatcher,
  getDemocracyWatcher,
  proposeAmendLegislationWatcher,
  proposeWatcher,
  undelegateWatcher,
  voteForCongressWatcher,
  voteOnReferendumWatcher,
};
