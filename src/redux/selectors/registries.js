import { createSelector } from 'reselect';

const registriesReducer = (state) => state.registries;

export const registries = createSelector(
  registriesReducer,
  (reducer) => reducer.officialUserRegistryEntries,
);

export const isGetRegistries = createSelector(
  registriesReducer,
  (reducer) => reducer.isGetRegistries,
);
