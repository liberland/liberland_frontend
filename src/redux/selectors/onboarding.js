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

const selectorIneligibleForComplimentaryLLDIsLoading = createSelector(
  onboardingReducer,
  (reducer) => reducer.isLoading,
);

export {
  selectorEligibleForComplimentaryLLD,
  selectorIneligibleForComplimentaryLLDReason,
  selectorIneligibleForComplimentaryLLDIsLoading,
};
