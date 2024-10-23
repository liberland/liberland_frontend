import { createActions } from 'redux-actions';

export const {
  getEthWalletOptions,
  getConnectedEthWallet,
  getTokenStakeContractInfo,
  getTokenStakeAddressInfo,
  getERC20Info,
  getERC20Balance,
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
  },
  GET_TOKEN_STAKE_CONTRACT_INFO: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_TOKEN_STAKE_ADDRESS_INFO: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_ERC20_INFO: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_ERC20_BALANCE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  }
});