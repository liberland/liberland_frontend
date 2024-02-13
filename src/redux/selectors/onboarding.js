import { createSelector } from 'reselect';

const onboardingReducer = (state) => state.onboarding;
const selectorEligibleForComplimentaryLLD = createSelector(
  onboardingReducer,
  (reducer) => reducer.isEligibleForComplimentaryLLD,
);
const selectorIneligibleForComplimentaryLLDReason = createSelector(
  onboardingReducer,
  (reducer) => reducer.ineligibleForComplimentaryLLDReason,
);

const selectorIsSkipOnBoarding = createSelector(
  onboardingReducer,
  (reducer) => reducer.isSkipOnBoarding,
);

export {
  selectorEligibleForComplimentaryLLD,
  selectorIneligibleForComplimentaryLLDReason,
  selectorIsSkipOnBoarding,
};
