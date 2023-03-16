import { createSelector } from 'reselect';

const registriesReducer = (state) => state.registries;

const registries = createSelector(
  registriesReducer,
  (reducer) => reducer.officialUserRegistryEntries,
);

const registryCRUDAction = createSelector(
  registriesReducer,
  (reducer) => reducer.registryCRUDAction,
)

export {
  registries,
  registryCRUDAction
};
