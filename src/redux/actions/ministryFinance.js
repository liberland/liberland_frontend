import { createActions } from 'redux-actions';

export const {
  getWallet,
  getAdditionalAssets,
  sendLld,
  sendLlm,
  sendAssets,
  sendLlmToPolitipool,
} = createActions({
  GET_WALLET: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_ADDITIONAL_ASSETS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SEND_LLD: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SEND_LLM: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SEND_ASSETS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SEND_LLM_TO_POLITIPOOL: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
