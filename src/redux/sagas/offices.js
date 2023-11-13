import {
  put, takeLatest, call, cps, select,
} from 'redux-saga/effects';

import {
  getIdentity,
  provideJudgementAndAssets,
  getCompanyRequest,
  getCompanyRegistration,
  registerCompany,
  getLlmBalances,
  getLldBalances,
  getPalletIds,
  unregisterCompany,
  setRegisteredCompanyData,
} from '../../api/nodeRpcCall';

import { officesActions, blockchainActions } from '../actions';
import * as backend from '../../api/backend';
import { blockchainWatcher } from './base';
import { blockchainSelectors } from '../selectors';
import router from '../../router';

// WORKERS

function* getIdentityWorker(action) {
  try {
    const onchain = yield call(getIdentity, action.payload);
    const backendUsers = yield call(backend.getUsersByAddress, action.payload);
    if (backendUsers.length > 1) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success({ details: 'More than one user has the same address?' }));
      return;
    }
    yield put(officesActions.officeGetIdentity.success({ onchain, backend: backendUsers[0] }));
  } catch (e) {
    console.error(e);
    yield put(officesActions.officeGetIdentity.failure(e));
  }
}

function* provideJudgementAndAssetsWorker(action) {
  try {
    if ((action.payload.merits || action.payload.dollars) && !action.payload.uid) {
      throw new Error('Tried to transfer LLD or LLM but we have no user id!');
    }

    const { errorData } = yield cps(provideJudgementAndAssets, action.payload);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(officesActions.provideJudgementAndAssets.failure());
      return;
    }

    if (action.payload.merits?.gt(0)) {
      try {
        yield call(backend.addMeritTransaction, action.payload.uid, action.payload.merits.mul(-1));
      } catch (e) {
        throw { details: e.response.data.error.message };
      }
    }

    yield put(officesActions.provideJudgementAndAssets.success());
    yield put(officesActions.officeGetIdentity.call(action.payload.address));
  } catch (errorData) {
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(officesActions.provideJudgementAndAssets.failure());
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

function* registerCompanyWorker(action) {
  try {
    const { blockHash, errorData } = yield cps(registerCompany, action.payload);
    if (errorData.isError) {
      yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
      yield put(blockchainActions.setError.success(errorData));
      yield put(officesActions.registerCompany.failure());
    } else {
      yield put(officesActions.registerCompany.success());
      yield put(officesActions.getCompanyRequest.call(action.payload.entity_id));
      yield put(officesActions.getCompanyRegistration.call(action.payload.entity_id));
    }
  } catch (errorData) {
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(officesActions.registerCompany.failure());
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

function* getPalletIdsWorker(action) {
  try {
    const pallets = yield call(getPalletIds, action.payload);
    yield put(officesActions.getPalletIds.success(pallets));
  } catch (e) {
    console.error(e);
    yield put(officesActions.getPalletIds.failure(e));
  }
}

function* unregisterCompanyWorker(action) {
  const userWalletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(unregisterCompany, action.payload.companyId, userWalletAddress);
  yield put(officesActions.unregisterCompany.success());
  yield put(officesActions.getCompanyRegistration.call(action.payload.companyId));
}

function* setRegisteredCompanyDataWorker(action) {
  const { companyId, companyData, history } = action.payload;
  const userWalletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(setRegisteredCompanyData, companyId, companyData, userWalletAddress);
  yield put(officesActions.setRegisteredCompanyData.success());
  yield put(officesActions.getCompanyRequest.call(companyId));
  yield put(officesActions.getCompanyRegistration.call(companyId));
  history.push(router.offices.companyRegistry.home);
}

// WATCHERS

function* getIdentityWatcher() {
  try {
    yield takeLatest(officesActions.officeGetIdentity.call, getIdentityWorker);
  } catch (e) {
    yield put(officesActions.officeGetIdentity.failure(e));
  }
}

function* provideJudgementAndAssetsWatcher() {
  try {
    yield takeLatest(officesActions.provideJudgementAndAssets.call, provideJudgementAndAssetsWorker);
  } catch (e) {
    yield put(officesActions.provideJudgementAndAssets.failure(e));
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
    yield takeLatest(officesActions.registerCompany.call, registerCompanyWorker);
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

function* getPalletIdsWatcher() {
  try {
    yield takeLatest(officesActions.getPalletIds.call, getPalletIdsWorker);
  } catch (e) {
    yield put(officesActions.getPalletIds.failure(e));
  }
}

function* unregisterCompanyWatcher() {
  yield* blockchainWatcher(officesActions.unregisterCompany, unregisterCompanyWorker);
}

function* setRegisteredCompanyDataWatcher() {
  yield* blockchainWatcher(officesActions.setRegisteredCompanyData, setRegisteredCompanyDataWorker);
}

export {
  getIdentityWatcher,
  provideJudgementAndAssetsWatcher,
  getCompanyRequestWatcher,
  getCompanyRegistrationWatcher,
  registerCompanyWatcher,
  getBalancesWatcher,
  getPalletIdsWatcher,
  unregisterCompanyWatcher,
  setRegisteredCompanyDataWatcher,
};
