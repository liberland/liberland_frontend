import {
  put, takeLatest, call, select,
} from 'redux-saga/effects';

import {
  getCongressMembersWithIdentity,
  getDemocracyReferendums,
  secondProposal,
  voteOnReferendum,
} from '../../api/nodeRpcCall';

import { blockchainSelectors } from '../selectors';

import { democracyActions } from '../actions';

// WORKERS

function* getDemocracyWorker() {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    // TODO use user wallet address once chain is in good state
    // walletAddress = '5GGgzku3kHSnAjxk7HBNeYzghSLsQQQGGznZA7u3h6wZUseo';
    const directDemocracyInfo = yield call(getDemocracyReferendums, walletAddress);
    const currentCongressMembers = yield call(getCongressMembersWithIdentity, walletAddress);
    const democracy = { ...directDemocracyInfo, ...currentCongressMembers };
    console.log('democracy');
    console.log(democracy);
    yield put(democracyActions.getDemocracy.success({ democracy }));
  } catch (e) {
    yield put(democracyActions.getDemocracy.failure(e));
  }
}

function* secondProposalWorker(action) {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    // TODO use user wallet address once chain is in good state
    // walletAddress = '5GGgzku3kHSnAjxk7HBNeYzghSLsQQQGGznZA7u3h6wZUseo';
    console.log('action.payload');
    console.log(action.payload);
    yield call(secondProposal, ...[walletAddress, action.payload.proposalIndex]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Error in secondProposalWorker', e);
    return 'failure';
  }
}

function* voteReferendumWorker(action) {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    // TODO use user wallet address once chain is in good state
    // walletAddress = '5GGgzku3kHSnAjxk7HBNeYzghSLsQQQGGznZA7u3h6wZUseo';
    yield call(voteOnReferendum, ...[walletAddress, action.payload.referendumIndex, action.payload.voteType]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Error in voteonreferendum', e);
    return 'failure';
  }
}

// WATCHERS

function* getDemocracyWatcher() {
  try {
    yield takeLatest(democracyActions.getDemocracy.call, getDemocracyWorker);
  } catch (e) {
    yield put(democracyActions.getDemocracy.failure(e));
  }
}

function* secondProposalWatcher() {
  try {
    yield takeLatest(democracyActions.secondProposal.call, secondProposalWorker);
  } catch (e) {
    yield put(democracyActions.secondProposal.failure(e));
  }
}

function* voteOnReferendumWatcher() {
  try {
    yield takeLatest(democracyActions.voteOnReferendum.call, voteReferendumWorker);
  } catch (e) {
    yield put(democracyActions.voteOnReferendum.failure(e));
  }
}

export {
  getDemocracyWatcher,
  secondProposalWatcher,
  voteOnReferendumWatcher,
};
