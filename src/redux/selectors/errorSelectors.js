import { createSelector } from 'reselect';

const errorsReducer = (state) => state.errors;

const selectSignIn = createSelector(
  errorsReducer,
  (reducer) => reducer.signIn,
);

const selectSignUp = createSelector(
  errorsReducer,
  (reducer) => reducer.signUp,
);

export {
  selectSignIn,
  selectSignUp,
};
