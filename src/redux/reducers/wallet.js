import { handleActions, combineActions } from 'redux-actions';
import { walletActions } from '../actions';

const initialState = {
  walletInfo: {
    balances: {
      free: {
        amount: 0,
        nonce: 0,
      },
      liberstake: {
        amount: 0,
      },
      polkastake: {
        amount: 0,
      },
      liquidMerits: {
        amount: 0,
      },
    },
  },
  gettingWalletInfo: false,
};

const walletReducer = handleActions(
  {
    [walletActions.getWallet.call]: (state) => ({
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
    )]: (state) => ({
      ...state,
      gettingWalletInfo: initialState.gettingWalletInfo,
    }),
  },
  initialState,
);

export default walletReducer;
