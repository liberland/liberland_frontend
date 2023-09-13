import { handleActions, combineActions } from 'redux-actions';
import { congressActions } from '../actions';

const initialState = {
  loading: false,
  congressCandidates: [],
  motions: [],
};

const congressReducer = handleActions(
  {
    [combineActions(
      congressActions.applyForCongress.call,
      congressActions.getCongressCandidates.call,
      congressActions.getMotions.call,
      congressActions.voteAtMotions.call,
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
  },
  initialState,
);

export default congressReducer;
