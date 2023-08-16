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
  appliedSlashes: null,
  unappliedSlashes: null,
};

const validatorReducer = handleActions({
  [combineActions(
    validatorActions.payout.call,
    validatorActions.getPendingRewards.call,
    validatorActions.getInfo.call,
    validatorActions.getSlashes.call,
    validatorActions.setSessionKeys.call,
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
    validatorActions.getSlashes.success,
    validatorActions.getSlashes.failure,
    validatorActions.setSessionKeys.success,
    validatorActions.setSessionKeys.failure,
  )]: (state) => ({
    ...state,
    loading: false,
  }),
  [validatorActions.getPendingRewards.call]: (state) => ({
    ...state,
    pendingRewards: initialState.pendingRewards,
  }),
  [validatorActions.getPendingRewards.success]: (state, action) => ({
    ...state,
    pendingRewards: action.payload.pendingRewards,
  }),
  [validatorActions.getInfo.success]: (state, action) => ({
    ...state,
    info: action.payload,
  }),
  [validatorActions.getSlashes.call]: (state) => ({
    ...state,
    appliedSlashes: initialState.appliedSlashes,
    unappliedSlashes: initialState.unappliedSlashes,
  }),
  [validatorActions.getSlashes.success]: (state, action) => ({
    ...state,
    appliedSlashes: action.payload.appliedSlashes,
    unappliedSlashes: action.payload.unappliedSlashes,
  }),
}, initialState);

export default validatorReducer;
