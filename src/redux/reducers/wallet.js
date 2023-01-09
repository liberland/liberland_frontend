import { handleActions, combineActions } from 'redux-actions';
import { walletActions } from '../actions';

const initialState = {
  walletInfo: {
    balances: {
      liberstake: {
        amount: 0,
      },
      polkastake: {
        amount: 0,
      },
      liquidMerits: {
        amount: 0,
      },
      totalAmount: {
        amount: 0,
      },
      meritsTotalAmount: {
        amount: 0,
      },
    },
  },
  gettingWalletInfo: false,
  historyTx: [{}],
  countAllRows: 0,
  currentPageNumber: 0,
  allHistoryTx: [],
  validators: [],
  nominatorTargets: [],
};

const walletReducer = handleActions(
  {
    [combineActions(
      walletActions.getWallet.call,
      walletActions.stakeToPolka.call,
      walletActions.stakeToLiberland.call,
      walletActions.sendTransfer.call,
      walletActions.sendTransferLLM.call,
      walletActions.getValidators.call,
      walletActions.getNominatorTargets.call,
      walletActions.setNominatorTargets.call,
    )]: (state) => ({
      ...state,
      gettingWalletInfo: true,
    }),
    [walletActions.getWallet.success]: (state, action) => ({
      ...state,
      walletInfo: action.payload,
    }),
    [walletActions.setCurrentPageNumber.success]: (state, action) => ({
      ...state,
      currentPageNumber: action.payload,
    }),
    [walletActions.getValidators.success]: (state, action) => ({
      ...state,
      validators: action.payload,
    }),
    [walletActions.getNominatorTargets.success]: (state, action) => ({
      ...state,
      nominatorTargets: action.payload,
    }),
    [combineActions(
      walletActions.getWallet.success,
      walletActions.getWallet.failure,
      walletActions.stakeToPolka.success,
      walletActions.stakeToLiberland.success,
      walletActions.stakeToPolka.failure,
      walletActions.stakeToLiberland.failure,
      walletActions.sendTransfer.success,
      walletActions.sendTransferLLM.success,
      walletActions.sendTransfer.failure,
      walletActions.sendTransferLLM.failure,
      walletActions.getValidators.success,
      walletActions.getValidators.failure,
      walletActions.getNominatorTargets.failure,
      walletActions.setNominatorTargets.success,
      walletActions.setNominatorTargets.failure,
    )]: (state) => ({
      ...state,
      gettingWalletInfo: initialState.gettingWalletInfo,
    }),
  },
  initialState,
);

export default walletReducer;
