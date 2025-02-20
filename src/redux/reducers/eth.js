import { handleActions, combineActions } from 'redux-actions';
import { ethActions } from '../actions';

const initialState = {
  loading: false,
  wallet: null,
  walletOptions: [],
  tokenStakeContractInfo: null,
  tokenStakeAddressInfo: {},
  erc20Info: {},
  erc20Balance: {},
  wethLpExchangeRate: null,
  balance: null,
};

const ethReducer = handleActions(
  {
    [combineActions(
      ethActions.getErc20Balance.call,
      ethActions.getErc20Info.call,
      ethActions.getTokenStakeAddressInfo.call,
      ethActions.getTokenStakeContractInfo.call,
      ethActions.getBalance.call,
      ethActions.getTokenStakeAddressInfo.call,
      ethActions.getTokenStakeContractInfo.call,
      ethActions.getBalance.call,
      ethActions.getEthWalletOptions.call,
      ethActions.getConnectedEthWallet.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),
    [combineActions(
      ethActions.getErc20Balance.success,
      ethActions.getErc20Info.success,
      ethActions.getTokenStakeAddressInfo.success,
      ethActions.getTokenStakeContractInfo.success,
      ethActions.getBalance.success,
      ethActions.getTokenStakeAddressInfo.success,
      ethActions.getTokenStakeContractInfo.success,
      ethActions.getBalance.success,
      ethActions.getEthWalletOptions.success,
      ethActions.getConnectedEthWallet.success,
      ethActions.getErc20Balance.failure,
      ethActions.getErc20Info.failure,
      ethActions.getTokenStakeAddressInfo.failure,
      ethActions.getTokenStakeContractInfo.failure,
      ethActions.getBalance.failure,
      ethActions.getTokenStakeAddressInfo.failure,
      ethActions.getTokenStakeContractInfo.failure,
      ethActions.getBalance.failure,
      ethActions.getEthWalletOptions.failure,
      ethActions.getConnectedEthWallet.failure,
    )]: (state) => ({
      ...state,
      loading: false,
    }),
    [ethActions.getBalance.failure]: (state) => ({
      ...state,
      balance: 0,
    }),
    [ethActions.getBalance.success]: (state, action) => ({
      ...state,
      balance: action.payload.balance,
    }),
    [ethActions.getWethLpExchangeRate.call]: (state) => ({
      ...state,
      wethLpExchangeRate: null,
    }),
    [ethActions.getEthWalletOptions.call]: (state) => ({
      ...state,
      walletOptions: [],
      wallet: null,
    }),
    [ethActions.getConnectedEthWallet.call]: (state) => ({
      ...state,
      wallet: null,
    }),
    [ethActions.getTokenStakeAddressInfo.success]: (state, action) => ({
      ...state,
      tokenStakeAddressInfo: {
        ...state.tokenStakeAddressInfo,
        [action.payload.userEthAddress]: action.payload,
      },
    }),
    [ethActions.getErc20Info.success]: (state, action) => ({
      ...state,
      erc20Info: {
        ...state.erc20Info,
        [action.payload.erc20Address]: action.payload,
      },
    }),
    [ethActions.getErc20Balance.success]: (state, action) => ({
      ...state,
      erc20Balance: {
        ...state.erc20Balance,
        [`${action.payload.erc20Address}/${action.payload.account}`]: action.payload,
      },
    }),
    [ethActions.getTokenStakeContractInfo.success]: (state, action) => ({
      ...state,
      tokenStakeContractInfo: action.payload,
    }),

    [ethActions.getWethLpExchangeRate.success]: (state, action) => ({
      ...state,
      wethLpExchangeRate: action.payload,
    }),
    [ethActions.getEthWalletOptions.success]: (state, action) => ({
      ...state,
      walletOptions: action.payload,
    }),

    [ethActions.getConnectedEthWallet.success]: (state, action) => ({
      ...state,
      wallet: action.payload,
    }),
  },
  initialState,
);

export default ethReducer;
