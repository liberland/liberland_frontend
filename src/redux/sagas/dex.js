import {
  put, call, select,
} from 'redux-saga/effects';
import { dexActions } from '../actions';
import { blockchainSelectors } from '../selectors';
import {
  getDexPoolsExtendData,
  addLiquidity,
  swapExactTokensForTokens,
  swapTokensForExactTokens,
  getDexReserves,
} from '../../api/nodeRpcCall';
import { blockchainWatcher } from './base';
import { convertToEnumDex } from '../../utils/dexFormater';

function* getPoolsWorker() {
  const userWalletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const allContracts = yield call(getDexPoolsExtendData, userWalletAddress);
  yield put(dexActions.getPools.success(allContracts));
}

export function* getPoolsWatcher() {
  yield* blockchainWatcher(dexActions.getPools, getPoolsWorker);
}

function* addLiquidityWorker(action) {
  const {
    amount1Desired, amount1Min, amount2Desired, amount2Min, asset1, asset2, walletAddress, mintTo,
  } = action.payload;
  const { enum1, enum2 } = convertToEnumDex(asset1, asset2);
  yield call(
    addLiquidity,
    enum1,
    enum2,
    amount1Desired,
    amount2Desired,
    amount1Min,
    amount2Min,
    mintTo,
    walletAddress,
  );
  yield put(dexActions.addLiquidity.success());
  yield put(dexActions.getPools.call());
}

export function* addLiquidityWatcher() {
  yield* blockchainWatcher(dexActions.addLiquidity, addLiquidityWorker);
}

function* swapExactTokensForTokensWorker(action) {
  const {
    path, amount, amountMin, sendTo,
  } = action.payload;
  const userWalletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const { enum1, enum2 } = convertToEnumDex(path.asset1, path.asset2);
  yield call(swapExactTokensForTokens, [enum1, enum2], amount, amountMin, sendTo, userWalletAddress);
  yield put(dexActions.swapExactTokensForTokens.success());
  yield put(dexActions.getPools.call());
}

export function* swapExactTokensForTokensWatcher() {
  yield* blockchainWatcher(dexActions.swapExactTokensForTokens, swapExactTokensForTokensWorker);
}

function* swapTokensForExactTokensWorker(action) {
  const {
    path, amount, amountMin, sendTo,
  } = action.payload;
  const userWalletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
  const { enum1, enum2 } = convertToEnumDex(path.asset1, path.asset2);
  yield call(swapTokensForExactTokens, [enum1, enum2], amount, amountMin, sendTo, userWalletAddress);
  yield put(dexActions.swapTokensForExactTokens.success());
  yield put(dexActions.getPools.call());
}

export function* swapTokensForExactTokensWatcher() {
  yield* blockchainWatcher(dexActions.swapTokensForExactTokens, swapTokensForExactTokensWorker);
}

function* getDexReservesWorker(action) {
  const { asset1, asset2 } = action.payload;
  const { enum1, enum2 } = convertToEnumDex(asset1, asset2);
  const dexReserves = yield call(getDexReserves, enum1, enum2);
  yield put(dexActions.getDexReserves.success({ asset1Number: asset1, asset2Number: asset2, ...dexReserves }));
}

export function* getDexReservesWatcher() {
  yield* blockchainWatcher(dexActions.getDexReserves, getDexReservesWorker);
}
