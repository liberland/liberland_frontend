import {
  put, takeLatest, call, select,
} from 'redux-saga/effects';

import {
  getOfficialUserRegistryEntries,
  requestCompanyRegistration,
  requestEditCompanyRegistration,
} from '../../api/nodeRpcCall';

import { registriesActions } from '../actions';
import { blockchainSelectors } from '../selectors';
import { blockchainWatcher } from './base';

// WORKERS

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
  yield put(registriesActions.getOfficialUserRegistryEntries.call());
  yield put(registriesActions.requestCompanyRegistrationAction.success());
}

function* requestEditCompanyRegistrationWorker(action) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(
    requestEditCompanyRegistration,
    action.payload.companyData,
    action.payload.companyId,
    walletAddress,
  );
  yield put(registriesActions.getOfficialUserRegistryEntries.call());
  yield put(registriesActions.requestEditCompanyRegistrationAction.success());
}

// WATCHERS

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
