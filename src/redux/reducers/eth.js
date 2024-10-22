import { handleActions, combineActions } from 'redux-actions';
import { ethActions } from '../actions';

const initialState = {
  loading: false,
  connecting: false,
  wallet: null,
  wallerError: null,
  walletOptions: [],
};

const ethReducer = handleActions(
  {
    [ethActions.getEthWalletOptions.call]: (state) => ({
      ...state,
      loading: true,
    }),
    [ethActions.getConnectedEthWallet.call]: (state) => ({
      ...state,
      walletError: null,
      connecting: true,
    }),

    [combineActions(
      ethActions.getEthWalletOptions.success,
      ethActions.getEthWalletOptions.failure,
    )]: (state) => ({
      ...state,
      loading: initialState.loading,
    }),

    [combineActions(
      ethActions.getConnectedEthWallet.success,
      ethActions.getConnectedEthWallet.failure,
    )]: (state) => ({
      ...state,
      connecting: initialState.connecting,
    }),

    [ethActions.getEthWalletOptions.call]: (state) => ({
      ...state,
      walletOptions: [],
      wallet: null,
      walletError: null,
    }),

    [ethActions.getConnectedEthWallet.call]: (state) => ({
      ...state,
      wallet: null,
      walletError: null,
    }),

    [ethActions.getEthWalletOptions.success]: (state, action) => ({
      ...state,
      walletOptions: action.payload,
    }),

    [ethActions.getConnectedEthWallet.success]: (state, action) => ({
      ...state,
      wallet: action.payload,
    }),
  
    [ethActions.getConnectedEthWallet.failure]: (state, action) => ({
      ...state,
      walletError: action.payload,
    }),
  },
  initialState,
);

export default ethReducer;