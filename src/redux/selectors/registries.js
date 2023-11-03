import { createSelector } from 'reselect';

const registriesReducer = (state) => state.registries;

export const registries = createSelector(
  registriesReducer,
  (reducer) => reducer.officialUserRegistryEntries,
);

export const registryCRUDAction = createSelector(
  registriesReducer,
  (reducer) => reducer.registryCRUDAction,
);

export const isGetRegistries = createSelector(
  registriesReducer,
  (reducer) => reducer.isGetRegistries,
);
