import { handleActions } from 'redux-actions';
import { blockchainActions } from '../actions';

const initialState = {
  currentBlockNumber: 0,
  periodAndVotingDuration: {
    assemblyVotingDuration: 0,
    assemblyVotingPeriod: 0,
  },
  electionsBlock: 0,
  allWallets: [],
  userWalletAddress: '',
  errorExistsAndUnacknowledgedByUser: false,
  error: '',
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
  [blockchainActions.setElectionsBlock.success]: (state, action) => ({
    ...state,
    electionsBlock: action.payload,
  }),
  [blockchainActions.getAllWallets.success]: (state, action) => ({
    ...state,
    allWallets: action.payload,
  }),
  [blockchainActions.setUserWallet.success]: (state, action) => ({
    ...state,
    userWalletAddress: action.payload,
  }),
  [blockchainActions.setErrorExistsAndUnacknowledgedByUser.success]: (state, action) => ({
    ...state,
    errorExistsAndUnacknowledgedByUser: action.payload,
  }),
  [blockchainActions.setError.success]: (state, action) => ({
    ...state,
    error: action.payload,
  }),
}, initialState);

export default blockchainReducer;
