import { handleActions, combineActions } from 'redux-actions';
import { onBoardingActions } from '../actions';

const initialState = {
  isEligibleForComplimentaryLLD: false,
  ineligibleForComplimentaryLLDReason: null,
  isSkipOnBoarding: true,
  isLoading: false,
};

const onboardingReducer = handleActions({
  [combineActions(
    onBoardingActions.getEligibleForComplimentaryLld.call,
    onBoardingActions.claimComplimentaryLld.call,
  )]: (state) => (
    {
      ...state,
      isLoading: true,
    }
  ),

  [onBoardingActions.claimComplimentaryLld.success]: (state) => ({
    ...state,
    isLoading: false,
  }),
  [onBoardingActions.getEligibleForComplimentaryLld.success]: (state, action) => ({
    ...state,
    isEligibleForComplimentaryLLD: action.payload.isEligibleForComplimentaryLLD,
    ineligibleForComplimentaryLLDReason: action.payload.ineligibleForComplimentaryLLDReason,
    isSkipOnBoarding: action.payload.isSkipOnBoarding,
    isLoading: false,
  }),

  [combineActions(
    onBoardingActions.getEligibleForComplimentaryLld.failure,
    onBoardingActions.claimComplimentaryLld.failure,
  )]: (state) => ({
    ...state,
    isLoading: initialState.isLoading,
  }),
}, initialState);

export default onboardingReducer;
