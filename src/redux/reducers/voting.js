import { combineActions, handleActions } from 'redux-actions';
import { votingActions } from '../actions';

const initialState = {
  isVotingRequested: false,
  candidateList: [],
  electoralSheet: [],
  isVotingInProgress: false,
  ministersList: [],
  periodAndVotingDuration: {},
  currentBlockNumber: 0,
};

const votingReducer = handleActions(
  {
    [combineActions(
      votingActions.addMyCandidacy.call,
      votingActions.getListOfCandidacy.call,
      votingActions.sendElectoralSheet.call,
      votingActions.getMinistersList.call,
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
    [votingActions.setIsVotingInProgress.success]: (state, action) => ({
      ...state,
      isVotingInProgress: action.payload,
    }),
    [votingActions.setIsVotingInProgress.failure]: (state) => ({
      ...state,
      isVotingInProgress: initialState.isVotingRequested,
    }),
    [votingActions.getMinistersList.success]: (state, action) => ({
      ...state,
      ministersList: action.payload,
    }),
    [votingActions.getPeriodAndVotingDuration.success]: (state, action) => ({
      ...state,
      periodAndVotingDuration: action.payload,
    }),
    [votingActions.setCurrentBlockNumber.success]: (state, action) => ({
      ...state,
      currentBlockNumber: action.payload,
    }),
    [combineActions(
      votingActions.addMyCandidacy.failure,
      votingActions.addMyCandidacy.success,
      votingActions.getListOfCandidacy.failure,
      votingActions.sendElectoralSheet.success,
      votingActions.sendElectoralSheet.failure,
      votingActions.getMinistersList.failure,
      votingActions.getMinistersList.success,
    )]: (state) => ({
      ...state,
      isVotingRequested: initialState.isVotingRequested,
    }),
  }, initialState,
);

export default votingReducer;
