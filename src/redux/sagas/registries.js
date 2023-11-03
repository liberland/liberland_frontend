import {
  put, takeLatest, call, select,
} from 'redux-saga/effects';

import {
  getOfficialUserRegistryEntries, requestCompanyRegistration,
} from '../../api/nodeRpcCall';

import {registriesActions} from '../actions';
import {blockchainSelectors} from "../selectors";
import {blockchainWatcher} from "./base";
import router from "../../router";

// WORKERS

function* getOfficialUserRegistryEntriesWorker(action) {
  try {
    const officialUserRegistryEntries = yield call(getOfficialUserRegistryEntries, action.payload);
    yield put(registriesActions.getOfficialUserRegistryEntries.success({
      officialUserRegistryEntries,
    }));
  } catch (e) {
    console.error(e)
    console.log(e)
    yield put(registriesActions.getOfficialUserRegistryEntries.failure(e));
  }
}

function* setRegistryCRUDActionWorker(action) {
  try {
    yield put(registriesActions.setRegistryCRUDAction.success(
      action.payload,
    ));
  } catch (e) {
    console.error(e)
  }
}

function* requestCompanyRegistrationWorker(action) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(requestCompanyRegistration, action.payload.companyData, walletAddress);
  yield put(registriesActions.getOfficialUserRegistryEntries.call())
  yield put(registriesActions.requestCompanyRegistrationAction.success())
  action.payload.history.push(router.registries.companies);
}

// WATCHERS

export function* getOfficialUserRegistryEntriesWatcher() {
  try {
    yield takeLatest(registriesActions.getOfficialUserRegistryEntries.call, getOfficialUserRegistryEntriesWorker);
  } catch (e) {
    yield put(registriesActions.getOfficialUserRegistryEntries.failure(e));
  }
}

export function* setRegistryCRUDActionWatcher() {
  try {
    yield takeLatest(registriesActions.setRegistryCRUDAction.call, setRegistryCRUDActionWorker);
  } catch (e) {
    yield put(registriesActions.setRegistryCRUDAction.failure(e));
  }
}

export function* requestCompanyRegistrationWatcher() {
  yield* blockchainWatcher(registriesActions.requestCompanyRegistrationAction, requestCompanyRegistrationWorker)
}