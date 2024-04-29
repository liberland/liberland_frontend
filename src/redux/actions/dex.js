import { createActions } from 'redux-actions';

export const {
  getPools,
  createPool,
  addLiquidity,
  swapTokens,
  swapExactTokensForTokens,
  swapTokensForExactTokens,
  getDexReserves,
  removeLiquidity,
  getWithdrawalFee,
} = createActions({
  GET_POOLS: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
  CREATE_POOL: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
  ADD_LIQUIDITY: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
  SWAP_EXACT_TOKENS_FOR_TOKENS: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
  SWAP_TOKENS_FOR_EXACT_TOKENS: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
  GET_DEX_RESERVES: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
  REMOVE_LIQUIDITY: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
  GET_WITHDRAWAL_FEE: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
});
