import { handleActions } from 'redux-actions';
import { blockchainActions } from '../actions';

const initialState = {
  currentBlockNumber: 0,
  periodAndVotingDuration: {
    assemblyVotingDuration: 0,
    assemblyVotingPeriod: 0,
  },
};

const blockchainReducer = handleActions({
  [blockchainActions.getCurrentBlockNumber.success]: (state, action) => ({
    ...state,
    currentBlockNumber: action.payload,
  }),
  [blockchainActions.getPeriodAndVotingDuration.success]: (state, action) => ({
    ...state,
    periodAndVotingDuration: action.payload,
  }),
  [blockchainActions.getCurrentBlockNumber.failure]: (state, action) => ({
    ...state,
    currentBlockNumber: action.payload,
  }),
}, initialState);

export default blockchainReducer;
