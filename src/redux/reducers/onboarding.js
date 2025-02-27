import { handleActions, combineActions } from 'redux-actions';
import { onBoardingActions } from '../actions';

const initialState = {
  isEligibleForComplimentaryLLD: false,
  ineligibleForComplimentaryLLDReason: null,
  isSkipOnBoarding: true,
  unobtrusive: false,
  isLoading: false,
  claimed: false,
  isResident: false,
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

  [onBoardingActions.getEligibleForComplimentaryLld.call]: (state) => (
    {
      ...state,
      unobtrusive: true,
    }
  ),

  [onBoardingActions.getEligibleForComplimentaryLld.success]: (state, action) => ({
    ...state,
    isEligibleForComplimentaryLLD: action.payload.isEligibleForComplimentaryLLD,
    ineligibleForComplimentaryLLDReason: action.payload.ineligibleForComplimentaryLLDReason,
    isSkipOnBoarding: action.payload.isSkipOnBoarding,
    isResident: action.payload.isResident,
  }),

  [combineActions(
    onBoardingActions.claimComplimentaryLld.call,
    onBoardingActions.claimComplimentaryLld.failure,
    onBoardingActions.claimComplimentaryLld.clear,
  )]: (state) => ({
    ...state,
    claimed: false,
  }),

  [onBoardingActions.claimComplimentaryLld.success]: (state) => ({
    ...state,
    claimed: true,
  }),

  [combineActions(
    onBoardingActions.getEligibleForComplimentaryLld.success,
    onBoardingActions.claimComplimentaryLld.success,
    onBoardingActions.getEligibleForComplimentaryLld.failure,
    onBoardingActions.claimComplimentaryLld.failure,
  )]: (state) => ({
    ...state,
    isLoading: initialState.isLoading,
    unobtrusive: initialState.unobtrusive,
  }),
}, initialState);

export default onboardingReducer;
