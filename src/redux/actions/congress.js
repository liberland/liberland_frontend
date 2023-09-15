import { createActions } from 'redux-actions';

export const {
  applyForCongress,
  congressProposeLegislation,
  congressRepealLegislation,
  congressSendLlm,
  congressSendLlmToPolitipool,
  getCandidates,
  getMembers,
  getMotions,
  getRunnersUp,
  renounceCandidacy,
  voteAtMotions,
} = createActions({
  APPLY_FOR_CONGRESS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_PROPOSE_LEGISLATION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_REPEAL_LEGISLATION: {
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
  GET_CANDIDATES: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_MEMBERS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_MOTIONS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_RUNNERS_UP: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  RENOUNCE_CANDIDACY: {
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
