import {
  put, takeLatest, call, select, cps,
} from 'redux-saga/effects';

import {
  getCongressMembersWithIdentity,
  getDemocracyReferendums,
  secondProposal,
  voteOnReferendum,
  submitProposal, voteForCongress, castVetoForLegislation, revertVetoForLegislation,
} from '../../api/nodeRpcCall';

import { blockchainSelectors } from '../selectors';

import {blockchainActions, democracyActions} from '../actions';

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
    const { blockHash, errorData } = yield cps(secondProposal, walletAddress, action.payload.proposalIndex);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(democracyActions.secondProposal.failure());
    } else {
      yield put(democracyActions.secondProposal.success());
      yield put(democracyActions.getDemocracy.call());
    }
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.error('Error in secondProposalWorker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(democracyActions.secondProposal.failure(errorData));
  }
}

function* voteReferendumWorker(action) {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const { blockHash, errorData } = yield cps(voteOnReferendum, walletAddress, action.payload.referendumIndex, action.payload.voteType);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(democracyActions.voteOnReferendum.failure());
    } else {
      yield put(democracyActions.voteOnReferendum.success());
      yield put(democracyActions.getDemocracy.call());
    }
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.error('Error in vote on referendum', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(democracyActions.voteOnReferendum.failure(errorData));
  }
}

function* proposeWorker(action) {
  try {
    const walletAddress = action.payload.userWalletAddress;
    const { values } = action.payload;
    const { blockHash, errorData } = yield cps(submitProposal, walletAddress, values);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(democracyActions.propose.failure());
    } else {
      yield put(democracyActions.propose.success());
      yield put(democracyActions.getDemocracy.call());
    }
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.log('Error in propose worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(democracyActions.propose.failure(errorData));
  }
}

function* voteForCongressWorker(action) {
  try {
    const { blockHash, errorData } = yield cps(voteForCongress, action.payload.selectedCandidates, action.payload.userWalletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(democracyActions.voteForCongress.failure(errorData));
    } else {
      yield put(democracyActions.voteForCongress.success())
      yield put(democracyActions.getDemocracy.call());
    }
  } catch (errorData) {
    console.log('Error in vote for congress worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(democracyActions.voteForCongress.failure(errorData));
  }
}

function* castVetoWorker(action) {
  try {
    const { blockHash, errorData } = yield cps(castVetoForLegislation, action.payload.tier, action.payload.index, action.payload.userWalletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(democracyActions.castVeto.failure(errorData));
    }
    else {
      yield put(democracyActions.castVeto.success())
      yield put(democracyActions.getDemocracy.call());
    }
  } catch (errorData) {
    console.log('Error in veto legislation worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(democracyActions.castVeto.failure(errorData));
  }
}

function* revertVetoWorker(action) {
  try {
    const { blockHash, errorData } = yield cps(revertVetoForLegislation, action.payload.tier, action.payload.index, action.payload.userWalletAddress);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(democracyActions.revertVeto.failure(errorData));
    } else {
      yield put(democracyActions.revertVeto.success())
      yield put(democracyActions.getDemocracy.call());
    }
  } catch (errorData) {
    console.log('Error in veto legislation worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(democracyActions.revertVeto.failure(errorData));
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

function* voteForCongressWatcher() {
  try {
    yield takeLatest(democracyActions.voteForCongress.call, voteForCongressWorker);
  } catch (e) {
    yield put(democracyActions.voteForCongress.failure(e));
  }
}

function* castVetoWatcher() {
  try {
    yield takeLatest(democracyActions.castVeto.call, castVetoWorker);
  } catch (e) {
    yield put(democracyActions.castVeto.failure(e));
  }
}

function* revertVetoWatcher() {
  try {
    yield takeLatest(democracyActions.revertVeto.call, revertVetoWorker);
  } catch (e) {
    yield put(democracyActions.revertVeto.failure(e));
  }
}

export {
  getDemocracyWatcher,
  secondProposalWatcher,
  voteOnReferendumWatcher,
  proposeWatcher,
  voteForCongressWatcher,
  castVetoWatcher,
  revertVetoWatcher
};
