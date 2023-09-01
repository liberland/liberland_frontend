import { handleActions, combineActions } from 'redux-actions';
import { validatorActions } from '../actions';

const initialState = {
  loading: false,
  pendingRewards: null,
  stakerRewards: null,
  info: {
    stash: null,
    isSessionValidator: null,
    isNextSessionValidator: null,
    isStakingValidator: null,
    isNominator: null,
  },
  appliedSlashes: null,
  unappliedSlashes: null,
  payee: null,
  nominators: [],
};

const validatorReducer = handleActions({
  [combineActions(
    validatorActions.payout.call,
    validatorActions.validate.call,
    validatorActions.chill.call,
    validatorActions.createValidator.call,
    validatorActions.getPendingRewards.call,
    validatorActions.getInfo.call,
    validatorActions.getSlashes.call,
    validatorActions.setSessionKeys.call,
    validatorActions.getPayee.call,
    validatorActions.setPayee.call,
    validatorActions.getNominators.call,
    validatorActions.getStakerRewards.call,
    validatorActions.stakeLld.call,
  )]: (state) => ({
    ...state,
    loading: true,
  }),
  [combineActions(
    validatorActions.payout.failure,
    validatorActions.validate.failure,
    validatorActions.chill.failure,
    validatorActions.createValidator.failure,
    validatorActions.getPendingRewards.success,
    validatorActions.getPendingRewards.failure,
    validatorActions.getInfo.success,
    validatorActions.getInfo.failure,
    validatorActions.getSlashes.success,
    validatorActions.getSlashes.failure,
    validatorActions.setSessionKeys.success,
    validatorActions.setSessionKeys.failure,
    validatorActions.getPayee.success,
    validatorActions.getPayee.failure,
    validatorActions.setPayee.failure,
    validatorActions.getNominators.success,
    validatorActions.getNominators.failure,
    validatorActions.getStakerRewards.success,
    validatorActions.getStakerRewards.failure,
    validatorActions.stakeLld.failure,
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
  [validatorActions.getPayee.success]: (state, action) => ({
    ...state,
    payee: action.payload.payee,
  }),
  [validatorActions.getNominators.success]: (state, action) => ({
    ...state,
    nominators: action.payload.nominators,
  }),
  [validatorActions.getStakerRewards.success]: (state, action) => ({
    ...state,
    stakerRewards: action.payload.stakerRewards,
  }),
}, initialState);

export default validatorReducer;
