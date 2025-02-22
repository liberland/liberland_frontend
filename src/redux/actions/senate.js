import { createActions } from 'redux-actions';

export const {
  senateSendLld,
  senateSendLlm,
  senateSendAssets,
  senateGetMotions,
  senateSendLlmToPolitipool,
  senateSendTreasuryLld,
  senateGetWallet,
  senateGetAdditionalAssets,
  senateVoteAtMotions,
  senateCloseMotion,
  senateGetCongressSpending,
  senateProposeCongressMotionClose,
  senateProposeCloseMotion,
  senateGetMembers,
} = createActions({
  SENATE_GET_MEMBERS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SENATE_GET_CONGRESS_SPENDING: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SENATE_CLOSE_MOTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SENATE_GET_MOTIONS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SENATE_SEND_LLD: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SENATE_SEND_LLM: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SENATE_SEND_ASSETS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SENATE_SEND_LLM_TO_POLITIPOOL: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SENATE_SEND_TREASURY_LLD: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SENATE_GET_WALLET: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SENATE_GET_ADDITIONAL_ASSETS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SENATE_VOTE_AT_MOTIONS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SENATE_PROPOSE_CONGRESS_MOTION_CLOSE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SENATE_PROPOSE_CLOSE_MOTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
