import { createSelector } from 'reselect';

const legislationReducer = (state) => state.legislation;

const legislation = createSelector(
  legislationReducer,
  (reducer) => reducer.legislation,
);

const gettingLegislation = createSelector(
  legislationReducer,
  (reducer) => reducer.isGetLegislation,
);

const citizenCount = createSelector(
  legislationReducer,
  (reducer) => reducer.citizenCount,
);

export {
  legislation,
  gettingLegislation,
  citizenCount,
};
