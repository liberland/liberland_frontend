import { createSelector } from 'reselect';

const validatorReducer = (state) => state.validator;

export const isLoading = createSelector(
  validatorReducer,
  (reducer) => reducer.loading,
);

export const pendingRewards = createSelector(
  validatorReducer,
  (reducer) => reducer.pendingRewards,
);

export const info = createSelector(
  validatorReducer,
  (reducer) => reducer.info,
);

export const appliedSlashes = createSelector(
  validatorReducer,
  (reducer) => reducer.appliedSlashes,
);

export const unappliedSlashes = createSelector(
  validatorReducer,
  (reducer) => reducer.unappliedSlashes,
);

export const payee = createSelector(
  validatorReducer,
  (reducer) => reducer.payee,
);

export const nominators = createSelector(
  validatorReducer,
  (reducer) => reducer.nominators,
);

export const stakerRewards = createSelector(
  validatorReducer,
  (reducer) => reducer.stakerRewards,
);

export const bondingDuration = createSelector(
  validatorReducer,
  (reducer) => reducer.bondingDuration,
);

export const stakingData = createSelector(
  validatorReducer,
  (reducer) => ({
    stakingInfo: reducer.stakingInfo,
    sessionProgress: reducer.sessionProgress,
  }),
);
