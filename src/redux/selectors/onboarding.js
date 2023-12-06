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

export {
  selectorEligibleForComplimentaryLLD,
  selectorIneligibleForComplimentaryLLDReason,
};
