import { handleActions, combineActions } from 'redux-actions';
import { financesActions } from '../actions';

const initialState = {
  loading: false,
  finances: null,
};

const financesReducer = handleActions(
  {
    // These two were separate handlers for the same action. An object has
    // one value per key, so the later one simply replaced the earlier and
    // `loading` was never set to true at all — nothing could tell a request
    // in flight from one that came back empty.
    [financesActions.getFinances.call]: (state) => ({
      ...state,
      loading: true,
      finances: null,
    }),

    [combineActions(
      financesActions.getFinances.success,
      financesActions.getFinances.failure,
    )]: (state) => ({
      ...state,
      loading: initialState.loading,
    }),

    [financesActions.getFinances.success]: (state, action) => ({
      ...state,
      finances: action.payload,
    }),
  },
  initialState,
);

export default financesReducer;
