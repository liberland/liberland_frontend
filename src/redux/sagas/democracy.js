import {
  put, takeLatest, call, select, cps,
} from 'redux-saga/effects';

import {
  getCongressMembersWithIdentity,
  getDemocracyReferendums,
  secondProposal,
  voteOnReferendum,
  submitProposal, voteForCongress,
  delegateDemocracy, undelegateDemocracy,
} from '../../api/nodeRpcCall';
import { blockchainWatcher } from './base';

import { blockchainSelectors } from '../selectors';

import { blockchainActions, democracyActions } from '../actions';

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
    const { errorData } = yield cps(secondProposal, walletAddress, action.payload.proposalIndex);
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
    const { errorData } = yield cps(
      voteOnReferendum,
      walletAddress,
      action.payload.referendumIndex,
      action.payload.voteType,
    );
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

function* proposeWorker({
  payload: {
    userWalletAddress, values,
  },
}) {
  yield call(submitProposal, userWalletAddress, values);

  yield put(democracyActions.propose.success());
  yield put(democracyActions.getDemocracy.call());
}

function* voteForCongressWorker(action) {
  try {
    const { errorData } = yield cps(
      voteForCongress,
      action.payload.selectedCandidates,
      action.payload.userWalletAddress,
    );
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(democracyActions.voteForCongress.failure(errorData));
    } else {
      yield put(democracyActions.voteForCongress.success());
      yield put(democracyActions.getDemocracy.call());
    }
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.log('Error in vote for congress worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(democracyActions.voteForCongress.failure(errorData));
  }
}

function* delegateWorker(action) {
  try {
    const { errorData } = yield cps(
      delegateDemocracy,
      action.payload.values.delegateAddress,
      action.payload.userWalletAddress,
    );
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(democracyActions.delegate.failure(errorData));
    } else {
      yield put(democracyActions.delegate.success());
      yield put(democracyActions.getDemocracy.call());
    }
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.log('Error in delegate worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(democracyActions.delegate.failure(errorData));
  }
}

function* undelegateWorker(action) {
  try {
    const { errorData } = yield cps(
      undelegateDemocracy,
      action.payload.userWalletAddress,
    );
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(democracyActions.undelegate.failure(errorData));
    } else {
      yield put(democracyActions.undelegate.success());
      yield put(democracyActions.getDemocracy.call());
    }
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.log('Error in undelegate worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(democracyActions.undelegate.failure(errorData));
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
  yield* blockchainWatcher(
    democracyActions.propose,
    proposeWorker,
  );
}

function* voteForCongressWatcher() {
  try {
    yield takeLatest(democracyActions.voteForCongress.call, voteForCongressWorker);
  } catch (e) {
    yield put(democracyActions.voteForCongress.failure(e));
  }
}

function* delegateWatcher() {
  try {
    yield takeLatest(democracyActions.delegate.call, delegateWorker);
  } catch (e) {
    yield put(democracyActions.delegate.failure(e));
  }
}

function* undelegateWatcher() {
  try {
    yield takeLatest(democracyActions.undelegate.call, undelegateWorker);
  } catch (e) {
    yield put(democracyActions.undelegate.failure(e));
  }
}

export {
  getDemocracyWatcher,
  secondProposalWatcher,
  voteOnReferendumWatcher,
  proposeWatcher,
  voteForCongressWatcher,
  delegateWatcher,
  undelegateWatcher,
};
