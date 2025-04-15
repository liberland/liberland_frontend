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

const selectorIsLoading = createSelector(
  onboardingReducer,
  (reducer) => reducer.isLoading,
);

const selectorIsUnobtrusive = createSelector(
  onboardingReducer,
  (reducer) => reducer.unobtrusive,
);

const selectorIsClaimed = createSelector(
  onboardingReducer,
  (reducer) => reducer.claimed,
);

export {
  selectorIsLoading,
  selectorIsUnobtrusive,
  selectorEligibleForComplimentaryLLD,
  selectorIneligibleForComplimentaryLLDReason,
  selectorIsSkipOnBoarding,
  selectorIneligibleForComplimentaryLLDIsLoading,
  selectorIsResident,
  selectorIsClaimed,
};
