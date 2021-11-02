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
};

const walletReducer = handleActions(
  {
    [combineActions(
      walletActions.getWallet.call,
      walletActions.stakeToPolka.call,
      walletActions.stakeToLiberland.call,
      walletActions.sendTransfer.call,
    )]: (state) => ({
      ...state,
      gettingWalletInfo: true,
    }),
    [walletActions.getWallet.success]: (state, action) => ({
      ...state,
      walletInfo: action.payload,
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
    )]: (state) => ({
      ...state,
      gettingWalletInfo: initialState.gettingWalletInfo,
    }),
  },
  initialState,
);

export default walletReducer;
