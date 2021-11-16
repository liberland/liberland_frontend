import { createActions } from 'redux-actions';

export const {
  getWallet,
  sendTransfer,
  stakeToPolka,
  stakeToLiberland,
  getThreeTx,
  getMoreTx,
  setCurrentPageNumber,
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
});
