import {
  put, takeLatest, call, cps, select,
} from 'redux-saga/effects';

import {getDemocracyReferendums, secondProposal} from '../../api/nodeRpcCall';

import api from '../../api';

import { blockchainSelectors } from '../selectors';

import { democracyActions } from '../actions';

//WORKERS

function* getDemocracyWorker() {
  try {
    let walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    //TODO use user wallet address once chain is in good state
    walletAddress = '5G3uZjEpvNAQ6U2eUjnMb66B8g6d8wyB68x6CfkRPNcno8eR';
    const democracy = yield call(getDemocracyReferendums, walletAddress);
    yield put(democracyActions.getDemocracy.success({democracy}))
  } catch (e) {
    yield put(democracyActions.getDemocracy.failure(e));
  }
}

function* secondProposalWorker(action) {
  try {
    let walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    //TODO use user wallet address once chain is in good state
    walletAddress = '5GGgzku3kHSnAjxk7HBNeYzghSLsQQQGGznZA7u3h6wZUseo';
    console.log('action.payload')
    console.log(action.payload)
    yield call(secondProposal, ...[walletAddress, action.payload.proposalIndex])
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Error in secondProposalWorker', e);
    return 'failure';
  }
}

//WATCHERS

function* getDemocracyWatcher() {
  try{
    yield takeLatest(democracyActions.getDemocracy.call, getDemocracyWorker)
  } catch (e){
    yield put(democracyActions.getDemocracy.failure(e))
  }
}

function* secondProposalWatcher() {
  try{
    yield takeLatest(democracyActions.secondProposal.call, secondProposalWorker)
  } catch (e){
    yield put(democracyActions.secondProposal.failure(e))
  }
}

export {
  getDemocracyWatcher,
  secondProposalWatcher
};
