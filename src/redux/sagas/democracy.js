import {
  put, takeLatest, call, select, cps,
} from 'redux-saga/effects';

import {
  getCongressMembersWithIdentity,
  getDemocracyReferendums,
  secondProposal,
  voteOnReferendum,
  submitProposal,
  getResultByHashRpc,
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
    yield put(democracyActions.getDemocracy.success({ democracy }));
  } catch (e) {
    yield put(democracyActions.getDemocracy.failure(e));
  }
}

function* secondProposalWorker(action) {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const blockHash = yield cps(secondProposal, walletAddress, action.payload.proposalIndex);
    const status = yield call(getResultByHashRpc, blockHash);
    if (status.result === 'success') {
      yield put(democracyActions.secondProposal.success());
      yield put(democracyActions.getDemocracy.call());
    } else {
      // FIXME somehow show error to user
      yield put(democracyActions.secondProposal.failure());
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error in secondProposalWorker', e);
    yield put(democracyActions.secondProposal.failure(e));
  }
}

function* voteReferendumWorker(action) {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    console.log('Starting voteOnRef');
    const blockHash = yield cps(voteOnReferendum, walletAddress, action.payload.referendumIndex, action.payload.voteType);
    const status = yield call(getResultByHashRpc, blockHash);
    if (status.result === 'success') {
      yield put(democracyActions.voteOnReferendum.success());
      yield put(democracyActions.getDemocracy.call());
    } else {
      // FIXME somehow show error to user
      yield put(democracyActions.voteOnReferendum.failure());
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error in vote on referendum', e);
    yield put(democracyActions.voteOnReferendum.failure(e));
  }
}

function* proposeWorker(action) {
  try {
    const walletAddress = action.payload.userWalletAddress;
    const { values } = action.payload;
    const blockHash = yield cps(submitProposal, walletAddress, values);
    const status = yield call(getResultByHashRpc, blockHash);
    if (status.result === 'success') {
      yield put(democracyActions.propose.success());
      yield put(democracyActions.getDemocracy.call());
    } else {
      // FIXME somehow show error to user
      yield put(democracyActions.propose.failure());
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Error in propose worker', e);
    yield put(democracyActions.propose.failure(e));
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

function* proposeWatcher() {
  try {
    yield takeLatest(democracyActions.propose.call, proposeWorker);
  } catch (e) {
    yield put(democracyActions.propose.failure(e));
  }
}

export {
  getDemocracyWatcher,
  secondProposalWatcher,
  voteOnReferendumWatcher,
  proposeWatcher,
};
