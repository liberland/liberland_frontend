import {
  put, call, takeLatest, select, take, all,
} from 'redux-saga/effects';
import { web3Enable } from '@polkadot/extension-dapp';
import { blockchainActions } from '../actions';

import { blockchainSelectors } from '../selectors';

import { getCurrentBlockNumberRpc, getPeriodAndVotingDurationRpc, getAllWalletsRpc } from '../../api/nodeRpcCall';


const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

// WORKERS

function* getCurrentBlockNumberWorker() {
  try {
    const bockNumber = yield call(getCurrentBlockNumberRpc);
    yield put(blockchainActions.getCurrentBlockNumber.success(bockNumber));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.getCurrentBlockNumber.failure(e));
  }
}

function* getPeriodAndVotingDurationWorker() {
  try {
    const result = yield call(getPeriodAndVotingDurationRpc);
    yield put(blockchainActions.getPeriodAndVotingDuration.success(result));
  } catch (e) {
    yield put(blockchainActions.getPeriodAndVotingDuration.failure(e));
  }
}

function* setElectionsBlockWorker() {
  try {
    const block = yield select(blockchainSelectors.electionsBlockSelector);
    yield put(blockchainActions.setElectionsBlock.success(block));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.setElectionsBlock.failure(e));
  }
}

function* updateDateElectionsWorker() {
  try {
    yield put(blockchainActions.getCurrentBlockNumber.call());
    const nextElection = yield select(blockchainSelectors.nextElectionsBlockSelector);
    yield put(blockchainActions.setElectionsBlock.success(nextElection));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.updateDateElections.failure(e));
  }
}

function* getAllWalletsWorker() {
  try {
    let retryCounter = 0;
    let extensions = yield call(web3Enable, 'Liberland dapp');
    if (extensions.length === 0) {
      // Hack, is caused by web3Enable needing a fully loaded page to work,
      // but i am not sure how to do it other way without larger refactor
      while (retryCounter < 30 && extensions.length === 0) {
        ++retryCounter
        yield call(delay, 1000);
        extensions = yield call(web3Enable, 'Liberland dapp');
      }
    }
    if (extensions.length) {
      const allWallets = yield call(getAllWalletsRpc);
      yield put(blockchainActions.getAllWallets.success(allWallets));
    } else {
      alert('You need a wallet manager like polkadot{js} browser extension to use this page')
      yield put(blockchainActions.getAllWallets.failure('No enable Extensione'));
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.getAllWallets.failure(e));
  }
}

// WATCHERS

function* fetchBlockNumberWatcher() {
  yield takeLatest(blockchainActions.getCurrentBlockNumber.call, getCurrentBlockNumberWorker);
}

function* getPeriodAndVotingDurationWatcher() {
  try {
    // eslint-disable-next-line max-len
    yield takeLatest(blockchainActions.getPeriodAndVotingDuration.call, getPeriodAndVotingDurationWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.getPeriodAndVotingDuration.failure(e));
  }
}

function* setElectionsBlockWatcher() {
  try {
    yield takeLatest(blockchainActions.setElectionsBlock.call, setElectionsBlockWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.setElectionsBlock.failure(e));
  }
}

function* runSetElectionsBlockWorker() {
  yield all([
    take(blockchainActions.getCurrentBlockNumber.success),
    take(blockchainActions.getPeriodAndVotingDuration.success),
  ]);
  yield put(blockchainActions.setElectionsBlock.call());
}

function* updateDateElectionsWatcher() {
  try {
    yield takeLatest(blockchainActions.updateDateElections.call, updateDateElectionsWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.updateDateElections.failure(e));
  }
}
function* getAllWalletsWatcher() {
  try {
    yield takeLatest(blockchainActions.getAllWallets.call, getAllWalletsWorker);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(blockchainActions.updateDateElections.failure(e));
  }
}

export {
  fetchBlockNumberWatcher,
  getPeriodAndVotingDurationWatcher,
  setElectionsBlockWatcher,
  runSetElectionsBlockWorker,
  updateDateElectionsWatcher,
  getAllWalletsWatcher,
};
