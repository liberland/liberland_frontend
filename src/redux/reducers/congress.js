import { handleActions, combineActions } from 'redux-actions';
import { congressActions } from '../actions';

const initialState = {
  loading: false,
  congressCandidates: [],
};

const congressReducer = handleActions(
  {
    [combineActions(
      congressActions.applyForCongress.call,
      congressActions.getCongressCandidates.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),
    [combineActions(
      congressActions.applyForCongress.failure,
      congressActions.getCongressCandidates.success,
      congressActions.getCongressCandidates.failure,
    )]: (state) => ({
      ...state,
      loading: false,
    }),
    [congressActions.getCongressCandidates.success]: (state, action) => ({
      ...state,
      congressCandidates: action.payload,
    }),
  },
  initialState,
);

export default congressReducer;
