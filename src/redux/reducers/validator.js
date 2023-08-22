import { handleActions, combineActions } from 'redux-actions';
import { validatorActions } from '../actions';

const initialState = {
  loading: false,
  pendingRewards: null,
};

const officesReducer = handleActions({
  [combineActions(
    validatorActions.payout.call,
    validatorActions.getPendingRewards.call,
  )]: (state) => ({
    ...state,
    loading: true,
  }),
  [combineActions(
    validatorActions.payout.success,
    validatorActions.payout.failure,
    validatorActions.getPendingRewards.success,
    validatorActions.getPendingRewards.failure,
  )]: (state) => ({
    ...state,
    loading: false,
  }),
  [validatorActions.getPendingRewards.success]: (state, action) => ({
    ...state,
    pendingRewards: action.payload.pendingRewards,
  }),
}, initialState);

export default officesReducer;
