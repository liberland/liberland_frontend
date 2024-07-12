import {
  put, takeLatest, call, select,
} from 'redux-saga/effects';

import { BN_ZERO } from '@polkadot/util';
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

import { blockchainActions, officesActions } from '../actions';
import { blockchainWatcher } from './base';
import { blockchainSelectors } from '../selectors';
import router from '../../router';
import * as backend from '../../api/backend';
import { parseDollars, parseMerits } from '../../utils/walletHelpers';
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
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(officesActions.officeGetIdentity.failure(e));
  }
}

function* provideJudgementAndAssetsWorker(action) {
  if ((parseMerits(action.payload.merits)?.gt(BN_ZERO) || parseDollars(action.payload.dollars)?.gt(BN_ZERO))
    && !action.payload.id) {
    throw new Error('Tried to transfer LLD or LLM but we have no user id!');
  }
  yield call(provideJudgementAndAssets, action.payload);
  yield put(officesActions.provideJudgementAndAssets.success());
  yield put(officesActions.officeGetIdentity.call(action.payload.address));

  if (parseMerits(action.payload.merits)?.gt(BN_ZERO)) {
    try {
      yield call(backend.addMeritTransaction, action.payload.id, action.payload.merits * -1);
    } catch (e) {
      throw new Error(e.response.data.error.message);
    }
  }

  if (parseDollars(action.payload.dollars)?.gt(BN_ZERO)) {
    try {
      yield call(backend.addDollarsTransaction, action.payload.id, action.payload.dollars * -1);
    } catch (e) {
      throw new Error(e.response.data.error.message);
    }
  }
}

function* getCompanyRequestWorker(action) {
  try {
    const request = yield call(getCompanyRequest, action.payload);
    yield put(officesActions.getCompanyRequest.success(request));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(officesActions.getCompanyRequest.failure(e));
  }
}

function* getCompanyRegistrationWorker(action) {
  try {
    const registration = yield call(getCompanyRegistration, action.payload);
    yield put(officesActions.getCompanyRegistration.success(registration));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(officesActions.getCompanyRegistration.failure(e));
  }
}

function* registerCompanyWorker(action) {
  yield call(registerCompany, action.payload);
  yield put(officesActions.registerCompany.success());
  yield put(officesActions.getCompanyRequest.call(action.payload.entity_id));
  yield put(officesActions.getCompanyRegistration.call(action.payload.entity_id));
}

function* getBalancesWorker(action) {
  try {
    const lldBalances = yield call(getLldBalances, action.payload);
    const llmBalances = yield call(getLlmBalances, action.payload);
    yield put(officesActions.getBalances.success({ LLD: lldBalances, LLM: llmBalances }));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(officesActions.getBalances.failure(e));
  }
}

function* getPalletIdsWorker(action) {
  try {
    const pallets = yield call(getPalletIds, action.payload);
    yield put(officesActions.getPalletIds.success(pallets));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    yield put(officesActions.getPalletIds.failure(e));
  }
}

function* unregisterCompanyWorker(action) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(
    unregisterCompany,
    action.payload.entityId,
    action.payload.soft,
    walletAddress,
  );
  yield put(officesActions.getCompanyRequest.call(action.payload.entityId));
  yield put(officesActions.unregisterCompany.success());
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

function* getPendingAdditionalMeritsWorker() {
  const pendingAdditionalMertis = yield call(backend.fetchPendingAdditionalMerits);
  yield put(officesActions.getPendingAdditionalMerits.success(pendingAdditionalMertis));
}
// WATCHERS

function* getPendingAdditionalMeritsWatcher() {
  yield* blockchainWatcher(officesActions.getPendingAdditionalMerits, getPendingAdditionalMeritsWorker);
}

function* getIdentityWatcher() {
  try {
    yield takeLatest(officesActions.officeGetIdentity.call, getIdentityWorker);
  } catch (e) {
    yield put(officesActions.officeGetIdentity.failure(e));
  }
}

function* provideJudgementAndAssetsWatcher() {
  yield* blockchainWatcher(officesActions.provideJudgementAndAssets, provideJudgementAndAssetsWorker);
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
  yield* blockchainWatcher(officesActions.registerCompany, registerCompanyWorker);
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
  getPendingAdditionalMeritsWatcher,
};
