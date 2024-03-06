import {
  put, call, takeLatest, select,
} from 'redux-saga/effects';
import { contractsActions } from '../actions';
import {
  getAllContracts,
  signContractAsJudge,
  signContractAsParty,
  removeContract,
  getIsUserJudges,
  getIdentitiesNames,
} from '../../api/nodeRpcCall';
import { blockchainWatcher } from './base';
import { blockchainSelectors } from '../selectors';

function* addNameIdentityToEachAdress(contracts) {
  const addresses = contracts.map((contract) => {
    const {
      creator, judgesSignatures, parties, partiesSignatures,
    } = contract;
    const arrays = [
      creator,
      ...judgesSignatures,
      ...parties,
      ...partiesSignatures,
    ];
    return Array.from(
      new Set(arrays),
    );
  });
  const flattenedAddresses = Array.from(new Set([].concat(...addresses)));
  return yield call(getIdentitiesNames, flattenedAddresses);
}

function* getContractsWorker() {
  try {
    const walletAddress = yield select(
      blockchainSelectors.userWalletAddressSelector,
    );
    const contracts = yield call(getAllContracts);
    const isUserJudge = yield call(getIsUserJudges, walletAddress);
    const names = yield addNameIdentityToEachAdress(contracts);
    yield put(
      contractsActions.getContracts.success({ contracts, isUserJudge, names }),
    );
  } catch (e) {
    yield put(contractsActions.getContracts.failure(e));
  }
}

export function* getContractsWorkerWatcher() {
  try {
    yield takeLatest(contractsActions.getContracts.call, getContractsWorker);
  } catch (e) {
    yield put(contractsActions.getContracts.failure(e));
  }
}

function* signContractAsPartyWorker({ payload: { contractId } }) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(signContractAsParty, contractId, walletAddress);
  yield put(contractsActions.getContracts.call());
  yield put(contractsActions.signContract.success());
}

export function* signContractAsPartyWatcher() {
  yield* blockchainWatcher(
    contractsActions.signContract,
    signContractAsPartyWorker,
  );
}

function* signContractAsJudgeWorker({ payload: { contractId } }) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(signContractAsJudge, contractId, walletAddress);
  yield put(contractsActions.getContracts.call());
  yield put(contractsActions.signContractJudge.success());
}

export function* signContractAsJudgeWatcher() {
  yield* blockchainWatcher(
    contractsActions.signContractJudge,
    signContractAsJudgeWorker,
  );
}

function* removeContractWorker({ payload: { contractId } }) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(removeContract, contractId, walletAddress);

  yield put(contractsActions.removeContract.success());
  yield put(contractsActions.getContracts.call());
}

// WATCHERS

export function* removeContractWatcher() {
  yield* blockchainWatcher(
    contractsActions.removeContract,
    removeContractWorker,
  );
}
