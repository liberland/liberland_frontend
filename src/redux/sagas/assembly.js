import {
  put, takeLatest, call, select, cps,
} from 'redux-saga/effects';
import { web3Accounts } from '@polkadot/extension-dapp';

import { assemblyActions } from '../actions';

import {
  blockchainSelectors,
  userSelectors, votingSelectors,
} from '../selectors';

import api from '../../api';
import {
  sendLawProposal,
  voteByProposalRpc,
  getProposalHashesRpc,
  getCurrentPowerProposalRpc,
  getStatusProposalRpc,
} from '../../api/nodeRpcCall';

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
    data.proposalStatus = 'Draft';

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
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const { data } = yield api.get(`/assembly/calc_hash/${action.payload.id}`);
    // eslint-disable-next-line no-console
    console.log('hash', data.hash);
    const args = [data, walletAddress];
    const resultSendNode = yield cps(sendLawProposal, args);

    if (resultSendNode !== 'done') {
      yield put(assemblyActions.submitProposal.failure(resultSendNode));
      return;
    }
    const requiredAmountLlm = yield select(votingSelectors.selectorLiberStakeAmount);
    const proposalStatus = yield cps(getStatusProposalRpc, data.hash);

    const result = yield api.patch('/assembly/update_status_proposal',
      {
        hash: data.hash,
        status: proposalStatus.state,
        requiredAmountLlm,
        currentLlm: 0,
        votingHourLeft: 72,
        nodeIdProposel: 'NoNeed',
        draftType: proposalStatus.lawType,
      });
    yield put(assemblyActions.submitProposal.success());
    // eslint-disable-next-line no-console
    console.log('/assembly/update_status_proposal', result);
    yield put(assemblyActions.getMyProposals.call());
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
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

function* updateAllProposalsWorker() {
  try {
    // Get all proposal in status !Draft
    const { data: { hashesNotDraft } } = yield api.get('/assembly/get_hashes_proposals_not_draft/');
    // GET from node new statuses by hash
    const hashesAllProposals = yield cps(getProposalHashesRpc, hashesNotDraft);
    // UPDATE in back all proposals and get it
    const {
      data: {
        proposals,
      },
    } = yield api.post('/assembly/update_all_proposals', { hashesAllProposals });
    yield put(assemblyActions.updateAllProposals.success(proposals));
    yield put(assemblyActions.getMyProposals.call());
    // yield put(assemblyActions.getAllSendProposals.call());
  } catch (e) {
    yield put(assemblyActions.updateAllProposals.failure(e));
  }
}

function* voteByProposalWorker(action) {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const { docHash } = action.payload;
    const args = [action.payload, walletAddress];
    const result = yield cps(voteByProposalRpc, args);
    if (result === 'done') {
      const votePower = yield cps(getCurrentPowerProposalRpc, docHash);
      yield api.patch('/assembly/update_power_proposal', { docHash, votePower });
      yield put(assemblyActions.voteByProposal.success());
      yield put(assemblyActions.updateAllProposals.call());
    } else {
      yield put(assemblyActions.voteByProposal.failure());
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    yield put(assemblyActions.voteByProposal.failure(e));
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

function* getProposalsInProgressByTypeWorker(action) {
  try {
    const { data: { proposals } } = yield call(api.get, 'assembly/get_in_progress_proposals/', { params: { draftType: action.payload } });
    switch (action.payload) {
      case 'ConstitutionalChange': yield put(assemblyActions.getConstitutionalChange.success(proposals)); break;
      case 'Legislation': yield put(assemblyActions.getLegislation.success(proposals)); break;
      case 'Decision': yield put(assemblyActions.getDecision.success(proposals)); break;
      default: yield put(assemblyActions.setGotSomeError.failure(`Unknown type of proposal ${action.payload}`));
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('e', e);
    yield put(assemblyActions.setGotSomeError.failure(e));
  }
}

function* getTextPdfWorker(action) {
  try {
    const { data } = yield call(api.get, `/assembly/get_text_pdf/${action.payload}`);
    yield put(assemblyActions.getTextPdf.success(data));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('e', e);
    yield put(assemblyActions.getTextPdf.failure(e));
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

function* updateAllProposalsWatcher() {
  try {
    yield takeLatest(assemblyActions.updateAllProposals.call, updateAllProposalsWorker);
  } catch (e) {
    yield put(assemblyActions.updateAllProposals.failure(e));
  }
}

function* voteByProposalWatcher() {
  try {
    yield takeLatest(assemblyActions.voteByProposal.call, voteByProposalWorker);
  } catch (e) {
    yield put(assemblyActions.voteByProposal.failure(e));
  }
}

function* getConstitutionalChangeWatcher() {
  try {
    yield takeLatest(
      assemblyActions.getConstitutionalChange.call,
      getProposalsInProgressByTypeWorker,
    );
  } catch (e) {
    yield put(assemblyActions.getConstitutionalChange.failure(e));
  }
}

function* getLegislationWatcher() {
  try {
    yield takeLatest(assemblyActions.getLegislation.call, getProposalsInProgressByTypeWorker);
  } catch (e) {
    yield put(assemblyActions.getLegislation.failure(e));
  }
}

function* getDecisionWatcher() {
  try {
    yield takeLatest(assemblyActions.getDecision.call, getProposalsInProgressByTypeWorker);
  } catch (e) {
    yield put(assemblyActions.getDecision.failure(e));
  }
}

function* getTextPdfWatcher() {
  try {
    yield takeLatest(assemblyActions.getTextPdf.call, getTextPdfWorker);
  } catch (e) {
    yield put(assemblyActions.getTextPdf.failure(e));
  }
}

export {
  addMyDraftWatcher,
  getMyProposalsWatcher,
  deleteProposalWatcher,
  editDraftWatcher,
  submitProposalWatcher,
  getByHashesWatcher,
  updateAllProposalsWatcher,
  voteByProposalWatcher,
  getConstitutionalChangeWatcher,
  getLegislationWatcher,
  getDecisionWatcher,
  getTextPdfWatcher,
};
