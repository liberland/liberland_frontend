import {
  put, takeLatest, call, cps, select,
} from 'redux-saga/effects';
import { web3Enable } from '@polkadot/extension-dapp';

import { votingActions } from '../actions';

import {
  applyMyCandidacy,
  getCandidacyListRpc,
  sendElectoralSheetRpc,
  setIsVotingInProgressRpc,
  getMinistersRpc,
  getPeriodAndVotingDurationRpc,
  getCurrentBlockNumberRpc,
  getLiberStakeAmountRpc,
} from '../../api/nodeRpcCall';

import route from '../../router';

import truncate from '../../utils/truncate';
import { votingSelectors } from '../selectors';

// WORKERS

function* addMyCandidacyWorker() {
  try {
    const extensions = yield web3Enable('Liberland dapp');
    if (extensions.length) {
      yield cps(applyMyCandidacy);
      yield put(votingActions.addMyCandidacy.success());
      yield put(votingActions.getListOfCandidacy.call());
    }
  } catch (e) {
    yield put(votingActions.addMyCandidacy.failure(e));
  }
}

function* getListOFCandidacyWorker() {
  try {
    const extensions = yield web3Enable('Liberland dapp');
    if (extensions.length) {
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
    }
  } catch (e) {
    yield put(votingActions.getListOfCandidacy.failure(e));
  }
}

function* sendElectoralSheetWorker(action) {
  try {
    const { history } = action.payload;
    const extensions = yield web3Enable('Liberland dapp');
    const electoralSheet = yield select(votingSelectors.selectorElectoralSheet);
    if (extensions.length) {
      yield cps(sendElectoralSheetRpc, electoralSheet);
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

function* getMinistersListWorker() {
  try {
    const result = yield call(getMinistersRpc);
    yield put(votingActions.getMinistersList.success(result));
  } catch (e) {
    yield put(votingActions.getMinistersList.failure(e));
  }
}

function* getPeriodAndVotingDurationWorker() {
  try {
    const result = yield call(getPeriodAndVotingDurationRpc);
    yield put(votingActions.getPeriodAndVotingDuration.success(result));
  } catch (e) {
    yield put(votingActions.getPeriodAndVotingDuration.failure(e));
  }
}

function* getCurrentBlockNumberWorker() {
  try {
    const result = yield call(getCurrentBlockNumberRpc);
    yield put(votingActions.getCurrentBlockNumber.success(result));
  } catch (e) {
    yield put(votingActions.getCurrentBlockNumber.failure(e));
  }
}

function* getLiberStakeAmountWorker() {
  try {
    const result = yield call(getLiberStakeAmountRpc);
    yield put(votingActions.getLiberStakeAmount.success(result));
  } catch (e) {
    yield put(votingActions.getLiberStakeAmount.failure(e));
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

function* getMinistersListWatcher() {
  try {
    yield takeLatest(votingActions.getMinistersList.call, getMinistersListWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(votingActions.getMinistersList.failure(e));
  }
}

function* getPeriodAndVotingDurationWatcher() {
  try {
    // eslint-disable-next-line max-len
    yield takeLatest(votingActions.getPeriodAndVotingDuration.call, getPeriodAndVotingDurationWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(votingActions.getPeriodAndVotingDuration.failure(e));
  }
}

function* getCurrentBlockNumberWatcher() {
  try {
    yield takeLatest(votingActions.getCurrentBlockNumber.call, getCurrentBlockNumberWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(votingActions.getCurrentBlockNumber.failure(e));
  }
}

function* getLiberStakeAmountWatcher() {
  try {
    yield takeLatest(votingActions.getLiberStakeAmount.call, getLiberStakeAmountWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(votingActions.getLiberStakeAmount.failure(e));
  }
}

export {
  addMyCandidacyWatcher,
  getListOFCandidacyWatcher,
  sendElectoralSheetWatcher,
  setIsVotingInProgressWatcher,
  getMinistersListWatcher,
  getPeriodAndVotingDurationWatcher,
  getCurrentBlockNumberWatcher,
  getLiberStakeAmountWatcher,
};
