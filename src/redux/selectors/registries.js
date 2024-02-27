import { createSelector } from 'reselect';

const registriesReducer = (state) => state.registries;

export const registries = createSelector(
  registriesReducer,
  (reducer) => reducer.officialUserRegistryEntries,
);

export const allRegistries = createSelector(
  registriesReducer,
  (reducer) => reducer.officialRegistryEntries,
);

export const isGetRegistries = createSelector(
  registriesReducer,
  (reducer) => reducer.isGetRegistries,
);
