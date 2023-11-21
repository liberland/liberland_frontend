import { handleActions, combineActions } from 'redux-actions';
import { bridgeActions } from '../actions';

export const initialState = {
  loading: false,
  transfers: {
    toSubstratePreload: null,
    toSubstrateInitialized: false,
    toSubstrate: {},
    toEthereumPreload: null,
    toEthereumInitialized: false,
    toEthereum: {},
    toEthereumFailed: false,
  },
  bridgesConstants: null,
};

const bridgeReducer = handleActions(
  {
    [combineActions(
      bridgeActions.getTransfersToEthereum.call,
      bridgeActions.getTransfersToSubstrate.call,
      bridgeActions.withdraw.call,
      bridgeActions.deposit.call,
      bridgeActions.burn.call,
      bridgeActions.getBridgesConstants.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),

    [combineActions(
      bridgeActions.withdraw.success,
      bridgeActions.withdraw.failure,
      bridgeActions.deposit.success,
      bridgeActions.deposit.failure,
      bridgeActions.burn.success,
      bridgeActions.burn.failure,
      bridgeActions.getTransfersToEthereum.success,
      bridgeActions.getTransfersToEthereum.failure,
      bridgeActions.getTransfersToSubstrate.success,
      bridgeActions.getTransfersToSubstrate.failure,
      bridgeActions.getBridgesConstants.success,
      bridgeActions.getBridgesConstants.failure,
    )]: (state) => ({
      ...state,
      loading: initialState.loading,
    }),

    [bridgeActions.deposit.success]: (state, action) => ({
      ...state,
      transfers: {
        ...state.transfers,
        toEthereum: {
          ...state.transfers.toEthereum,
          [action.payload.receipt_id]: action.payload,
        },
      },
    }),

    [bridgeActions.burn.success]: (state, action) => ({
      ...state,
      transfers: {
        ...state.transfers,
        toSubstrate: {
          ...state.transfers.toSubstrate,
          [action.payload.txHash]: action.payload,
        },
      },
    }),

    [bridgeActions.getBridgesConstants.success]: (state, action) => ({
      ...state,
      bridgesConstants: action.payload,
    }),

    [bridgeActions.monitorBurn.success]: (state, action) => ({
      ...state,
      transfers: {
        ...state.transfers,
        toSubstrate: {
          ...state.transfers.toSubstrate,
          [action.payload.txHash]: {
            ...state.transfers.toSubstrate[action.payload.txHash],
            receipt_id: action.payload.receipt_id,
            blockHash: action.payload.blockHash,
          },
        },
      },
    }),

    [bridgeActions.updateTransferWithdrawTx.set]: (state, action) => {
      const { txHash, withdrawTx } = action.payload;
      const transfer = state.transfers.toSubstrate[txHash] ?? {};
      return {
        ...state,
        transfers: {
          ...state.transfers,
          toSubstrate: {
            ...state.transfers.toSubstrate,
            [txHash]: {
              ...transfer,
              withdrawTx,
            },
          },
        },
      };
    },

    [bridgeActions.updateTransferStatus.set]: (state, action) => {
      const { txHash, status } = action.payload;
      const transfer = state.transfers.toSubstrate[txHash] ?? {};
      return {
        ...state,
        transfers: {
          ...state.transfers,
          toSubstrate: {
            ...state.transfers.toSubstrate,
            [txHash]: {
              ...transfer,
              status,
            },
          },
        },
      };
    },

    [bridgeActions.getTransfersToEthereum.success]: (state, action) => ({
      ...state,
      transfers: {
        ...state.transfers,
        toEthereumInitialized: true,
        toEthereum: {
          ...state.transfers.toEthereum,
          ...action.payload,
        },
      },
    }),

    [bridgeActions.getTransfersToSubstrate.success]: (state, action) => ({
      ...state,
      transfers: {
        ...state.transfers,
        toSubstrateInitialized: true,
        toSubstrate: {
          ...state.transfers.toSubstrate,
          ...action.payload,
        },
      },
    }),

    [bridgeActions.getTransfersToEthereum.failure]: (state) => ({
      ...state,
      transfers: {
        ...state.transfers,
        toEthereumFailed: true,
      },
    }),

    [bridgeActions.getTransfersToEthereum.call]: (state) => ({
      ...state,
      transfers: {
        ...state.transfers,
        toEthereumFailed: false,
      },
    }),
  },
  initialState,
);

export default bridgeReducer;
