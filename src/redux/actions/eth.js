import { createActions } from 'redux-actions';

export const {
  getEthWalletOptions,
  getConnectedEthWallet,
  getTokenStakeContractInfo,
  getTokenStakeAddressInfo,
  getErc20Info,
  getErc20Balance,
  getWethLpExchangeRate,
  getBalance,
  stakeLpWithEth,
  stakeTokens,
  withdrawTokens,
  claimReward,
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
  },
  GET_WETH_LP_EXCHANGE_RATE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_BALANCE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  STAKE_LP_WITH_ETH: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  STAKE_TOKENS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  WITHDRAW_TOKENS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CLAIM_REWARD: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
