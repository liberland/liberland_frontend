import { createActions } from 'redux-actions';

export const {
  getWallet,
} = createActions({
  GET_WALLET: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
