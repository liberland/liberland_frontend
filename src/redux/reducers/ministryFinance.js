import { handleActions, combineActions } from 'redux-actions';
import { BN_ZERO } from '@polkadot/util';
import { ministryFinanceActions } from '../actions';

const initialState = {
  loading: false,
  codeName: 'ministryOfFinanceOffice',
  additionalAssets: [],
  walletInfo: {
    balances: {
      liberstake: {
        amount: BN_ZERO,
      },
      polkastake: {
        amount: 0,
      },
      liquidMerits: {
        amount: 0,
      },
      totalAmount: {
        amount: BN_ZERO,
      },
      liquidAmount: {
        amount: BN_ZERO,
      },
      meritsTotalAmount: {
        amount: 0,
      },
      electionLock: 0,
    },
    clerksIds: null,
  },
  scheduledCalls: [],
};

const ministryFinanceReducer = handleActions(
  {
    [combineActions(
      ministryFinanceActions.ministryFinanceGetAdditionalAssets.call,
      ministryFinanceActions.ministryFinanceGetWallet.call,
      ministryFinanceActions.ministryFinanceSendLld.call,
      ministryFinanceActions.ministryFinanceSendLlm.call,
      ministryFinanceActions.ministryFinanceSendAssets.call,
      ministryFinanceActions.ministryFinanceSendLlmToPolitipool.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),

    [combineActions(
      ministryFinanceActions.ministryFinanceGetAdditionalAssets.success,
      ministryFinanceActions.ministryFinanceGetAdditionalAssets.failure,
      ministryFinanceActions.ministryFinanceGetWallet.success,
      ministryFinanceActions.ministryFinanceGetWallet.failure,
      ministryFinanceActions.ministryFinanceSendLld.success,
      ministryFinanceActions.ministryFinanceSendLld.failure,
      ministryFinanceActions.ministryFinanceSendLlm.success,
      ministryFinanceActions.ministryFinanceSendLlm.failure,
      ministryFinanceActions.ministryFinanceSendAssets.success,
      ministryFinanceActions.ministryFinanceSendAssets.failure,
      ministryFinanceActions.ministryFinanceSendLlmToPolitipool.success,
      ministryFinanceActions.ministryFinanceSendLlmToPolitipool.failure,
    )]: (state) => ({
      ...state,
      loading: false,
    }),

    [ministryFinanceActions.ministryFinanceGetAdditionalAssets.success]: (state, action) => ({
      ...state,
      additionalAssets: action.payload,
    }),

    [ministryFinanceActions.ministryFinanceGetWallet.success]: (state, action) => ({
      ...state,
      walletInfo: action.payload,
    }),
  },
  initialState,
);

export default ministryFinanceReducer;
