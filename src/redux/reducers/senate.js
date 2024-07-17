import { handleActions, combineActions } from 'redux-actions';
import { BN_ZERO } from '@polkadot/util';
import { senateActions } from '../actions';

const initialState = {
  loading: false,
  members: [],
  motions: [],
  codeName: 'senateAccount',
  additionalAssets: [],
  senateWalletInfo: {
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
  scheduledCalls: [],
};

const senateReducer = handleActions(
  {
    [combineActions(
      senateActions.senateGetMotions.call,
      senateActions.senateGetWallet.call,
      senateActions.senateGetAdditionalAssets.call,
      senateActions.senateCloseMotion.call,
      senateActions.senateVoteAtMotions.call,
      senateActions.senateGetCongressSpending.call,
      senateActions.senateProposeCongressMotionClose.call,
      senateActions.senateProposeCloseMotion.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),
    [combineActions(
      senateActions.senateCloseMotion.failure,
      senateActions.senateCloseMotion.success,
      senateActions.senateVoteAtMotions.failure,
      senateActions.senateVoteAtMotions.success,
      senateActions.senateProposeCongressMotionClose.failure,
      senateActions.senateProposeCongressMotionClose.success,
      senateActions.senateProposeCloseMotion.failure,
      senateActions.senateProposeCloseMotion.success,
      senateActions.senateGetMotions.success,
      senateActions.senateGetWallet.success,
      senateActions.senateGetWallet.failure,
      senateActions.senateGetCongressSpending.success,
      senateActions.senateGetCongressSpending.failure,
      senateActions.senateGetAdditionalAssets.success,
      senateActions.senateGetAdditionalAssets.failure,
    )]: (state) => ({
      ...state,
      loading: false,
    }),
    [senateActions.senateGetMotions.success]: (state, action) => ({
      ...state,
      motions: action.payload,
    }),
    [senateActions.senateGetWallet.success]: (state, action) => ({
      ...state,
      senateWalletInfo: action.payload,
    }),
    [senateActions.senateGetAdditionalAssets.success]: (state, action) => ({
      ...state,
      additionalAssets: action.payload,
    }),
    [senateActions.senateGetCongressSpending.success]: (state, action) => ({
      ...state,
      scheduledCalls: action.payload,
    }),
  },
  initialState,
);

export default senateReducer;
