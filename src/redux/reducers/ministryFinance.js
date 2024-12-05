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
  },
  scheduledCalls: [],
};

const ministryFinanceReducer = handleActions(
  {
    [combineActions(
      ministryFinanceActions.getAdditionalAssets.call,
      ministryFinanceActions.getWallet.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),
    [combineActions(
      ministryFinanceActions.getAdditionalAssets.success,
      ministryFinanceActions.getAdditionalAssets.failure,
      ministryFinanceActions.getWallet.failure,
      ministryFinanceActions.getWallet.success,
    )]: (state) => ({
      ...state,
      loading: false,
    }),
    [ministryFinanceActions.getAdditionalAssets.success]: (state, action) => ({
      ...state,
      additionalAssets: action.payload,
    }),
    [ministryFinanceActions.getWallet.success]: (state, action) => ({
      ...state,
      walletInfo: action.payload,
    }),
  },
  initialState,
);

export default ministryFinanceReducer;
