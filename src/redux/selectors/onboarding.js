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
const selectorIneligibleForComplimentaryLLDIsLoading = createSelector(
  onboardingReducer,
  (reducer) => reducer.isLoading,
);

const selectorIsResident = createSelector(
  onboardingReducer,
  (reducer) => reducer.isResident,
);

export {
  selectorEligibleForComplimentaryLLD,
  selectorIneligibleForComplimentaryLLDReason,
  selectorIsSkipOnBoarding,
  selectorIneligibleForComplimentaryLLDIsLoading,
  selectorIsResident,
};
