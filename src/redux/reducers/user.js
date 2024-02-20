import { handleActions, combineActions } from 'redux-actions';
import {
  authActions,
} from '../actions';

const initialState = {
  // null if not logged in, user data if logged in
  user: null,
  // false if we don't know if we're logged in yet
  isSessionReady: false,
  isLoading: false,
};

const userReducer = handleActions(
  {
    [combineActions(
      authActions.signOut.success,
    )]: (state) => ({
      ...state,
      user: initialState.user,
    }),
    [authActions.verifySession.call]: (state, action) => ({
      ...state,
      isLoading: true,
      user: action.payload,
    }),
    [authActions.verifySession.success]: (state, action) => ({
      ...state,
      isLoading: false,
      isSessionReady: true,
      user: action.payload,
    }),
    [authActions.verifySession.failure]: (state) => ({
      ...state,
      isLoading: false,
      isSessionReady: true,
    }),
  },
  initialState,
);

export default userReducer;
