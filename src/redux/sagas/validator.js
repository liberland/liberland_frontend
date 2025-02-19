import {
  put, takeLatest, call, select,
} from 'redux-saga/effects';
import { BN_ZERO } from '@polkadot/util';
import {
  batchPayoutStakers, getIdentities, bondAndValidate, getNextSessionValidators, getNominators,
  getSessionValidators, getStakersRewards, getStakingLedger, getStakingValidators,
  getAppliedSlashes, getUnappliedSlashes,
  setSessionKeys,
  getStakingPayee, setStakingPayee,
  stakingValidate, stakingChill, stakingBond, stakingBondExtra,
  getStakingBondingDuration,
  stakingUnbond,
  stakingWithdrawUnbonded,
  getStakingData,
  getValidator,
  updateValidate,
} from '../../api/nodeRpcCall';
import { blockchainWatcher } from './base';
import { validatorActions, walletActions } from '../actions';
import { blockchainSelectors } from '../selectors';

// WORKERS

function* updateCommissionWorker({ payload: { commission, blocked } }) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(updateValidate, commission, blocked, walletAddress);
  yield put(validatorActions.updateCommission.success());
  yield put(validatorActions.getInfo.call());
}

function* payoutWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const rewardsPerAccount = yield call(getStakersRewards, [walletAddress]);
  const rewards = rewardsPerAccount
    .flatten()
    .map(({ era, validators }) => Object.keys(validators).map((validator) => ({ era, validator })))
    .flatten();

  if (rewards.length === 0) {
    const e = new Error('No unpaid staking rewards pending');
    e.details = e.message;
    throw e;
  }

  const chunkSize = 5;
  for (let i = 0; i < rewards.length; i += chunkSize) {
    yield call(batchPayoutStakers, rewards.slice(i, i + chunkSize), walletAddress);
  }
  yield put(validatorActions.payout.success());
  yield put(validatorActions.getPendingRewards.call());
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
  yield put(walletActions.getWallet.call());
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
  const validatorData = yield call(getValidator, walletAddress);

  if (ledgerRaw.isNone) {
    yield put(validatorActions.getInfo.success({
      stash: null,
      isSessionValidator: null,
      isNextSessionValidator: null,
      isStakingValidator: null,
      isNominator: null,
      unlocking: null,
    }));
  } else {
    const ledger = ledgerRaw.unwrap();
    const stash = ledger.stash.toString();
    yield put(validatorActions.getInfo.success({
      stash,
      isSessionValidator: sessionValidators.includes(stash),
      isNextSessionValidator: nextSessionValidators.includes(stash),
      isStakingValidator: stakingValidators.includes(stash),
      isNominator: nominators.includes(stash),
      unlocking: ledger.unlocking,
      validator: validatorData.toJSON(),
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
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(setSessionKeys, keys, walletAddress);
  yield put(validatorActions.setSessionKeys.success());
}

function* setPayeeWorker(action) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(setStakingPayee, action.payload.payee, walletAddress);
  yield put(validatorActions.setPayee.success());
  yield put(validatorActions.getPayee.call());
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

function* validateWorker({ payload: { commission, blocked, keys } }) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(stakingValidate, commission, blocked, keys, walletAddress);
  yield put(validatorActions.validate.success());
  yield put(validatorActions.getInfo.call());
}

function* chillWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(stakingChill, walletAddress);
  yield put(validatorActions.chill.success());
  yield put(validatorActions.getInfo.call());
}

function* createValidatorWorker({
  payload: {
    bondValue, commission, payee, blocked, keys,
  },
}) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(bondAndValidate, bondValue, payee, commission, blocked, keys, walletAddress);
  yield put(validatorActions.createValidator.success());
  yield put(validatorActions.getInfo.call());
  yield put(walletActions.getWallet.call());
}

function* stakeLldWorker(action) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const ledgerRaw = yield call(getStakingLedger, walletAddress);
  yield call(
    ledgerRaw.isSome
      ? stakingBondExtra
      : stakingBond,
    action.payload.bondValue,
    walletAddress,
  );
  yield put(validatorActions.stakeLld.success());
  yield put(walletActions.getWallet.call());
  yield put(validatorActions.getInfo.call());
}

function* getBondingDurationWorker() {
  const bondingDuration = yield call(getStakingBondingDuration);
  yield put(validatorActions.getBondingDuration.success({ bondingDuration }));
}

function* unbondWorker(action) {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(stakingUnbond, action.payload.unbondValue, walletAddress);
  yield put(validatorActions.unbond.success());
  yield put(walletActions.getWallet.call());
  yield put(validatorActions.getInfo.call());
}

function* withdrawUnbondedWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  yield call(stakingWithdrawUnbonded, walletAddress);
  yield put(validatorActions.withdrawUnbonded.success());
  yield put(walletActions.getWallet.call());
  yield put(validatorActions.getInfo.call());
}

function* getStakingDataWorker() {
  const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const { stakingInfo, sessionProgress } = yield call(getStakingData, walletAddress);
  yield put(validatorActions.getStakingData.success({ stakingInfo, sessionProgress }));
}

// WATCHERS

function* payoutWatcher() {
  yield* blockchainWatcher(validatorActions.payout, payoutWorker);
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
  yield* blockchainWatcher(validatorActions.setSessionKeys, setSessionKeysWorker);
}

function* updateCommissionWatcher() {
  yield* blockchainWatcher(validatorActions.updateCommission, updateCommissionWorker);
}

function* setPayeeWatcher() {
  yield* blockchainWatcher(validatorActions.setPayee, setPayeeWorker);
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
  yield* blockchainWatcher(validatorActions.validate, validateWorker);
}

function* chillWatcher() {
  yield* blockchainWatcher(validatorActions.chill, chillWorker);
}

function* createValidatorWatcher() {
  yield* blockchainWatcher(validatorActions.createValidator, createValidatorWorker);
}

function* stakeLldWatcher() {
  yield* blockchainWatcher(validatorActions.stakeLld, stakeLldWorker);
}

function* getBondingDurationWatcher() {
  try {
    yield takeLatest(validatorActions.getBondingDuration.call, getBondingDurationWorker);
  } catch (e) {
    yield put(validatorActions.getBondingDuration.failure(e));
  }
}

function* unbondWatcher() {
  yield* blockchainWatcher(validatorActions.unbond, unbondWorker);
}

function* withdrawUnbondedWatcher() {
  yield* blockchainWatcher(validatorActions.withdrawUnbonded, withdrawUnbondedWorker);
}

function* getStakingDataWatcher() {
  yield* blockchainWatcher(validatorActions.getStakingData, getStakingDataWorker);
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
  stakeLldWatcher,
  getBondingDurationWatcher,
  unbondWatcher,
  withdrawUnbondedWatcher,
  getStakingDataWatcher,
  updateCommissionWatcher,
};
