import { handleActions, combineActions } from 'redux-actions';
import { democracyActions } from '../actions';

const initialState = {
  democracy: {
    proposalData: [],
    apideriveReferendums: [],
    apideriveReferendumsActive: [],
    userVotes: [],
  },
  gettingDemocracyInfo: false,
};

const democracyReducer = handleActions(
  {
    [combineActions(
      democracyActions.getDemocracy.call,
    )]: (state) => ({
      ...state,
      gettingDemocracyInfo: true,
    }),
    [democracyActions.getDemocracy.success]: (state, action) => ({
      ...state,
      democracy: action.payload,
    }),
    [combineActions(
      democracyActions.getDemocracy.success,
      democracyActions.getDemocracy.failure,
    )]: (state) => ({
      ...state,
      gettingDemocracyInfo: initialState.gettingDemocracyInfo,
    }),
  },
  initialState,
);

export default democracyReducer;
