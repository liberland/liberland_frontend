import { combineActions, handleActions } from 'redux-actions';
import { votingActions } from '../actions';

const initialState = {
  isVotingRequested: false,
  candidateList: [],
  electoralSheet: [],
  isVotingInProgress: false,
  ministersList: [],
  liberStakeAmount: 0,
};

const votingReducer = handleActions({
  [combineActions(
    votingActions.addMyCandidacy.call,
    votingActions.sendElectoralSheet.call,
  )]: (state) => ({
    ...state,
    isVotingRequested: true,
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
  [votingActions.getAssembliesList.success]: (state, action) => ({
    ...state,
    ministersList: action.payload,
  }),
  [votingActions.getLiberStakeAmount.success]: (state, action) => ({
    ...state,
    liberStakeAmount: action.payload,
  }),
  [combineActions(
    votingActions.addMyCandidacy.failure,
    votingActions.addMyCandidacy.success,
    votingActions.sendElectoralSheet.success,
    votingActions.sendElectoralSheet.failure,
  )]: (state) => ({
    ...state,
    isVotingRequested: initialState.isVotingRequested,
  }),
}, initialState);

export default votingReducer;
