import { createSelector } from 'reselect';

const legislationReducer = (state) => state.legislation;

const legislation = createSelector(
  legislationReducer,
  (reducer) => reducer.legislation,
);

export {
  legislation,
};
