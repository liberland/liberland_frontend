import { handleActions, combineActions } from 'redux-actions';
import { BN_ZERO } from '@polkadot/util';
import { ministryFinanceActions } from '../actions';
import { spendingTableMerge } from '../../utils/spendingTable';

const initialState = {
  loading: false,
  unobtrusive: false,
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
  ministryFinanceSpending: null,
  spendingCount: 0,
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
      ministryFinanceActions.ministryFinanceSpending.call,
      ministryFinanceActions.ministryFinanceSpendingCount.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),
    [combineActions(
      ministryFinanceActions.ministryFinanceGetAdditionalAssets.call,
      ministryFinanceActions.ministryFinanceGetWallet.call,
      ministryFinanceActions.ministryFinanceSpending.call,
      ministryFinanceActions.ministryFinanceSpendingCount.call,
    )]: (state) => ({
      ...state,
      unobtrusive: true,
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
      ministryFinanceActions.ministryFinanceSpending.success,
      ministryFinanceActions.ministryFinanceSpending.failure,
      ministryFinanceActions.ministryFinanceSpendingCount.success,
      ministryFinanceActions.ministryFinanceSpendingCount.failure,
    )]: (state) => ({
      ...state,
      loading: false,
      unobtrusive: false,
    }),

    [ministryFinanceActions.ministryFinanceGetAdditionalAssets.success]: (state, action) => ({
      ...state,
      additionalAssets: action.payload,
    }),

    [ministryFinanceActions.ministryFinanceGetWallet.success]: (state, action) => ({
      ...state,
      walletInfo: action.payload,
    }),

    [ministryFinanceActions.ministryFinanceSpending.success]: (state, action) => ({
      ...state,
      ministryFinanceSpending: spendingTableMerge(action.payload, state.ministryFinanceSpending),
    }),
    [ministryFinanceActions.ministryFinanceSpendingCount.success]: (state, action) => ({
      ...state,
      spendingCount: action.payload.count,
    }),
  },
  initialState,
);

export default ministryFinanceReducer;
