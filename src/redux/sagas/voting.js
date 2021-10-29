import {
  put, takeLatest, call, cps, select,
} from 'redux-saga/effects';

import { votingActions } from '../actions';

import {
  applyMyCandidacy,
  getCandidacyListRpc,
  sendElectoralSheetRpc,
  setIsVotingInProgressRpc,
  getMinistersRpc,
} from '../../api/nodeRpcCall';

import route from '../../router';

import truncate from '../../utils/truncate';
import { blockchainSelectors, votingSelectors } from '../selectors';

// WORKERS

function* addMyCandidacyWorker() {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    yield cps(applyMyCandidacy, walletAddress);
    yield put(votingActions.addMyCandidacy.success());
    yield put(votingActions.getListOfCandidacy.call());
  } catch (e) {
    yield put(votingActions.addMyCandidacy.failure(e));
  }
}

function* getListOFCandidacyWorker() {
  try {
    let listOfCandidacy = yield call(getCandidacyListRpc);
    listOfCandidacy = yield listOfCandidacy.map((el) => (
      {
        id: el.pasportId,
        deputies: truncate(el.pasportId, 10),
        supported: '10.000 LLM',
        action: 'Vote',
        place: '',
      }
    ));
    yield put(votingActions.getListOfCandidacy.success(listOfCandidacy));
  } catch (e) {
    yield put(votingActions.getListOfCandidacy.failure(e));
  }
}

function* sendElectoralSheetWorker(action) {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const { history } = action.payload;
    const electoralSheet = yield select(votingSelectors.selectorElectoralSheet);
    const args = [electoralSheet, walletAddress];
    if (walletAddress) {
      yield cps(sendElectoralSheetRpc, args);
      yield put(votingActions.sendElectoralSheet.success());
      yield call(history.push, route.voting.congressionalAssemble);
    }
  } catch (e) {
    yield put(votingActions.sendElectoralSheet.failure(e));
  }
}

function* setIsVotingInProgressWorker() {
  try {
    const result = yield call(setIsVotingInProgressRpc);
    yield put(votingActions.setIsVotingInProgress.success(result));
  } catch (e) {
    yield put(votingActions.setIsVotingInProgress.failure(e));
  }
}

function* getAssembliesListWorker() {
  try {
    const result = yield call(getMinistersRpc);
    yield put(votingActions.getAssembliesList.success(result.finaleObject));
    yield put(votingActions.getLiberStakeAmount.success(result.liberStakeAmount));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(votingActions.getAssembliesList.failure(e));
  }
}

// WATCHERS

function* addMyCandidacyWatcher() {
  try {
    yield takeLatest(votingActions.addMyCandidacy.call, addMyCandidacyWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(votingActions.addMyCandidacy.failure(e));
  }
}

function* getListOFCandidacyWatcher() {
  try {
    yield takeLatest(votingActions.getListOfCandidacy.call, getListOFCandidacyWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(votingActions.getListOfCandidacy.failure(e));
  }
}

function* sendElectoralSheetWatcher() {
  try {
    yield takeLatest(votingActions.sendElectoralSheet.call, sendElectoralSheetWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(votingActions.sendElectoralSheet.failure(e));
  }
}

function* setIsVotingInProgressWatcher() {
  try {
    yield takeLatest(votingActions.setIsVotingInProgress.call, setIsVotingInProgressWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(votingActions.sendElectoralSheet.failure(e));
  }
}

function* getAssembliesListWatcher() {
  try {
    yield takeLatest(votingActions.getAssembliesList.call, getAssembliesListWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(votingActions.getAssembliesList.failure(e));
  }
}

export {
  addMyCandidacyWatcher,
  getListOFCandidacyWatcher,
  sendElectoralSheetWatcher,
  setIsVotingInProgressWatcher,
  getAssembliesListWatcher,
};
