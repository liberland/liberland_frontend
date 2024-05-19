import { handleActions, combineActions } from 'redux-actions';
import { BN_ZERO } from '@polkadot/util';
import { congressActions } from '../actions';

const initialState = {
  codeName: 'councilAccount',
  congressWalletInfo: {
    balances: {
      liberstake: {
        amount: BN_ZERO,
      },
      polkastake: {
        amount: 0,
      },
      liquidMerits: {
        amount: 0,
      },
      totalAmount: {
        amount: BN_ZERO,
      },
      liquidAmount: {
        amount: BN_ZERO,
      },
      meritsTotalAmount: {
        amount: 0,
      },
      electionLock: 0,
    },
  },
  additionalAssets: [],
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
  motionDurationInDays: 7,
  minSpendDelayInDays: 5,
};

const congressReducer = handleActions(
  {
    [combineActions(
      congressActions.applyForCongress.call,
      congressActions.closeMotion.call,
      congressActions.congressAmendLegislation.call,
      congressActions.congressAmendLegislationViaReferendum.call,
      congressActions.congressProposeLegislation.call,
      congressActions.congressProposeLegislationViaReferendum.call,
      congressActions.congressRepealLegislation.call,
      congressActions.congressProposeRepealLegislation.call,
      congressActions.getCandidates.call,
      congressActions.getMembers.call,
      congressActions.getMotions.call,
      congressActions.getRunnersUp.call,
      congressActions.voteAtMotions.call,
      congressActions.getTreasuryInfo.call,
      congressActions.approveTreasurySpend.call,
      congressActions.unapproveTreasurySpend.call,
      congressActions.congressDemocracyBlacklist.call,
      congressActions.renounceCandidacy.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),
    [combineActions(
      congressActions.applyForCongress.failure,
      congressActions.approveTreasurySpend.failure,
      congressActions.closeMotion.failure,
      congressActions.congressAmendLegislation.failure,
      congressActions.congressAmendLegislationViaReferendum.failure,
      congressActions.congressProposeLegislation.failure,
      congressActions.congressProposeLegislationViaReferendum.failure,
      congressActions.congressRepealLegislation.failure,
      congressActions.congressProposeRepealLegislation.failure,
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
      congressActions.congressDemocracyBlacklist.failure,
      congressActions.congressDemocracyBlacklist.success,
      congressActions.renounceCandidacy.failure,
      congressActions.renounceCandidacy.success,
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
    [congressActions.getWallet.success]: (state, action) => ({
      ...state,
      walletInfo: action.payload,
    }),
    [congressActions.getAdditionalAssets.success]: (state, action) => ({
      ...state,
      additionalAssets: action.payload,
    }),
  },
  initialState,
);

export default congressReducer;
