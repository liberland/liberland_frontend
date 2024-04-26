import { handleActions, combineActions } from 'redux-actions';
import { dexActions } from '../actions';

const initialState = {
  loading: false,
  pools: null,
  reserves: null,
};

const dexReducer = handleActions(
  {
    [combineActions(
      dexActions.getPools.call,
      dexActions.addLiquidity.call,
      dexActions.swapTokensForExactTokens.call,
      dexActions.swapExactTokensForTokens.call,
      dexActions.removeLiquidity.call,
      dexActions.getDexReserves.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),

    [combineActions(
      dexActions.swapExactTokensForTokens.success,
      dexActions.swapExactTokensForTokens.failure,
      dexActions.swapTokensForExactTokens.success,
      dexActions.swapTokensForExactTokens.failure,
      dexActions.removeLiquidity.success,
      dexActions.removeLiquidity.failure,
      dexActions.getDexReserves.success,
      dexActions.getDexReserves.failure,
      dexActions.getDexReserves.call,
      dexActions.getPools.success,
      dexActions.getPools.failure,
      dexActions.addLiquidity.success,
      dexActions.addLiquidity.failure,
    )]: (state) => ({
      ...state,
      loading: initialState.loading,
    }),

    [dexActions.getPools.call]: (state) => ({
      ...state,
      pools: null,
    }),

    [dexActions.getPools.success]: (state, action) => ({
      ...state,
      pools: action.payload,
    }),

    [dexActions.getDexReserves.success]: (state, action) => {
      const cos = {
        ...state,
        reserves: state?.reserves ? {
          [action.payload.asset1Number]: {
            ...state.reserves[action.payload.asset1Number],
            [action.payload.asset2Number]: action.payload,
          },
        } : {
          [action.payload.asset1Number]: {
            [action.payload.asset2Number]: action.payload,
          },
        },

      };
      return cos;
    }
    ,
  },
  initialState,
);

export default dexReducer;
