import { createActions } from 'redux-actions';

export const { applyForCongress, getCongressCandidates } = createActions({
  APPLY_FOR_CONGRESS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_CONGRESS_CANDIDATES: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
