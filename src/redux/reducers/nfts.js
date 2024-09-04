import { combineActions, handleActions } from 'redux-actions';
import { nftsActions } from '../actions';

const initialState = {
  isLoading: false,
  userNfts: [],
};

const nftsReducer = handleActions({
  [combineActions(
    nftsActions.getNfts.call,
  )]: (state) => ({
    ...state,
    isLoading: true,
  }),
  [nftsActions.getNfts.success]: (state, action) => ({
    ...state,
    userNfts: action.payload,
  }),
  [combineActions(
    nftsActions.getNfts.failure,
    nftsActions.getNfts.success,
  )]: (state) => ({
    ...state,
    isLoading: initialState.isLoading,
  }),
}, initialState);

export default nftsReducer;
