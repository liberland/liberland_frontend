import { combineActions, handleActions } from 'redux-actions';
import { votingActions } from '../actions';

const initialState = {
  isVotingRequested: false,
  candidateList: [],
  electoralSheet: [],
};

const votingReducer = handleActions(
  {
    [combineActions(
      votingActions.addMyCandidacy.call,
      votingActions.getListOfCandidacy.call,
      votingActions.sendElectoralSheet.call,
    )]: (state) => ({
      ...state,
      isVotingRequested: true,
    }),
    [votingActions.getListOfCandidacy.success]: (state, action) => ({
      ...state,
      candidateList: action.payload,
      isVotingRequested: false,
    }),
    [votingActions.addCandidacyToElectoralSheet.success]: (state, action) => ({
      ...state,
      electoralSheet: action.payload,
    }),
    [combineActions(
      votingActions.addMyCandidacy.failure,
      votingActions.addMyCandidacy.success,
      votingActions.getListOfCandidacy.failure,
      votingActions.sendElectoralSheet.success,
      votingActions.sendElectoralSheet.failure,
    )]: (state) => ({
      ...state,
      isVotingRequested: initialState.isVotingRequested,
    }),
  }, initialState,
);

export default votingReducer;
