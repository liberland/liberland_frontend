import { handleActions, combineActions } from 'redux-actions';
import {
  authActions,
} from '../actions';

const initialState = {
  user: null,
  isSignInFetching: false,
  isSessionVerified: false,
};

const userReducer = handleActions(
  {
    [combineActions(
      authActions.signIn.success,
      authActions.signUp.success,
    )]: (state, action) => ({
      ...state,
      user: action.payload || state.user,
    }),
    [combineActions(
      authActions.signOut.success,
    )]: (state) => ({
      ...state,
      user: initialState.user,
    }),
    [authActions.verifySession.success]: (state, action) => ({
      ...state,
      isSessionVerified: true,
      user: action.payload,
    }),
    [authActions.verifySession.failure]: (state) => ({
      ...state,
      isSessionVerified: true,
    }),
    [authActions.signIn.call]: (state) => ({
      ...state,
      isSignInFetching: true,
    }),
    [combineActions(
      authActions.signIn.success,
      authActions.signIn.failure,
    )]: (state) => ({
      ...state,
      isSignInFetching: false,
    }),
  },
  initialState,
);

export default userReducer;
