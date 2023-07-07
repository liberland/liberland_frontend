import { handleActions, combineActions } from 'redux-actions';
import { bridgeActions } from '../actions';

export const initialState = {
  loading: false,
  transfers: {
    toSubstrateInitialized: false,
    toSubstrate: {
      LLM: {},
      LLD: {},
    },
    toEthereumInitialized: false,
    toEthereum: {
      LLM: {},
      LLD: {},
    },
  }
};

const bridgeReducer = handleActions(
  {
    [combineActions(
      bridgeActions.getTransfersToEthereum.call,
      bridgeActions.getTransfersToSubstrate.call,
      bridgeActions.withdraw.call,
      bridgeActions.deposit.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),

    [combineActions(
      bridgeActions.withdraw.success,
      bridgeActions.withdraw.failure,
      bridgeActions.deposit.success,
      bridgeActions.deposit.failure,
      bridgeActions.getTransfersToEthereum.success,
      bridgeActions.getTransfersToEthereum.failure,
      bridgeActions.getTransfersToSubstrate.success,
      bridgeActions.getTransfersToSubstrate.failure,
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
          [action.payload.asset]: {
            ...state.transfers.toEthereum[action.payload.asset],
            [action.payload.receipt_id]: action.payload,
          }
        }
      }
    }),

    [bridgeActions.updateTransferWithdrawTx.set]: (state, action) => {
      const { asset, receipt_id, withdraw_tx } = action.payload;
      let transfer = state.transfers.toSubstrate[asset][receipt_id] ?? {};
      return {
        ...state,
        transfers: {
          ...state.transfers,
          toSubstrate: {
            ...state.transfers.toSubstrate,
            [asset]: {
              ...state.transfers.toSubstrate[asset],
              [receipt_id]: {
                ...transfer,
                withdraw_tx
              }
            }
          }
        }
      }
    },

    [bridgeActions.updateTransferStatus.set]: (state, action) => {
      const { asset, receipt_id, status } = action.payload;
      let transfer = state.transfers.toSubstrate[asset][receipt_id] ?? {};
      return {
        ...state,
        transfers: {
          ...state.transfers,
          toSubstrate: {
            ...state.transfers.toSubstrate,
            [asset]: {
              ...state.transfers.toSubstrate[asset],
              [receipt_id]: {
                ...transfer,
                status
              }
            }
          }
        }
      }
    },

    [bridgeActions.getTransfersToEthereum.success]: (state, action) => ({
      ...state,
      transfers: {
        ...state.transfers,
        toEthereumInitialized: true,
        toEthereum: action.payload,
      }
    }),

    [bridgeActions.getTransfersToSubstrate.success]: (state, action) => ({
      ...state,
      transfers: {
        ...state.transfers,
        toSubstrateInitialized: true,
        toSubstrate: action.payload,
      }
    }),
  },
  initialState,
);

export default bridgeReducer;
