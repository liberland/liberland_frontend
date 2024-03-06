import { createSelector } from 'reselect';

const contractsReducer = (state) => state.contracts;

const selectorContracts = createSelector(
  contractsReducer,
  (reducer) => reducer.contracts,
);

const selectorIsUserJudgde = createSelector(
  contractsReducer,
  (reducer) => reducer.isUserJudge,
);

const selectorIsContractsLoading = createSelector(
  contractsReducer,
  (reducer) => reducer.loading,
);

const selectorIdentityContracts = createSelector(
  contractsReducer,
  (reducer) => reducer.names,
);

export {
  selectorContracts,
  selectorIsContractsLoading,
  selectorIsUserJudgde,
  selectorIdentityContracts,
};
