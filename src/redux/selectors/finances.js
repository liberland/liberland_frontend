import { createSelector } from 'reselect';

const financesReducer = (state) => state.finances;

const selectorFinances = createSelector(
  financesReducer,
  (reducer) => reducer.finances,
);

const selectorIsLoading = createSelector(
  financesReducer,
  (reducer) => reducer.loading,
);

export { selectorFinances, selectorIsLoading };
