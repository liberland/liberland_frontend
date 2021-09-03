import { combineActions, handleActions } from 'redux-actions';
import { votingActions } from '../actions';

const initialState = {
  isVotingRequested: false,
  candidateList: [],
};

const votingReducer = handleActions(
  {
    [combineActions(
      votingActions.addMyCandidacy.call,
      votingActions.getListOfCandidacy.call,
    )]: (state) => ({
      ...state,
      isVotingRequested: true,
    }),
    [votingActions.getListOfCandidacy.success]: (state, action) => ({
      ...state,
      candidateList: action.payload,
    }),
    [combineActions(
      votingActions.addMyCandidacy.failure,
      votingActions.getListOfCandidacy.failure,
    )]: (state) => ({
      ...state,
      isVotingRequested: false,
    }),
  }, initialState,
);

export default votingReducer;
