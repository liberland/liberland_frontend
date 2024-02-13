import { put, call, select } from 'redux-saga/effects';

import { onBoardingActions } from '../actions';
import { blockchainSelectors, walletSelectors } from '../selectors';
import { getBalanceByAddress } from '../../api/nodeRpcCall';
import { getComplimentaryLLD } from '../../api/middleware';
import { formatDollars } from '../../utils/walletHelpers';
import { maybeGetApprovedEresidency } from '../../api/backend';
import { blockchainWatcher } from './base';

// WORKERS

function* claimComplimentaryLLDWorker() {
  let errorData = {
    details: 'Error in claiming, send screenshot to devs please',
  };
  try {
    const walletAddress = yield select(
      blockchainSelectors.userWalletAddressSelector,
    );
    const getComplimentaryLLDResponse = yield call(
      getComplimentaryLLD,
      walletAddress,
    );
    if (getComplimentaryLLDResponse.status === 200) {
      // FIXME eventually we need a notification modal, not just error modal
      errorData = {
        details: 'Complimentary LLDs claimed. Please refresh the page',
      };
      yield call(getBalanceByAddress, walletAddress);
      yield put(onBoardingActions.getEligibleForComplimentaryLld.call());
      throw new Error(errorData.details);
    } else {
      errorData = {
        details:
          typeof getComplimentaryLLDResponse?.data === 'string'
            ? getComplimentaryLLDResponse?.data
            : 'Technical error without description, please let the devs know',
      };
      throw new Error(errorData.details);
    }
  } catch (e) {
    throw new Error(errorData.details);
  }
}

function* getIsEligibleForComplimentaryLLDWorker() {
  try {
    const liquidDollars = yield select(
      walletSelectors.selectorLiquidDollarsBalance,
    );
    // Only eligible if no existing dollars
    let isEligibleForComplimentaryLLD = false;
    let ineligibleForComplimentaryLLDReason = null;
    let isSkipOnBoarding = true;

    const dolars = formatDollars(liquidDollars);
    if (dolars === 0 || dolars === '0') {
      // Only eligible if no existing dollars
      const maybeApprovedEresidency = yield call(maybeGetApprovedEresidency);
      if (maybeApprovedEresidency.isError) {
        const is401or404Error = maybeApprovedEresidency.errorResponse.status === 401
          || maybeApprovedEresidency.errorResponse.status === 404;
        ineligibleForComplimentaryLLDReason = is401or404Error
          ? 'Ineligible for gratis LLD '
          : 'Error checking gratis LLD eligibility ';
      } else {
        // only eligible if not already claimed
        // eslint-disable-next-line no-lonely-if
        if (!maybeApprovedEresidency.claimedOnboardingLld) {
          isEligibleForComplimentaryLLD = true;
          isSkipOnBoarding = false;
        } else {
          ineligibleForComplimentaryLLDReason = 'Already claimed gratis LLD';
        }
      }
    } else {
      ineligibleForComplimentaryLLDReason = 'You have LLDs already';
    }
    yield put(
      onBoardingActions.getEligibleForComplimentaryLld.success({
        isEligibleForComplimentaryLLD,
        ineligibleForComplimentaryLLDReason,
        isSkipOnBoarding,
      }),
    );
  } catch (e) {
    const errorData = {
      details:
        'Error checking complimentary LLD eligibility, send screenshot to devs please',
    };
    throw new Error(errorData.details);
  }
}

// WATCHERS

function* claimComplimentaryLLDWatcher() {
  yield blockchainWatcher(
    onBoardingActions.claimComplimentaryLld,
    claimComplimentaryLLDWorker,
  );
}

function* getIsEligibleForComplimentaryLLDWatcher() {
  yield blockchainWatcher(
    onBoardingActions.getEligibleForComplimentaryLld,
    getIsEligibleForComplimentaryLLDWorker,
  );
}

export {
  claimComplimentaryLLDWatcher,
  getIsEligibleForComplimentaryLLDWatcher,
};
