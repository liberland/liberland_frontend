import { handleActions, combineActions } from 'redux-actions';
import { BN_ZERO } from '@polkadot/util';
import { congressActions } from '../actions';

const initialState = {
  candidates: [],
  loading: false,
  members: [],
  motions: [],
  runnersUp: [],
  treasury: {
    proposals: {},
    budget: BN_ZERO,
    period: BN_ZERO,
  },
};

const congressReducer = handleActions(
  {
    [combineActions(
      congressActions.applyForCongress.call,
      congressActions.closeMotion.call,
      congressActions.congressProposeLegislation.call,
      congressActions.congressProposeLegislationReferendum.call,
      congressActions.congressRepealLegislation.call,
      congressActions.getCandidates.call,
      congressActions.getMembers.call,
      congressActions.getMotions.call,
      congressActions.getRunnersUp.call,
      congressActions.voteAtMotions.call,
      congressActions.getTreasuryInfo.call,
      congressActions.approveTreasurySpend.call,
      congressActions.unapproveTreasurySpend.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),
    [combineActions(
      congressActions.applyForCongress.failure,
      congressActions.approveTreasurySpend.failure,
      congressActions.closeMotion.failure,
      congressActions.congressProposeLegislation.failure,
      congressActions.congressProposeLegislationReferendum.failure,
      congressActions.congressRepealLegislation.failure,
      congressActions.getCandidates.failure,
      congressActions.getCandidates.success,
      congressActions.getMembers.failure,
      congressActions.getMembers.success,
      congressActions.getMotions.failure,
      congressActions.getMotions.success,
      congressActions.getRunnersUp.failure,
      congressActions.getRunnersUp.success,
      congressActions.getTreasuryInfo.failure,
      congressActions.getTreasuryInfo.success,
      congressActions.unapproveTreasurySpend.failure,
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
    [congressActions.getTreasuryInfo.success]: (state, action) => ({
      ...state,
      treasury: action.payload,
    }),
  },
  initialState,
);

export default congressReducer;
