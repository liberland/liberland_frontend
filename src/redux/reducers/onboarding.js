import { handleActions } from 'redux-actions';
import { onBoardingActions } from '../actions';

const initialState = {
  isEligibleForComplimentaryLLD: false,
  ineligibleForComplimentaryLLDReason: null,
};

const onboardingReducer = handleActions({
  [onBoardingActions.getEligibleForComplimentaryLld.success]: (state, action) => ({
    ...state,
    isEligibleForComplimentaryLLD: action.payload.isEligibleForComplimentaryLLD,
    ineligibleForComplimentaryLLDReason: action.payload.ineligibleForComplimentaryLLDReason,
  }),
}, initialState);

export default onboardingReducer;