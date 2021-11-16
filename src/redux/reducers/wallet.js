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
    },
  },
  gettingWalletInfo: false,
  historyTx: [{}],
  countAllRows: 0,
  currentPageNumber: 0,
  allHistoryTx: [],
};

const walletReducer = handleActions(
  {
    [combineActions(
      walletActions.getWallet.call,
      walletActions.stakeToPolka.call,
      walletActions.stakeToLiberland.call,
      walletActions.sendTransfer.call,
      walletActions.getThreeTx.call,
      walletActions.getMoreTx.call,
    )]: (state) => ({
      ...state,
      gettingWalletInfo: true,
    }),
    [walletActions.getWallet.success]: (state, action) => ({
      ...state,
      walletInfo: action.payload,
    }),
    [walletActions.getThreeTx.success]: (state, action) => ({
      ...state,
      historyTx: action.payload.rows,
      countAllRows: action.payload.count,
      gettingWalletInfo: initialState.gettingWalletInfo,
    }),
    [walletActions.getMoreTx.success]: (state, action) => ({
      ...state,
      allHistoryTx: action.payload,
    }),
    [walletActions.setCurrentPageNumber.success]: (state, action) => ({
      ...state,
      currentPageNumber: action.payload,
    }),
    [combineActions(
      walletActions.getWallet.success,
      walletActions.getWallet.failure,
      walletActions.stakeToPolka.success,
      walletActions.stakeToLiberland.success,
      walletActions.stakeToPolka.failure,
      walletActions.stakeToLiberland.failure,
      walletActions.sendTransfer.success,
      walletActions.sendTransfer.failure,
      walletActions.getMoreTx.success,
      walletActions.getMoreTx.failure,
    )]: (state) => ({
      ...state,
      gettingWalletInfo: initialState.gettingWalletInfo,
    }),
  },
  initialState,
);

export default walletReducer;
