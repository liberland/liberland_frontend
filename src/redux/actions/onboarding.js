import { createActions } from 'redux-actions';

export const {
  claimComplimentaryLld,
  getEligibleForComplimentaryLld,
} = createActions({
  CLAIM_COMPLIMENTARY_LLD: {
    call: undefined,
    success: undefined,
    failure: undefined,
    clear: undefined,
  },
  GET_ELIGIBLE_FOR_COMPLIMENTARY_LLD: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
