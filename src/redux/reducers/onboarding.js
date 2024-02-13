import { handleActions } from 'redux-actions';
import { onBoardingActions } from '../actions';

const initialState = {
  isEligibleForComplimentaryLLD: false,
  ineligibleForComplimentaryLLDReason: null,
  isSkipOnBoarding: true,
};

const onboardingReducer = handleActions({
  [onBoardingActions.getEligibleForComplimentaryLld.success]: (state, action) => ({
    ...state,
    isEligibleForComplimentaryLLD: action.payload.isEligibleForComplimentaryLLD,
    ineligibleForComplimentaryLLDReason: action.payload.ineligibleForComplimentaryLLDReason,
    isSkipOnBoarding: action.payload.isSkipOnBoarding,
  }),
}, initialState);

export default onboardingReducer;
