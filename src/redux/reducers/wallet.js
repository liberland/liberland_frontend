import { handleActions, combineActions } from 'redux-actions';
import { walletActions } from '../actions';

const initialState = {
  walletInfo: {
    balances: {
      liberstake: {
        amount: '0x0',
      },
      polkastake: {
        amount: '0',
      },
      liquidMerits: {
        amount: '0',
      },
      totalAmount: {
        amount: '0x0',
      },
      liquidAmount: {
        amount: '0x0',
      },
      meritsTotalAmount: {
        amount: '0',
      },
      electionLock: 0,
    },
  },
  additionalAssets: [],
  assetDetails: [],
  gettingWalletInfo: false,
  unobtrusive: false,
  transfersTxHistory: {
    transfersTxHistory: [],
    transfersTxHistoryFailed: false,
  },
  countAllRows: 0,
  currentPageNumber: 0,
  validators: [],
  nominatorTargets: [],
  assetBalance: null,
  assetsBalance: {},
  transferState: null,
  paymentSuccess: false,
  paymentCreated: false,
};

const walletReducer = handleActions(
  {
    [walletActions.sendTransfer.call]: (state) => ({
      ...state,
      transferState: null,
    }),
    [combineActions(
      walletActions.getWallet.call,
      walletActions.getAssetsDetails.call,
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
      walletActions.getAssetsBalance.call,
      walletActions.sendTransferRemark.call,
      walletActions.createOrUpdateAsset.call,
      walletActions.mintAsset.call,
      walletActions.checkPayment.call,
      walletActions.createPayment.call,
    )]: (state) => ({
      ...state,
      gettingWalletInfo: true,
    }),
    [combineActions(
      walletActions.getWallet.call,
      walletActions.getAssetsDetails.call,
      walletActions.getAdditionalAssets.call,
      walletActions.getValidators.call,
      walletActions.getNominatorTargets.call,
      walletActions.getTxTransfers.call,
      walletActions.getAssetsBalance.call,
      walletActions.checkPayment.call,
    )]: (state) => ({
      ...state,
      unobtrusive: true,
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
    [walletActions.checkPayment.call]: (state) => ({
      ...state,
      paymentSuccess: initialState.paymentSuccess,
    }),
    [walletActions.checkPayment.success]: (state) => ({
      ...state,
      paymentSuccess: true,
    }),
    [walletActions.getWallet.success]: (state, action) => ({
      ...state,
      walletInfo: action.payload,
    }),
    [walletActions.getAdditionalAssets.success]: (state, action) => ({
      ...state,
      additionalAssets: action.payload,
    }),
    [walletActions.getAssetsDetails.success]: (state, action) => ({
      ...state,
      assetDetails: action.payload,
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
    [walletActions.createPayment.success]: (state) => ({
      ...state,
      paymentCreated: true,
    }),
    [combineActions(
      walletActions.getWallet.success,
      walletActions.getWallet.failure,
      walletActions.getAdditionalAssets.failure,
      walletActions.getAdditionalAssets.success,
      walletActions.getAssetsDetails.failure,
      walletActions.getAssetsDetails.success,
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
      walletActions.getAssetsBalance.success,
      walletActions.getAssetsBalance.failure,
      walletActions.sendTransferRemark.success,
      walletActions.sendTransferRemark.failure,
      walletActions.createOrUpdateAsset.success,
      walletActions.mintAsset.success,
      walletActions.createOrUpdateAsset.failure,
      walletActions.mintAsset.failure,
      walletActions.checkPayment.success,
      walletActions.checkPayment.failure,
      walletActions.createPayment.success,
      walletActions.createPayment.failure,
    )]: (state) => ({
      ...state,
      gettingWalletInfo: initialState.gettingWalletInfo,
      unobtrusive: initialState.unobtrusive,
    }),
    [walletActions.sendTransfer.success]: (state) => ({
      ...state,
      transferState: 'success',
    }),
    [walletActions.sendTransfer.failure]: (state) => ({
      ...state,
      transferState: 'failure',
    }),
  },
  initialState,
);

export default walletReducer;
