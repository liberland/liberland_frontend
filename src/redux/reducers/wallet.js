import { handleActions, combineActions } from 'redux-actions';
import { walletActions } from '../actions';

const initialState = {
  walletInfo: {
    balances: {
      liberstake: {
        amount: '0x0',
      },
      polkastake: {
        amount: 0,
      },
      liquidMerits: {
        amount: 0,
      },
      totalAmount: {
        amount: '0x0',
      },
      liquidAmount: {
        amount: '0x0',
      },
      meritsTotalAmount: {
        amount: 0,
      },
      electionLock: 0,
    },
  },
  additionalAssets: [],
  gettingWalletInfo: false,
  transfersTxHistory: {
    transfersTxHistory: [],
    transfersTxHistoryFailed: false,
  },
  countAllRows: 0,
  currentPageNumber: 0,
  validators: [],
  nominatorTargets: [],
  assetBalance: null,
  assetsBalance: [],
};

const walletReducer = handleActions(
  {
    [combineActions(
      walletActions.getWallet.call,
      walletActions.getAdditionalAssets.call,
      walletActions.stakeToPolka.call,
      walletActions.stakeToLiberland.call,
      walletActions.sendTransfer.call,
      walletActions.sendTransferLLM.call,
      walletActions.sendAssetsTransfer.call,
      walletActions.getValidators.call,
      walletActions.getNominatorTargets.call,
      walletActions.setNominatorTargets.call,
      walletActions.unpool.call,
      walletActions.getTxTransfers.call,
      walletActions.getAssetBalance.call,
      walletActions.getAssetsBalance.call,
    )]: (state) => ({
      ...state,
      gettingWalletInfo: true,
    }),
    [walletActions.getTxTransfers.call]: (state) => ({
      ...state,
      transfersTxHistory: {
        ...state.transfersTxHistory,
        transfersTxHistoryFailed: false,
      },
    }),
    [walletActions.getTxTransfers.success]: (state, action) => ({
      ...state,
      transfersTxHistory: {
        ...state.transfersTxHistory,
        transfersTxHistory: action.payload,
      },
    }),
    [walletActions.getTxTransfers.failure]: (state) => ({
      ...state,
      transfersTxHistory: {
        ...state.transfersTxHistory,
        transfersTxHistoryFailed: true,
      },
    }),
    [walletActions.getWallet.success]: (state, action) => ({
      ...state,
      walletInfo: action.payload,
    }),
    [walletActions.getAdditionalAssets.success]: (state, action) => ({
      ...state,
      additionalAssets: action.payload,
    }),
    [walletActions.getAssetBalance.success]: (state, action) => ({
      ...state,
      assetBalance: action.payload,
    }),
    [walletActions.getAssetsBalance.success]: (state, action) => ({
      ...state,
      assetsBalance: action.payload,
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
      walletActions.getAdditionalAssets.failure,
      walletActions.getAdditionalAssets.success,
      walletActions.stakeToPolka.success,
      walletActions.stakeToLiberland.success,
      walletActions.stakeToPolka.failure,
      walletActions.stakeToLiberland.failure,
      walletActions.sendTransfer.success,
      walletActions.sendTransferLLM.success,
      walletActions.sendTransfer.failure,
      walletActions.sendAssetsTransfer.success,
      walletActions.sendAssetsTransfer.failure,
      walletActions.sendTransferLLM.failure,
      walletActions.getValidators.success,
      walletActions.getValidators.failure,
      walletActions.getNominatorTargets.failure,
      walletActions.setNominatorTargets.success,
      walletActions.setNominatorTargets.failure,
      walletActions.unpool.success,
      walletActions.unpool.failure,
      walletActions.getTxTransfers.success,
      walletActions.getTxTransfers.failure,
      walletActions.getAssetBalance.success,
      walletActions.getAssetBalance.failure,
      walletActions.getAssetsBalance.success,
      walletActions.getAssetsBalance.failure,
    )]: (state) => ({
      ...state,
      gettingWalletInfo: initialState.gettingWalletInfo,
    }),
  },
  initialState,
);

export default walletReducer;
