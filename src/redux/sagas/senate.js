import {
  put, call,
  select,
} from 'redux-saga/effects';

import {
  closeSenateMotion,
  congressSenateSendAssets,
  congressSenateSendLld,
  congressSenateSendLlm,
  congressSenateSendLlmToPolitipool,
  getAdditionalAssets,
  getBalanceByAddress,
  getIdentitiesNames,
  getScheduledCalls,
  getSenateMembers,
  getSenateMotions,
  senateProposeCancel,
  senateVoteAtMotions,
} from '../../api/nodeRpcCall';

import { senateActions } from '../actions';
import { blockchainWatcher } from './base';
import { palletIdToAddress } from '../../utils/pallet';
import { blockchainSelectors, officesSelectors, senateSelectors } from '../selectors';

const isCongress = false;

function* getMotionsWorker() {
  const motions = yield call(getSenateMotions);
  yield put(senateActions.senateGetMotions.success(motions));
}

export function* getSenateMotionsWatcher() {
  yield* blockchainWatcher(
    senateActions.senateGetMotions,
    getMotionsWorker,
  );
}

function* getMembersWorker() {
  const members = yield call(getSenateMembers);
  const membersUnique = members.map((item) => item.toString());
  const identities = yield call(getIdentitiesNames, membersUnique);
  const membersWithIdentities = membersUnique.map((member) => ({
    member,
    identity: identities[member] || null,
  }));
  yield put(senateActions.senateGetMembers.success(membersWithIdentities));
}

export function* getSenateMembersWatcher() {
  yield* blockchainWatcher(
    senateActions.senateGetMembers,
    getMembersWorker,
  );
}

function* getWalletWorker() {
  const codeName = yield select(senateSelectors.codeName);
  const pallets = yield select(officesSelectors.selectorPallets);

  if (!pallets) {
    yield put(senateActions.senateGetWallet.failure());
    return;
  }
  const { palletId } = pallets.find((e) => e.palletName === codeName);
  const walletAddress = palletIdToAddress(palletId);
  const balances = yield call(getBalanceByAddress, walletAddress);
  yield put(senateActions.senateGetWallet.success({ balances, walletAddress }));
}

export function* getWalletWatcher() {
  yield* blockchainWatcher(senateActions.senateGetWallet, getWalletWorker);
}

function* getAdditionalAssetsWorker() {
  const senateWalletAddress = yield select(senateSelectors.walletAddress);
  if (!senateWalletAddress) {
    yield put(senateActions.senateGetAdditionalAssets.failure());
    return;
  }

  const additionalAssets = yield call(
    getAdditionalAssets,
    senateWalletAddress,
  );
  yield put(senateActions.senateGetAdditionalAssets.success(additionalAssets));
}

export function* getAdditionalAssetsWatcher() {
  yield* blockchainWatcher(
    senateActions.senateGetAdditionalAssets,
    getAdditionalAssetsWorker,
  );
}

function* senateSendLlmWorker({
  payload: {
    transferToAddress, transferAmount, remarkInfo,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(congressSenateSendLlm, {
    walletAddress,
    transferToAddress,
    transferAmount,
    remarkInfo,
    isCongress,
  });
  yield put(senateActions.senateSendLlm.success());
}

export function* senateSendLlmWatcher() {
  yield* blockchainWatcher(
    senateActions.senateSendLlm,
    senateSendLlmWorker,
  );
}

function* senateSendLldWorker({
  payload: {
    transferToAddress, transferAmount, remarkInfo, executionBlock,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(congressSenateSendLld, {
    walletAddress,
    transferToAddress,
    transferAmount,
    remarkInfo,
    executionBlock,
    isCongress,
  });
  yield put(senateActions.senateSendLld.success());
}

export function* senateSendLldWatcher() {
  yield* blockchainWatcher(
    senateActions.senateSendLld,
    senateSendLldWorker,
  );
}

function* senateSendAssetsTransfer({
  payload: {
    transferToAddress, transferAmount, assetData, remarkInfo, executionBlock,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(congressSenateSendAssets, {
    walletAddress,
    transferToAddress,
    transferAmount,
    assetData,
    remarkInfo,
    executionBlock,
    isCongress,
  });
  yield put(senateActions.senateSendAssets.success());
}

export function* senateSendAssetsTransferWatcher() {
  yield* blockchainWatcher(
    senateActions.senateSendAssets,
    senateSendAssetsTransfer,
  );
}

function* senateSendLlmToPolitipoolWorker({
  payload: {
    transferToAddress, transferAmount, remarkInfo, executionBlock,
  },
}) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(congressSenateSendLlmToPolitipool, {
    walletAddress,
    transferToAddress,
    transferAmount,
    remarkInfo,
    executionBlock,
    isCongress,
  });
  yield put(senateActions.senateSendLlmToPolitipool.success());
}

export function* senateSendLlmToPolitipoolWatcher() {
  yield* blockchainWatcher(
    senateActions.senateSendLlmToPolitipool,
    senateSendLlmToPolitipoolWorker,
  );
}

function* voteAtMotionsWorker(action) {
  const { proposal, index, vote } = action.payload;
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(senateVoteAtMotions, walletAddress, proposal, index, vote);
  yield put(senateActions.senateGetMotions.call());
  yield put(senateActions.senateVoteAtMotions.success());
}

export function* voteAtMotionsWatcher() {
  yield* blockchainWatcher(senateActions.senateVoteAtMotions, voteAtMotionsWorker);
}

function* closeMotionWorker({ payload: { proposal, index } }) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(closeSenateMotion, proposal, index, walletAddress);
  yield put(senateActions.senateCloseMotion.success());
  yield put(senateActions.senateGetMotions.call());
}

export function* closeMotionWatcher() {
  yield* blockchainWatcher(senateActions.senateCloseMotion, closeMotionWorker);
}

function* proposeCloseMotionWorker({ payload: { executionBlock, idx } }) {
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(senateProposeCancel, walletAddress, idx, executionBlock);
  yield put(senateActions.senateProposeCloseMotion.success());
  yield put(senateActions.senateGetMotions.call());
}

export function* proposeCloseMotionWatcher() {
  yield* blockchainWatcher(senateActions.senateProposeCloseMotion, proposeCloseMotionWorker);
}

function* getScheduledCongressSpendingWorker() {
  const scheduledCalls = yield call(getScheduledCalls);
  yield put(senateActions.senateGetCongressSpending.success(scheduledCalls));
}

export function* getScheduledCongressSpendingWatcher() {
  yield* blockchainWatcher(senateActions.senateGetCongressSpending, getScheduledCongressSpendingWorker);
}
