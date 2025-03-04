import { createActions } from 'redux-actions';

export const {
  applyForCongress,
  approveTreasurySpend,
  closeMotion,
  congressAmendLegislation,
  congressAmendLegislationViaReferendum,
  congressDemocracyBlacklist,
  congressProposeLegislation,
  congressProposeLegislationViaReferendum,
  congressProposeRepealLegislation,
  congressRepealLegislation,
  congressSendLlm,
  congressSendLlmToPolitipool,
  congressSendTreasuryLld,
  getCandidates,
  getMembers,
  getMotions,
  getRunnersUp,
  getTreasuryInfo,
  renounceCandidacy,
  unapproveTreasurySpend,
  voteAtMotions,
  congressGetWallet,
  congressGetAdditionalAssets,
  congressSendLld,
  congressSendAssets,
  getAllBalanceForCongress,
  congressBudgetPropose,
  congressSpending,
} = createActions({
  CONGRESS_BUDGET_PROPOSE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_ALL_BALANCE_FOR_CONGRESS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  APPLY_FOR_CONGRESS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  APPROVE_TREASURY_SPEND: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CLOSE_MOTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_AMEND_LEGISLATION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_AMEND_LEGISLATION_VIA_REFERENDUM: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_DEMOCRACY_BLACKLIST: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_PROPOSE_LEGISLATION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_PROPOSE_LEGISLATION_VIA_REFERENDUM: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_PROPOSE_REPEAL_LEGISLATION: {
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
  CONGRESS_SEND_TREASURY_LLD: {
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
  GET_TREASURY_INFO: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  RENOUNCE_CANDIDACY: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  UNAPPROVE_TREASURY_SPEND: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  VOTE_AT_MOTIONS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_GET_WALLET: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_GET_ADDITIONAL_ASSETS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_SEND_LLD: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_SEND_ASSETS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CONGRESS_SPENDING: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
