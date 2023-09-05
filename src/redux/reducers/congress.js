import { handleActions, combineActions } from 'redux-actions';
import { congressActions } from '../actions';

const initialState = {
  loading: false,
  congressCandidates: [],
  motions: [],
  runnersUp: [],
  members: [],
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
      congressActions.congressProposeLegislation.call,
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
      congressActions.congressProposeLegislation.failure,

      // FIXME remove after we have motion fetching logic merged, PR #113, BLOCKCHAIN-131
      congressActions.congressProposeLegislation.success,
    )]: (state) => ({
      ...state,
      loading: false,
    }),
    [congressActions.getCongressMembers.success]: (state, action) => ({
      ...state,
      members: action.payload,
    }),
    [congressActions.getCongressCandidates.success]: (state, action) => ({
      ...state,
      congressCandidates: action.payload,
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
