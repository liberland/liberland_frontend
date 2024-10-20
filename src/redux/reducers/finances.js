import { handleActions, combineActions } from 'redux-actions';
import { financesActions } from '../actions';

const initialState = {
  loading: false,
  finances: null,
};

const financesReducer = handleActions(
  {
    [financesActions.getFinances.call]: (state) => ({
      ...state,
      loading: true,
    }),

    [combineActions(
      financesActions.getFinances.success,
      financesActions.getFinances.failure,
    )]: (state) => ({
      ...state,
      loading: initialState.loading,
    }),

    [financesActions.getFinances.call]: (state) => ({
      ...state,
      finances: null,
    }),

    [financesActions.getFinances.success]: (state, action) => ({
      ...state,
      finances: action.payload,
    }),
  },
  initialState,
);

export default financesReducer;
