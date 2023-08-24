import { handleActions, combineActions } from 'redux-actions';
import { validatorActions } from '../actions';

const initialState = {
  loading: false,
  pendingRewards: null,
  info: {
    stash: null,
    isSessionValidator: null,
    isNextSessionValidator: null,
    isStakingValidator: null,
    isNominator: null,
  },
};

const validatorReducer = handleActions({
  [combineActions(
    validatorActions.payout.call,
    validatorActions.getPendingRewards.call,
    validatorActions.getInfo.call,
  )]: (state) => ({
    ...state,
    loading: true,
  }),
  [combineActions(
    validatorActions.payout.success,
    validatorActions.payout.failure,
    validatorActions.getPendingRewards.success,
    validatorActions.getPendingRewards.failure,
    validatorActions.getInfo.success,
    validatorActions.getInfo.failure,
  )]: (state) => ({
    ...state,
    loading: false,
  }),
  [validatorActions.getPendingRewards.success]: (state, action) => ({
    ...state,
    pendingRewards: action.payload.pendingRewards,
  }),
  [validatorActions.getInfo.success]: (state, action) => ({
    ...state,
    info: action.payload,
  }),
}, initialState);

export default validatorReducer;
