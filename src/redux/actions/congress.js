import { createActions } from 'redux-actions';

export const {
  applyForCongress,
  getCongressCandidates,
  getMotions,
  voteAtMotions,
  congressSendLlm,
  congressSendLlmToPolitipool,
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
  CONGRESS_SEND_LLM: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_SEND_LLM_TO_POLITIPOOL: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
