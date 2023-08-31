import { createActions } from 'redux-actions';

export const {
  applyForCongress,
  getCongressCandidates,
  getMotions,
  voteAtMotions,
} = createActions({
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
  GET_MOTIONS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  VOTE_AT_MOTIONS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
