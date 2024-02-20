import { createActions } from 'redux-actions';

export const {
  getWallet,
  sendTransfer,
  sendTransferLLM,
  stakeToPolka,
  stakeToLiberland,
  setCurrentPageNumber,
  getValidators,
  getNominatorTargets,
  setNominatorTargets,
  unpool,
  getTxTransfers,
  getAdditionalAssets,
  sendAssetsTransfer,
} = createActions({
  GET_WALLET: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SEND_TRANSFER: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SEND_TRANSFER_L_L_M: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  STAKE_TO_POLKA: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  STAKE_TO_LIBERLAND: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_THREE_TX: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_MORE_TX: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_CURRENT_PAGE_NUMBER: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_VALIDATORS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_NOMINATOR_TARGETS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_NOMINATOR_TARGETS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  UNPOOL: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_TX_TRANSFERS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_ADDITIONAL_ASSETS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SEND_ASSETS_TRANSFER: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
