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

const selectorMyContracts = createSelector(
  contractsReducer,
  (reducer) => reducer.myContracts,
);

const selectorSingleContract = createSelector(
  contractsReducer,
  (reducer) => reducer.singleContract,
);

const selectorSignatures = createSelector(
  contractsReducer,
  (reducer) => reducer.signatures,
);

export {
  selectorContracts,
  selectorIsContractsLoading,
  selectorIsUserJudgde,
  selectorIdentityContracts,
  selectorMyContracts,
  selectorSingleContract,
  selectorSignatures,
};
