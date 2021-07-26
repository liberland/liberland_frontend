import { createActions } from 'redux-actions';

export const {
  getWallet,
  sendTransfer,
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
});
