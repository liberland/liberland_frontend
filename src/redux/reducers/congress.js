import { handleActions, combineActions } from 'redux-actions';
import { congressActions } from '../actions';

const initialState = {
  candidates: [],
  loading: false,
  members: [],
  motions: [],
  runnersUp: [],
};

const congressReducer = handleActions(
  {
    [combineActions(
      congressActions.applyForCongress.call,
      congressActions.congressProposeLegislation.call,
      congressActions.congressRepealLegislation.call,
      congressActions.getCandidates.call,
      congressActions.getMembers.call,
      congressActions.getMotions.call,
      congressActions.getRunnersUp.call,
      congressActions.voteAtMotions.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),
    [combineActions(
      congressActions.applyForCongress.failure,
      congressActions.congressProposeLegislation.failure,
      congressActions.congressRepealLegislation.failure,
      congressActions.getCandidates.failure,
      congressActions.getCandidates.success,
      congressActions.getMembers.failure,
      congressActions.getMembers.success,
      congressActions.getMotions.failure,
      congressActions.getMotions.success,
      congressActions.getRunnersUp.failure,
      congressActions.getRunnersUp.success,
      congressActions.voteAtMotions.failure,
    )]: (state) => ({
      ...state,
      loading: false,
    }),
    [congressActions.getCandidates.success]: (state, action) => ({
      ...state,
      candidates: action.payload,
    }),
    [congressActions.getMembers.success]: (state, action) => ({
      ...state,
      members: action.payload,
    }),
    [congressActions.getMotions.success]: (state, action) => ({
      ...state,
      motions: action.payload,
    }),
    [congressActions.getRunnersUp.success]: (state, action) => ({
      ...state,
      runnersUp: action.payload,
    }),
  },
  initialState,
);

export default congressReducer;
