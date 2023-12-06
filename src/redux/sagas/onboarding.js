import {
  put, takeLatest, call, select,
} from 'redux-saga/effects';

import { blockchainActions, onBoardingActions } from '../actions';
import { blockchainSelectors, walletSelectors } from '../selectors';
import { getBalanceByAddress } from '../../api/nodeRpcCall';
import { getComplimentaryLLD } from '../../api/middleware';
import { formatDollars } from '../../utils/walletHelpers';
import { maybeGetApprovedEresidency } from '../../api/backend';
import { blockchainWatcher } from './base';

// WORKERS

function* claimComplimentaryLLDWorker() {
  let errorData = { details: 'Error in claiming, send screenshot to devs please' };
  try {
    const walletAddress = yield select(blockchainSelectors.userWalletAddressSelector);
    const getComplimentaryLLDResponse = yield call(getComplimentaryLLD, walletAddress);
    if (getComplimentaryLLDResponse.status === 200) {
      // FIXME eventually we need a notification modal, not just error modal
      errorData = { details: 'Complimentary LLDs claimed. Please refresh the page' };
      yield call(getBalanceByAddress, walletAddress);
      throw { errorData };
    } else {
      errorData = {
        details: typeof getComplimentaryLLDResponse?.data === 'string'
          ? getComplimentaryLLDResponse?.data
          : 'Technical error without description, please let the devs know',
      };
      throw { errorData };
    }
  } catch (e) {
    throw { errorData };
  }
}

function* getIsEligibleForComplimentaryLLDWorker() {
  try {
    const liquidDollars = yield select(walletSelectors.selectorLiquidDollarsBalance);
    // Only eligible if no existing dollars
    if (formatDollars(liquidDollars) === 0) {
      // Only eligible if no existing dollars
      const maybeApprovedEresidency = yield call(maybeGetApprovedEresidency);
      if (maybeApprovedEresidency.isError) {
        if (maybeApprovedEresidency.errorResponse.status === 401 || maybeApprovedEresidency.errorResponse.status === 404) {
          yield put(onBoardingActions.getEligibleForComplimentaryLld.success({
            isEligibleForComplimentaryLLD: false,
            ineligibleForComplimentaryLLDReason: 'Ineligible for gratis LLD ',
          }));
        } else {
          yield put(onBoardingActions.getEligibleForComplimentaryLld.success({
            isEligibleForComplimentaryLLD: false,
            ineligibleForComplimentaryLLDReason: 'Error checking gratis LLD eligibility ',
          }));
        }
      } else {
        // only eligible if not already claimed
        if (!maybeApprovedEresidency.claimedOnboardingLld) {
          yield put(onBoardingActions.getEligibleForComplimentaryLld.success({
            isEligibleForComplimentaryLLD: true,
            ineligibleForComplimentaryLLDReason: null,
          }));
        } else {
          yield put(onBoardingActions.getEligibleForComplimentaryLld.success({
            isEligibleForComplimentaryLLD: false,
            ineligibleForComplimentaryLLDReason: 'Already claimed gratis LLD',
          }));
        }
      }
    } else {
      yield put(onBoardingActions.getEligibleForComplimentaryLld.success({
        isEligibleForComplimentaryLLD: false,
        ineligibleForComplimentaryLLDReason: 'You have LLDs already ',
      }));
    }
  } catch (e) {
    const errorData = { details: 'Error checking complimentary LLD eligibility, send screenshot to devs please' };
    throw { errorData };
  }
}

// WATCHERS

function* claimComplimentaryLLDWatcher() {
  yield blockchainWatcher(onBoardingActions.claimComplimentaryLld, claimComplimentaryLLDWorker);
}

function* getIsEligibleForComplimentaryLLDWatcher() {
  yield blockchainWatcher(onBoardingActions.getEligibleForComplimentaryLld, getIsEligibleForComplimentaryLLDWorker);
}

export {
  claimComplimentaryLLDWatcher,
  getIsEligibleForComplimentaryLLDWatcher,
};
