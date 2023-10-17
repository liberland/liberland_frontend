import { handleActions, combineActions } from 'redux-actions';
import { democracyActions } from '../actions';

const initialState = {
  democracy: {
    proposalData: [],
    apideriveReferendums: [],
    apideriveReferendumsActive: [],
    userVotes: [],
    candidates: [],
    currentCongressMembers: [],
    scheduledCalls: [],
  },
  gettingDemocracyInfo: false,
};

const democracyReducer = handleActions(
  {
    [combineActions(
      democracyActions.delegate.call,
      democracyActions.getDemocracy.call,
      democracyActions.propose.call,
      democracyActions.proposeAmendLegislation.call,
      democracyActions.secondProposal.call,
      democracyActions.undelegate.call,
      democracyActions.voteForCongress.call,
      democracyActions.voteOnReferendum.call,
      democracyActions.citizenProposeRepealLegislation.call,
    )]: (state) => ({
      ...state,
      gettingDemocracyInfo: true,
    }),
    [democracyActions.getDemocracy.success]: (state, action) => ({
      ...state,
      democracy: action.payload,
    }),
    [combineActions(
      democracyActions.delegate.failure,
      democracyActions.delegate.success,
      democracyActions.getDemocracy.failure,
      democracyActions.getDemocracy.success,
      democracyActions.propose.failure,
      democracyActions.propose.success,
      democracyActions.proposeAmendLegislation.failure,
      democracyActions.proposeAmendLegislation.success,
      democracyActions.secondProposal.failure,
      democracyActions.secondProposal.success,
      democracyActions.undelegate.failure,
      democracyActions.undelegate.success,
      democracyActions.voteForCongress.failure,
      democracyActions.voteForCongress.success,
      democracyActions.voteOnReferendum.failure,
      democracyActions.voteOnReferendum.success,
      democracyActions.citizenProposeRepealLegislation.failure,
      democracyActions.citizenProposeRepealLegislation.success,

    )]: (state) => ({
      ...state,
      gettingDemocracyInfo: initialState.gettingDemocracyInfo,
    }),
  },
  initialState,
);

export default democracyReducer;
