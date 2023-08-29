import {
  put, takeLatest, call, cps, select,
} from 'redux-saga/effects';

import { BN_ZERO } from '@polkadot/util';
import {
  batchPayoutStakers, getIdentities, bondAndValidate, getNextSessionValidators, getNominators,
  getSessionValidators, getStakersRewards, getStakingLedger, getStakingValidators,
  getAppliedSlashes, getUnappliedSlashes,
  setSessionKeys,
  getStakingPayee, setStakingPayee,
  stakingValidate, stakingChill,
} from '../../api/nodeRpcCall';

import { blockchainActions, validatorActions, walletActions } from '../actions';
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
    yield put(validatorActions.getPendingRewards.call());
  } catch (errorData) {
    // eslint-disable-next-line no-console
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
    .map(({ validators }) => Object.values(validators))
    .flatten()
    .reduce((total, { value }) => total.add(value), BN_ZERO);
  yield put(validatorActions.getPendingRewards.success({ pendingRewards }));
}

function* getStakerRewardsWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const allStakerRewards = yield call(getStakersRewards, [walletAddress]);
  const stakerRewards = allStakerRewards?.[0];
  yield put(validatorActions.getStakerRewards.success({ stakerRewards }));
}

function* getInfoWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const sessionValidators = yield call(getSessionValidators);
  const nextSessionValidators = yield call(getNextSessionValidators);
  const stakingValidators = yield call(getStakingValidators);
  const nominatorsRaw = yield call(getNominators);
  const nominators = nominatorsRaw.map(([{ args: [nominator] }]) => nominator.toString());
  const ledgerRaw = yield call(getStakingLedger, walletAddress);

  if (ledgerRaw.isNone) {
    yield put(validatorActions.getInfo.success({
      stash: null,
      isSessionValidator: null,
      isNextSessionValidator: null,
      isStakingValidator: null,
      isNominator: null,
    }));
  } else {
    const stash = ledgerRaw.unwrap().stash.toString();
    yield put(validatorActions.getInfo.success({
      stash,
      isSessionValidator: sessionValidators.includes(stash),
      isNextSessionValidator: nextSessionValidators.includes(stash),
      isStakingValidator: stakingValidators.includes(stash),
      isNominator: nominators.includes(stash),
    }));
  }
}

function* getSlashesWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const unappliedSlashesRaw = yield call(getUnappliedSlashes);
  const unappliedSlashes = unappliedSlashesRaw
    .map(([[era], slashes]) => slashes
      .map(({ validator, own, others }) => ({
        era,
        validatorSlash: validator.eq(walletAddress) ? own : null,
        nominatorSlash: others.find(([account, _]) => account.eq(walletAddress))?.[1] ?? null,
      }))
      .filter(({ validatorSlash, nominatorSlash }) => (validatorSlash || nominatorSlash)))
    .flatten();

  const appliedSlashesRaw = yield call(getAppliedSlashes);
  const appliedSlashesMap = {};
  appliedSlashesRaw.validator.forEach(([{ args: [era, account] }, slash]) => {
    if (!account.eq(walletAddress) || slash.isNone) return;
    const amount = slash.unwrap()[1];
    if (amount.lte(BN_ZERO)) return;
    if (!appliedSlashesMap[era]) appliedSlashesMap[era] = {};
    appliedSlashesMap[era].validatorSlash = amount;
  });
  appliedSlashesRaw.nominator.forEach(([[era, account], slash]) => {
    if (!account.eq(walletAddress) || slash.isNone) return;
    const amount = slash.unwrap();
    if (amount.lte(BN_ZERO)) return;
    if (!appliedSlashesMap[era]) appliedSlashesMap[era] = {};
    appliedSlashesMap[era].nominatorSlash = amount;
  });

  const appliedSlashes = Object.keys(appliedSlashesMap).map((era) => ({
    era,
    nominatorSlash: appliedSlashesMap[era].nominatorSlash ?? BN_ZERO,
    validatorSlash: appliedSlashesMap[era].validatorSlash ?? BN_ZERO,
  }));

  yield put(validatorActions.getSlashes.success({ unappliedSlashes, appliedSlashes }));
}

function* setSessionKeysWorker({ payload: { keys } }) {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const { errorData } = yield cps(setSessionKeys, keys, walletAddress);
    if (errorData.isError) throw errorData;
    yield put(validatorActions.setSessionKeys.success());
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.log('Error setSessionKeys worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(validatorActions.setSessionKeys.failure(errorData));
  }
}

function* setPayeeWorker(action) {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const { errorData } = yield cps(setStakingPayee, action.payload.payee, walletAddress);
    if (errorData.isError) throw errorData;
    yield put(validatorActions.setPayee.success());
    yield put(validatorActions.getPayee.call());
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.log('Error setPayee worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(validatorActions.setPayee.failure(errorData));
  }
}

function* getPayeeWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const payee = yield call(getStakingPayee, walletAddress);
  yield put(validatorActions.getPayee.success({ payee }));
}

function* getNominatorsWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const nominatorsRaw = yield call(getNominators);
  const nominatorsAddresses = nominatorsRaw
    .filter(([_, nominations]) => nominations.isSome)
    .map(([{ args: [nominator] }, nominations]) => (
      [
        nominator.toString(),
        nominations.unwrap().targets.map((t) => t.toString()),
      ]))
    .filter(([_, nominations]) => nominations.includes(walletAddress))
    .map(([nominator]) => nominator);
  const nominators = yield call(getIdentities, nominatorsAddresses);
  yield put(validatorActions.getNominators.success({ nominators }));
}

function* validateWorker({ payload: { commission, blocked, keys }}) {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const { errorData } = yield cps(stakingValidate, commission, blocked, keys, walletAddress);
    if (errorData.isError) throw errorData;
    yield put(validatorActions.validate.success());
    yield put(validatorActions.getInfo.call());
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.error('Error validate worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(validatorActions.validate.failure(errorData));
  }
}

function* chillWorker() {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const { errorData } = yield cps(stakingChill, walletAddress);
    if (errorData.isError) throw errorData;
    yield put(validatorActions.chill.success());
    yield put(validatorActions.getInfo.call());
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.error('Error validate worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(validatorActions.chill.failure(errorData));
  }
}

function* createValidatorWorker({
  payload: {
    bondValue, commission, payee, blocked, keys,
  },
}) {
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const { errorData } = yield cps(bondAndValidate, bondValue, payee, commission, blocked, keys, walletAddress);
    if (errorData.isError) throw errorData;
    yield put(validatorActions.createValidator.success());
    yield put(validatorActions.getInfo.call());
    yield put(walletActions.getWallet.call());
  } catch (errorData) {
    // eslint-disable-next-line no-console
    console.log('Error createValidator worker', errorData);
    yield put(blockchainActions.setErrorExistsAndUnacknowledgedByUser.success(true));
    yield put(blockchainActions.setError.success(errorData));
    yield put(validatorActions.createValidator.failure(errorData));
  }
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

function* getInfoWatcher() {
  try {
    yield takeLatest(validatorActions.getInfo.call, getInfoWorker);
  } catch (e) {
    yield put(validatorActions.getInfo.failure(e));
  }
}

function* getSlashesWatcher() {
  try {
    yield takeLatest(validatorActions.getSlashes.call, getSlashesWorker);
  } catch (e) {
    yield put(validatorActions.getSlashes.failure(e));
  }
}

function* setSessionKeysWatcher() {
  try {
    yield takeLatest(validatorActions.setSessionKeys.call, setSessionKeysWorker);
  } catch (e) {
    yield put(validatorActions.setSessionKeys.failure(e));
  }
}

function* setPayeeWatcher() {
  try {
    yield takeLatest(validatorActions.setPayee.call, setPayeeWorker);
  } catch (e) {
    yield put(validatorActions.setPayee.failure(e));
  }
}

function* getPayeeWatcher() {
  try {
    yield takeLatest(validatorActions.getPayee.call, getPayeeWorker);
  } catch (e) {
    yield put(validatorActions.getPayee.failure(e));
  }
}

function* getNominatorsWatcher() {
  try {
    yield takeLatest(validatorActions.getNominators.call, getNominatorsWorker);
  } catch (e) {
    yield put(validatorActions.getNominators.failure(e));
  }
}

function* getStakerRewardsWatcher() {
  try {
    yield takeLatest(validatorActions.getStakerRewards.call, getStakerRewardsWorker);
  } catch (e) {
    yield put(validatorActions.getStakerRewards.failure(e));
  }
}

function* validateWatcher() {
  try {
    yield takeLatest(validatorActions.validate.call, validateWorker);
  } catch (e) {
    yield put(validatorActions.validate.failure(e));
  }
}

function* chillWatcher() {
  try {
    yield takeLatest(validatorActions.chill.call, chillWorker);
  } catch (e) {
    yield put(validatorActions.chill.failure(e));
  }
}

function* createValidatorWatcher() {
  try {
    yield takeLatest(validatorActions.createValidator.call, createValidatorWorker);
  } catch (e) {
    yield put(validatorActions.createValidator.failure(e));
  }
}

export {
  payoutWatcher,
  getPendingRewardsWatcher,
  getInfoWatcher,
  getSlashesWatcher,
  setSessionKeysWatcher,
  getPayeeWatcher,
  setPayeeWatcher,
  getNominatorsWatcher,
  getStakerRewardsWatcher,
  validateWatcher,
  chillWatcher,
  createValidatorWatcher,
};
