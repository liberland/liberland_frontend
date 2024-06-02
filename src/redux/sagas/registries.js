import {
  put, takeLatest, call, select,
} from 'redux-saga/effects';

import {
  cancelCompanyRequest,
  getOfficialUserRegistryEntries,
  requestCompanyRegistration,
  requestEditCompanyRegistration,
  requestUnregisterCompanyRegistration,
  getOfficialRegistryEntries,
} from '../../api/nodeRpcCall';

import { registriesActions } from '../actions';
import { blockchainSelectors } from '../selectors';
import { blockchainWatcher } from './base';
import router from '../../router';

// WORKERS

function* getOfficialRegistryEntriesWorker() {
  try {
    const officialRegistryEntries = yield call(getOfficialRegistryEntries);
    yield put(registriesActions.getOfficialRegistryEntries.success({
      officialRegistryEntries,
    }));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(registriesActions.getOfficialRegistryEntries.failure(e));
  }
}

function* getOfficialUserRegistryEntriesWorker(action) {
  try {
    const officialUserRegistryEntries = yield call(getOfficialUserRegistryEntries, action.payload);
    yield put(registriesActions.getOfficialUserRegistryEntries.success({
      officialUserRegistryEntries,
    }));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(registriesActions.getOfficialUserRegistryEntries.failure(e));
  }
}

function* requestCompanyRegistrationWorker(action) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(
    requestCompanyRegistration,
    action.payload.companyData,
    action.payload.registryAllowedToEdit,
    walletAddress,
  );
  yield put(registriesActions.getOfficialUserRegistryEntries.call(walletAddress));
  yield put(registriesActions.requestCompanyRegistrationAction.success());
  action.payload.history.push(router.companies.home);
}

function* requestEditCompanyRegistrationWorker(action) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(
    requestEditCompanyRegistration,
    action.payload.companyData,
    action.payload.companyId,
    walletAddress,
  );
  yield put(registriesActions.getOfficialUserRegistryEntries.call(walletAddress));
  yield put(registriesActions.requestEditCompanyRegistrationAction.success());
  action.payload.history.push(router.companies.home);
}

function* cancelCompanyRequestWorker(action) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(
    cancelCompanyRequest,
    action.payload.companyId,
    walletAddress,
  );
  yield put(registriesActions.getOfficialUserRegistryEntries.call(walletAddress));
  yield put(registriesActions.cancelCompanyRequest.success());
}

function* requestUnregisterCompanyRegistrationWorker(action) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(
    requestUnregisterCompanyRegistration,
    action.payload.companyId,
    walletAddress,
  );
  yield put(registriesActions.getOfficialUserRegistryEntries.call());
  yield put(registriesActions.requestUnregisterCompanyRegistrationAction.success());
}

// WATCHERS

export function* getOfficialRegistryEntriesWatcher() {
  try {
    yield takeLatest(registriesActions.getOfficialRegistryEntries.call, getOfficialRegistryEntriesWorker);
  } catch (e) {
    yield put(registriesActions.getOfficialRegistryEntries.failure(e));
  }
}

export function* getOfficialUserRegistryEntriesWatcher() {
  try {
    yield takeLatest(registriesActions.getOfficialUserRegistryEntries.call, getOfficialUserRegistryEntriesWorker);
  } catch (e) {
    yield put(registriesActions.getOfficialUserRegistryEntries.failure(e));
  }
}

export function* requestCompanyRegistrationWatcher() {
  yield* blockchainWatcher(
    registriesActions.requestCompanyRegistrationAction,
    requestCompanyRegistrationWorker,
  );
}

export function* requestEditCompanyRegistrationWatcher() {
  yield* blockchainWatcher(
    registriesActions.requestEditCompanyRegistrationAction,
    requestEditCompanyRegistrationWorker,
  );
}

export function* cancelCompanyRequestWatcher() {
  yield* blockchainWatcher(
    registriesActions.cancelCompanyRequest,
    cancelCompanyRequestWorker,
  );
}

export function* requestUnregisterCompanyRegistrationWatcher() {
  yield* blockchainWatcher(
    registriesActions.requestUnregisterCompanyRegistrationAction,
    requestUnregisterCompanyRegistrationWorker,
  );
}
