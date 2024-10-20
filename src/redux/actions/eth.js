import { createActions } from 'redux-actions';

export const {
  getEthWalletOptions,
  getConnectedEthWallet,
} = createActions({
  GET_ETH_WALLET_OPTIONS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_CONNECTED_ETH_WALLET: {
    call: undefined,
    success: undefined,
    failure: undefined,
  }
});