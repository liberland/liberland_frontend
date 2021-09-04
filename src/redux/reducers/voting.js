import { combineActions, handleActions } from 'redux-actions';
import { votingActions } from '../actions';

const initialState = {
  isVotingRequested: false,
  candidateList: [],
  electoral_sheet: [],
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
      isVotingRequested: false,
    }),
    [combineActions(
      votingActions.addMyCandidacy.failure,
      votingActions.addMyCandidacy.success,
      votingActions.getListOfCandidacy.failure,
    )]: (state) => ({
      ...state,
      isVotingRequested: initialState.isVotingRequested,
    }),
  }, initialState,
);

export default votingReducer;
