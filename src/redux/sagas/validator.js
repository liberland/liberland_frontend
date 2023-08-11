import {
  put, takeLatest, call, cps, select,
} from 'redux-saga/effects';

import { BN_ZERO } from '@polkadot/util';
import {
  batchPayoutStakers, getStakersRewards,
} from '../../api/nodeRpcCall';

import { blockchainActions, validatorActions } from '../actions';
import { blockchainSelectors } from '../selectors';

// WORKERS

function* payoutWorker() {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const rewardsPerAccount = yield call(getStakersRewards, [walletAddress]);
    const rewards = rewardsPerAccount
      .flatten()
      .map(({ era, validators }) => Object.keys(validators).map((validator) => ({ era, validator })))
      .flatten();

    if (rewards.length === 0) throw { details: 'No unpaid staking rewards pending' };

    const chunkSize = 10;
    for (let i = 0; i < rewards.length; i += chunkSize) {
      const { errorData } = yield cps(batchPayoutStakers, rewards.slice(i, i + chunkSize), walletAddress);
      if (errorData.isError) throw errorData;
    }
    yield put(validatorActions.payout.success());
  } catch (errorData) {
    console.log('Error payoutStakers worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(validatorActions.payout.failure(errorData));
  }
}

function* getPendingRewardsWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const rewards = yield call(getStakersRewards, [walletAddress]);
  const pendingRewards = rewards
    .flatten()
    .reduce((total, { eraReward }) => total.add(eraReward), BN_ZERO);
  yield put(validatorActions.getPendingRewards.success({ pendingRewards }));
}

// WATCHERS

function* payoutWatcher() {
  try {
    yield takeLatest(validatorActions.payout.call, payoutWorker);
  } catch (e) {
    yield put(validatorActions.payout.failure(e));
  }
}

function* getPendingRewardsWatcher() {
  try {
    yield takeLatest(validatorActions.getPendingRewards.call, getPendingRewardsWorker);
  } catch (e) {
    yield put(validatorActions.getPendingRewards.failure(e));
  }
}

export {
  payoutWatcher,
  getPendingRewardsWatcher,
};
