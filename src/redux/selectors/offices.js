import { createSelector } from 'reselect';

const officesReducer = (state) => state.offices;

const selectorIdentity = createSelector(
  officesReducer,
  (reducer) => reducer.identity,
);

const selectorCompanyRequest = createSelector(
  officesReducer,
  (reducer) => reducer.companyRequest,
);

const selectorCompanyRegistration = createSelector(
  officesReducer,
  (reducer) => reducer.companyRegistration,
);

const selectorIsLoading = createSelector(
  officesReducer,
  (reducer) => reducer.loading,
);

const selectorIsUnobtrusive = createSelector(
  officesReducer,
  (reducer) => reducer.unobtrusive,
);

const selectorBalances = createSelector(
  officesReducer,
  (reducer) => reducer.balances,
);

const selectorBackendAddressLLMBalance = createSelector(
  officesReducer,
  (reducer) => reducer.backendAddressLLMBalance,
);

const selectorPallets = createSelector(
  officesReducer,
  (reducer) => reducer.pallets,
);

const selectorPendingAdditionalMerits = createSelector(
  officesReducer,
  (reducer) => reducer.pendingAdditionalMerits,
);

const selectorTaxesPayers = createSelector(
  officesReducer,
  (reducer) => reducer.taxPayers,
);

export {
  selectorIdentity,
  selectorCompanyRequest,
  selectorCompanyRegistration,
  selectorIsLoading,
  selectorBalances,
  selectorBackendAddressLLMBalance,
  selectorPallets,
  selectorPendingAdditionalMerits,
  selectorIsUnobtrusive,
  selectorTaxesPayers,
};
