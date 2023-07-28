import {
  put, takeLatest, call, cps,
} from 'redux-saga/effects';

import {
  getIdentity,
  provideJudgement,
  getCompanyRequest,
  getCompanyRegistration,
  registerCompany,
  getLlmBalances,
  getLldBalances,
} from '../../api/nodeRpcCall';

import { officesActions, blockchainActions } from '../actions';
import { getAddressLLM } from '../../api/backend';

// WORKERS

function* getIdentityWorker(action) {
  try {
    const identity = yield call(getIdentity, action.payload);
    yield put(officesActions.officeGetIdentity.success(identity));
  } catch (e) {
    yield put(officesActions.officeGetIdentity.failure(e));
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
      yield put(officesActions.officeGetIdentity.call(action.payload.address))
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

function* getBalancesWorker(action) {
  try {
    const lldBalances = yield call(getLldBalances, action.payload);
    const llmBalances = yield call(getLlmBalances, action.payload);
    yield put(officesActions.getBalances.success({ LLD: lldBalances, LLM: llmBalances }));
  } catch (e) {
    console.error(e);
    yield put(officesActions.getBalances.failure(e));
  }
}

function* getAddressLLMWorker(action) {
  try {
    const llmBalance = yield call(getAddressLLM, action.payload.walletAddress);
    yield put(officesActions.getAddressLlm.success({ llmBalance }));
  } catch (e) {
    console.log(e)
    yield put(officesActions.getAddressLlm.failure(e));
  }
}

// WATCHERS

function* getIdentityWatcher() {
  try {
    yield takeLatest(officesActions.officeGetIdentity.call, getIdentityWorker);
  } catch (e) {
    yield put(officesActions.officeGetIdentity.failure(e));
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

function* getBalancesWatcher() {
  try {
    yield takeLatest(officesActions.getBalances.call, getBalancesWorker);
  } catch (e) {
    yield put(officesActions.getBalances.failure(e));
  }
}


function* getAddressLLMWatcher() {
  try {
    yield takeLatest(officesActions.getAddressLlm.call, getAddressLLMWorker);
  } catch (e) {
    console.log(e)
    yield put(officesActions.getAddressLlm.failure(e));
  }
}

export {
  getAddressLLMWatcher,
  getIdentityWatcher,
  provideJudgementWatcher,
  getCompanyRequestWatcher,
  getCompanyRegistrationWatcher,
  registerCompanyWatcher,
  getBalancesWatcher,
};
