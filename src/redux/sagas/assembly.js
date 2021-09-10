import {
  put, takeLatest, call, select, cps,
} from 'redux-saga/effects';
import { web3Accounts } from '@polkadot/extension-dapp';

import { assemblyActions } from '../actions';

import { userSelectors } from '../selectors';

import api from '../../api';
import { sendLawProposal } from '../../api/nodeRpcCall';

// WORKERS
function* addMyDraftWorker(action) {
  try {
    const { data } = action.payload;
    const [accounts] = yield web3Accounts();
    const createdAt = Date.now();
    const userId = yield select(userSelectors.selectUserId);
    data.fileName = accounts.address + createdAt;
    data.createdDate = createdAt;
    data.userId = userId;

    yield call(api.post, 'assembly/add_new_draft', data);
    yield put(assemblyActions.addMyDraft.success());
    yield put(assemblyActions.getMyProposals.call());
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('e', e);
    yield put(assemblyActions.addMyDraft.failure(e));
  }
}

function* submitProposalWorker(action) {
  try {
    const { data } = yield api.get(`/assembly/calc_hash/${action.payload.id}`);
    // eslint-disable-next-line no-console
    console.log('hash', data);

    yield cps(sendLawProposal, data);
    yield put(assemblyActions.submitProposal.success(data));
  } catch (e) {
    yield put(assemblyActions.submitProposal.failure(e));
  }
}

function* getMyProposalsWorker() {
  try {
    const userId = yield select(userSelectors.selectUserId);
    const { data } = yield api.post('/assembly/get_my_proposals', { userId });
    yield put(assemblyActions.getMyProposals.success(data));
  } catch (e) {
    yield put(assemblyActions.getMyProposals.failure(e));
  }
}

function* getByHashesWorker() {
  try {
    // TODO add fetching hashes from blockchain
    const hashes = ['6333a3849db1edbccf7cc872840355bb7d18c339b275651e21a5a85cbc4bdc81', '293949cb8465220bb1f2f6ca8647597975c9de62e8ccdb4b1fa5f38f044ab7ad'];
    const { data } = yield api.post('/assembly/proposals_hashes', { hashes });
    // eslint-disable-next-line no-console
    console.log(data);
    yield put(assemblyActions.getByHashes.success(data));
  } catch (e) {
    yield put(assemblyActions.getByHashes.failure(e));
  }
}

function* deleteProposalWorker(action) {
  try {
    const { id } = action.payload;
    const response = yield api.delete(`/assembly/delete_draft/${id}`);
    yield put(assemblyActions.deleteProposal.success(response.data));
    yield put(assemblyActions.getMyProposals.call());
  } catch (e) {
    yield put(assemblyActions.deleteProposal.failure(e));
  }
}

function* editDraftWorker(action) {
  try {
    const { data } = action.payload;
    const [accounts] = yield web3Accounts();
    const createdAt = Date.now();
    const userId = yield select(userSelectors.selectUserId);
    data.fileName = accounts.address + createdAt;
    // data.createdDate = createdAt;
    data.userId = userId;
    yield call(api.patch, `assembly/edit_draft/${data.id}`, data);
    yield put(assemblyActions.addMyDraft.success());
    yield put(assemblyActions.getMyProposals.call());
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('e', e);
    yield put(assemblyActions.addMyDraft.failure(e));
  }
}

// WATCHERS

function* addMyDraftWatcher() {
  try {
    yield takeLatest(assemblyActions.addMyDraft.call, addMyDraftWorker);
  } catch (e) {
    yield put(assemblyActions.addMyDraft.failure(e));
  }
}

function* submitProposalWatcher() {
  try {
    yield takeLatest(assemblyActions.submitProposal.call, submitProposalWorker);
  } catch (e) {
    yield put(assemblyActions.submitProposal.failure(e));
  }
}

function* getByHashesWatcher() {
  try {
    yield takeLatest(assemblyActions.getByHashes.call, getByHashesWorker);
  } catch (e) {
    yield put(assemblyActions.getByHashes.failure(e));
  }
}

function* editDraftWatcher() {
  try {
    yield takeLatest(assemblyActions.editDraft.call, editDraftWorker);
  } catch (e) {
    yield put(assemblyActions.addMyDraft.failure(e));
  }
}

function* getMyProposalsWatcher() {
  try {
    yield takeLatest(assemblyActions.getMyProposals.call, getMyProposalsWorker);
  } catch (e) {
    yield put(assemblyActions.getMyProposals.failure(e));
  }
}

function* deleteProposalWatcher() {
  try {
    yield takeLatest(assemblyActions.deleteProposal.call, deleteProposalWorker);
  } catch (e) {
    yield put(assemblyActions.deleteProposal.failure(e));
  }
}

export {
  addMyDraftWatcher,
  getMyProposalsWatcher,
  deleteProposalWatcher,
  editDraftWatcher,
  submitProposalWatcher,
  getByHashesWatcher,
};
