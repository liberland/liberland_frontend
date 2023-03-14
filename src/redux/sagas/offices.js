import {
  put, takeLatest, call, cps,
} from 'redux-saga/effects';

import {
  getIdentity,
  provideJudgement,
  getCompanyRequest,
  getCompanyRegistration,
  registerCompany,
} from '../../api/nodeRpcCall';

import { officesActions, blockchainActions } from '../actions';

// WORKERS

function* getIdentityWorker(action) {
  try {
    const identity = yield call(getIdentity, action.payload);
    yield put(officesActions.getIdentity.success(identity));
  } catch (e) {
    yield put(officesActions.getIdentity.failure(e));
  }
}

function* provideJudgementWorker(action) {
  try {
    const { blockHash, errorData } = yield cps(provideJudgement, action.payload);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(officesActions.provideJudgement.failure())
    } else {
      yield put(officesActions.provideJudgement.success())
      yield put(officesActions.getIdentity.call(action.payload.address))
    }
  } catch (errorData) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(officesActions.provideJudgement.failure())
  }
}

function* getCompanyRequestWorker(action) {
  try {
    const request = yield call(getCompanyRequest, action.payload);
    yield put(officesActions.getCompanyRequest.success(request));
  } catch (e) {
    console.error(e);
    yield put(officesActions.getCompanyRequest.failure(e));
  }
}

function* getCompanyRegistrationWorker(action) {
  try {
    const registration = yield call(getCompanyRegistration, action.payload);
    yield put(officesActions.getCompanyRegistration.success(registration));
  } catch (e) {
    console.error(e);
    yield put(officesActions.getCompanyRegistration.failure(e));
  }
}

function* registerCompanyworker(action) {
  try {
    const { blockHash, errorData } = yield cps(registerCompany, action.payload);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(officesActions.registerCompany.failure())
    } else {
      yield put(officesActions.registerCompany.success())
      yield put(officesActions.getCompanyRequest.call(action.payload.entity_id))
    }
  } catch (errorData) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(officesActions.registerCompany.failure())
  }
}

// WATCHERS

function* getIdentityWatcher() {
  try {
    yield takeLatest(officesActions.getIdentity.call, getIdentityWorker);
  } catch (e) {
    yield put(officesActions.getIdentity.failure(e));
  }
}

function* provideJudgementWatcher() {
  try {
    yield takeLatest(officesActions.provideJudgement.call, provideJudgementWorker);
  } catch (e) {
    yield put(officesActions.provideJudgement.failure(e));
  }
}

function* getCompanyRequestWatcher() {
  try {
    yield takeLatest(officesActions.getCompanyRequest.call, getCompanyRequestWorker);
  } catch (e) {
    yield put(officesActions.getCompanyRequest.failure(e));
  }
}

function* getCompanyRegistrationWatcher() {
  try {
    yield takeLatest(officesActions.getCompanyRegistration.call, getCompanyRegistrationWorker);
  } catch (e) {
    yield put(officesActions.getCompanyRegistration.failure(e));
  }
}

function* registerCompanyWatcher() {
  try {
    yield takeLatest(officesActions.registerCompany.call, registerCompanyworker);
  } catch (e) {
    yield put(officesActions.registerCompany.failure(e));
  }
}

export {
  getIdentityWatcher,
  provideJudgementWatcher,
  getCompanyRequestWatcher,
  getCompanyRegistrationWatcher,
  registerCompanyWatcher,
};
