import { handleActions, combineActions } from 'redux-actions';
import { ethActions } from '../actions';

const initialState = {
  loading: false,
  connecting: false,
  wallet: null,
  wallerError: null,
  walletOptions: [],
  tokenStakeContractInfoLoading: false,
  tokenStakeContractInfo: null,
  tokenStakeAddressInfo: {},
  erc20Info: {},
  erc20Balance: {},
  wethLpExchangeRate: null,
  wethLpExchangeRateLoading: false,
  wethLpExchangeRateError: null,
};

const ethReducer = handleActions(
  {
    [ethActions.getErc20Balance.call]: (state, action) => ({
      ...state,
      erc20Info: {
        ...state.erc20Info,
        [`${action.payload.erc20Address}/${action.payload.account}`]: {
          loading: true,
        },
      },
    }),
    [ethActions.getErc20Info.call]: (state, action) => ({
      ...state,
      erc20Info: {
        ...state.erc20Info,
        [action.payload.erc20Address]: {
          loading: true,
        },
      },
    }),
    [ethActions.getTokenStakeAddressInfo.call]: (state, action) => ({
      ...state,
      tokenStakeAddressInfo: {
        ...state.tokenStakeAddressInfo,
        [action.payload.userEthAddress]: {
          loading: true,
        },
      },
    }),
    [ethActions.getTokenStakeContractInfo.call]: (state) => ({
      ...state,
      tokenStakeContractInfoLoading: true,
    }),
    [ethActions.getWethLpExchangeRate.call]: (state) => ({
      ...state,
      wethLpExchangeRateLoading: true,
      wethLpExchangeRateError: null,
      wethLpExchangeRate: null,
    }),
    [ethActions.getEthWalletOptions.call]: (state) => ({
      ...state,
      loading: true,
    }),
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
      ethActions.getWethLpExchangeRate.success,
      ethActions.getWethLpExchangeRate.failure,
    )]: (state) => ({
      ...state,
      wethLpExchangeRateLoading: initialState.wethLpExchangeRateLoading,
    }),

    [combineActions(
      ethActions.getTokenStakeContractInfo.success,
      ethActions.getTokenStakeContractInfo.failure,
    )]: (state) => ({
      ...state,
      tokenStakeContractInfoLoading: initialState.tokenStakeContractInfoLoading,
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

    [ethActions.getTokenStakeAddressInfo.success]: (state, action) => ({
      ...state,
      tokenStakeAddressInfo: {
        ...state.tokenStakeAddressInfo,
        [action.payload.userEthAddress]: action.payload,
      },
    }),

    [ethActions.getTokenStakeAddressInfo.failure]: (state, action) => ({
      ...state,
      tokenStakeAddressInfo: {
        ...state.tokenStakeAddressInfo,
        [action.payload.userEthAddress]: { error: action.payload },
      },
    }),

    [ethActions.getErc20Info.success]: (state, action) => ({
      ...state,
      erc20Info: {
        ...state.erc20Info,
        [action.payload.erc20Address]: action.payload,
      },
    }),

    [ethActions.getErc20Info.failure]: (state, action) => ({
      ...state,
      erc20Info: {
        ...state.erc20Info,
        [action.payload.erc20Address]: { error: action.payload },
      },
    }),

    [ethActions.getErc20Balance.success]: (state, action) => ({
      ...state,
      erc20Balance: {
        ...state.erc20Balance,
        [`${action.payload.erc20Address}/${action.payload.account}`]: action.payload,
      },
    }),

    [ethActions.getErc20Balance.failure]: (state, action) => ({
      ...state,
      erc20Balance: {
        ...state.erc20Balance,
        [`${action.payload.erc20Address}/${action.payload.account}`]: { error: action.payload },
      },
    }),

    [ethActions.getTokenStakeContractInfo.success]: (state, action) => ({
      ...state,
      tokenStakeContractInfo: action.payload,
    }),

    [ethActions.getTokenStakeContractInfo.failure]: (state, action) => ({
      ...state,
      tokenStakeContractInfo: { error: action.payload },
    }),

    [ethActions.getWethLpExchangeRate.success]: (state, action) => ({
      ...state,
      wethLpExchangeRate: action.payload,
    }),

    [ethActions.getWethLpExchangeRate.failure]: (state, action) => ({
      ...state,
      wethLpExchangeRateError: action,
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
