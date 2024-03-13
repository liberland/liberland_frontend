import {
  put, call, takeLatest, select, take,
} from 'redux-saga/effects';
import { contractsActions } from '../actions';
import {
  getAllContracts,
  signContractAsJudge,
  signContractAsParty,
  removeContract,
  getIsUserJudges,
  getIdentitiesNames,
  getSingleContract,
} from '../../api/nodeRpcCall';
import { blockchainWatcher } from './base';
import { blockchainSelectors, contractsSelectors } from '../selectors';

function addNameIdentityToAdress(contract) {
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
}

function* addNameIdentityToEachAdress(contracts) {
  const addresses = Array.isArray(contracts)
    ? contracts.map((contract) => addNameIdentityToAdress(contract)) : addNameIdentityToAdress(contracts);
  const flattenedAddresses = Array.from(new Set([].concat(...addresses)));
  const names = yield call(getIdentitiesNames, flattenedAddresses);
  return names;
}

function* getSingleContractWorker({ payload }) {
  try {
    const { id } = payload;
    const walletAddress = yield select(
      blockchainSelectors.userWalletAddressSelector,
    );
    const singleContract = yield call(getSingleContract, id);
    const isUserJudge = yield call(getIsUserJudges, walletAddress);
    const names = yield addNameIdentityToEachAdress(singleContract);
    yield put(
      contractsActions.getSingleContract.success({ singleContract, isUserJudge, names }),
    );
  } catch (e) {
    yield put(contractsActions.getContracts.failure(e));
  }
}

export function* getSingleContractWatcher() {
  try {
    yield takeLatest(contractsActions.getSingleContract.call, getSingleContractWorker);
  } catch (e) {
    yield put(contractsActions.getSingleContract.failure(e));
  }
}

function* getMyContractsWorker() {
  try {
    const walletAddress = yield select(
      blockchainSelectors.userWalletAddressSelector,
    );
    yield put(contractsActions.getContracts.call());
    yield take(contractsActions.getContracts.success);
    const contracts = yield select(
      contractsSelectors.selectorContracts,
    );

    const isUserJudge = yield select(
      contractsSelectors.selectorIsUserJudgde,
    );
    const myContracts = isUserJudge
      ? contracts : contracts.filter((item) => item.parties.includes(walletAddress));
    yield put(
      contractsActions.getMyContracts.success({ myContracts }),
    );
  } catch (e) {
    yield put(contractsActions.getMyContracts.failure(e));
  }
}

export function* getMyContractsWatcher() {
  try {
    yield takeLatest(contractsActions.getMyContracts.call, getMyContractsWorker);
  } catch (e) {
    yield put(contractsActions.getMyContracts.failure(e));
  }
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
