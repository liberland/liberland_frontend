import { handleActions, combineActions } from 'redux-actions';
import { BN_ZERO } from '@polkadot/util';
import { congressActions } from '../actions';
import { spendingTableMerge } from '../../utils/spendingTable';

const initialState = {
  codeName: 'councilAccount',
  walletInfo: {
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
  allBalance: [],
  candidates: [],
  loading: false,
  unobtrusive: false,
  members: [],
  motions: [],
  runnersUp: [],
  treasury: {
    proposals: {},
    budget: BN_ZERO,
    period: BN_ZERO,
  },
  congressSpending: null,
  spendingCount: 0,
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
      congressActions.getAllBalanceForCongress.call,
      congressActions.congressBudgetPropose.call,
      congressActions.congressSpending.call,
      congressActions.congressSpendingCount.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),
    [combineActions(
      congressActions.getCandidates.call,
      congressActions.getMembers.call,
      congressActions.getMotions.call,
      congressActions.getRunnersUp.call,
      congressActions.getTreasuryInfo.call,
      congressActions.getAllBalanceForCongress.call,
      congressActions.congressSpending.call,
      congressActions.congressSpendingCount.call,
    )]: (state) => ({
      ...state,
      unobtrusive: true,
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
      congressActions.getAllBalanceForCongress.failure,
      congressActions.getAllBalanceForCongress.success,
      congressActions.congressBudgetPropose.failure,
      congressActions.congressBudgetPropose.success,
      congressActions.congressSpending.success,
      congressActions.congressSpending.failure,
      congressActions.congressSpendingCount.success,
      congressActions.congressSpendingCount.failure,
    )]: (state) => ({
      ...state,
      loading: false,
      unobtrusive: false,
    }),
    [congressActions.getAllBalanceForCongress.success]: (state, action) => ({
      ...state,
      allBalance: action.payload,
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
    [congressActions.congressGetWallet.success]: (state, action) => ({
      ...state,
      walletInfo: action.payload,
    }),
    [congressActions.congressGetAdditionalAssets.success]: (state, action) => ({
      ...state,
      additionalAssets: action.payload,
    }),
    [congressActions.congressSpending.success]: (state, action) => ({
      ...state,
      congressSpending: spendingTableMerge(action.payload, state.congressSpending),
    }),
    [congressActions.congressSpendingCount.success]: (state, action) => ({
      ...state,
      spendingCount: action.payload.count,
    }),
  },
  initialState,
);

export default congressReducer;
