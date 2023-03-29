import {
  put, takeLatest, call, select, cps,
} from 'redux-saga/effects';

import {
  getOfficialUserRegistryEntries, requestCompanyRegistration,
} from '../../api/nodeRpcCall';

import {blockchainActions, registriesActions} from '../actions';
import {blockchainSelectors} from "../selectors";

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
  try {
    console.log('action.payload')
    console.log(action.payload)
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const {blockHash, errorData} = yield cps(requestCompanyRegistration, walletAddress, action.payload)
    yield put(registriesActions.requestCompanyRegistrationAction.success())
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.error('Error in requestCompanyRegistrationWorker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(registriesActions.requestCompanyRegistrationAction.failure)
  }
}

// WATCHERS

function* getOfficialUserRegistryEntriesWatcher() {
  try {
    yield takeLatest(registriesActions.getOfficialUserRegistryEntries.call, getOfficialUserRegistryEntriesWorker);
  } catch (e) {
    yield put(registriesActions.getOfficialUserRegistryEntries.failure(e));
  }
}

function* setRegistryCRUDActionWatcher() {
  try {
    yield takeLatest(registriesActions.setRegistryCRUDAction.call, setRegistryCRUDActionWorker);
  } catch (e) {
    yield put(registriesActions.setRegistryCRUDAction.failure(e));
  }
}

function* requestCompanyRegistrationWatcher() {
  try {
    yield takeLatest(registriesActions.requestCompanyRegistrationAction.call, requestCompanyRegistrationWorker)
  } catch (e) {
    yield put(registriesActions.requestAssetRegistrationAction.failure(e))
  }
}

export {
  getOfficialUserRegistryEntriesWatcher,
  setRegistryCRUDActionWatcher,
  requestCompanyRegistrationWatcher
};
