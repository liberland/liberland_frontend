import { handleActions, combineActions } from 'redux-actions';
import { congressActions } from '../actions';

const initialState = {
  loading: false,
  congressCandidates: [],
  motions: [],
  congressMembers: [],
  runnersUp: [],
};

const congressReducer = handleActions(
  {
    [combineActions(
      congressActions.applyForCongress.call,
      congressActions.getCongressCandidates.call,
      congressActions.getMotions.call,
      congressActions.voteAtMotions.call,
      congressActions.getCongressMembers.call,
      congressActions.getRunnersUp.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),
    [combineActions(
      congressActions.applyForCongress.failure,
      congressActions.getCongressCandidates.success,
      congressActions.getCongressCandidates.failure,
      congressActions.getMotions.success,
      congressActions.getMotions.failure,
      congressActions.voteAtMotions.failure,
      congressActions.getCongressMembers.success,
      congressActions.getCongressMembers.failure,
      congressActions.getRunnersUp.success,
      congressActions.getRunnersUp.failure,
    )]: (state) => ({
      ...state,
      loading: false,
    }),
    [congressActions.getCongressCandidates.success]: (state, action) => ({
      ...state,
      congressCandidates: action.payload,
    }),
    [congressActions.getMotions.success]: (state, action) => ({
      ...state,
      motions: action.payload,
    }),
    [congressActions.getCongressMembers.success]: (state, action) => ({
      ...state,
      congressMembers: action.payload,
    }),
    [congressActions.getRunnersUp.success]: (state, action) => ({
      ...state,
      runnersUp: action.payload,
    }),
  },
  initialState,
);

export default congressReducer;
