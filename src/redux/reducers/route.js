import { combineActions, handleActions } from 'redux-actions';
import { routeActions } from '../actions';

const initialState = {
  isLoading: false,
  routeLink: null,
};

const routeReducer = handleActions({
  [combineActions(
    routeActions.changeRoute.call,
  )]: (state) => ({
    ...state,
    isLoading: true,
  }),
  [routeActions.changeRoute.success]: (state, action) => ({
    ...state,
    routeLink: action.payload,
  }),
  [combineActions(
    routeActions.changeRoute.failure,
    routeActions.changeRoute.success,
  )]: (state) => ({
    ...state,
    isLoading: initialState.isLoading,
  }),
}, initialState);

export default routeReducer;
