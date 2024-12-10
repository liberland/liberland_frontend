import { createActions } from 'redux-actions';

export const {
  ministryFinanceGetWallet,
  ministryFinanceGetAdditionalAssets,
  ministryFinanceSendLld,
  ministryFinanceSendLlm,
  ministryFinanceSendAssets,
  ministryFinanceSendLlmToPolitipool,
} = createActions({
  MINISTRY_FINANCE_GET_WALLET: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  MINISTRY_FINANCE_GET_ADDITIONAL_ASSETS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  MINISTRY_FINANCE_SEND_LLD: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  MINISTRY_FINANCE_SEND_LLM: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  MINISTRY_FINANCE_SEND_ASSETS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  MINISTRY_FINANCE_SEND_LLM_TO_POLITIPOOL: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
