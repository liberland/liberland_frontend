import { createActions } from 'redux-actions';

export const {
  getWallet,
  sendTransfer,
  stakeToPolka,
  stakeToLiberland,
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
});
