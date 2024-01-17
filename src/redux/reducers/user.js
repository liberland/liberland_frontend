import { handleActions, combineActions } from 'redux-actions';
import {
  authActions,
} from '../actions';

const initialState = {
  user: null,
  isSessionVerified: false,
};

const userReducer = handleActions(
  {
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
    [authActions.verifySession.failure]: (state, action) => ({
      ...state,
      isSessionVerified: true,
      url: action.payload,
    }),
    [authActions.guidedStep.success]: (state, action) => ({
      ...state,
      isSessionVerified: true,
      guidedStep: action.payload,
    }),
    [authActions.guidedStep.failure]: (state, action) => ({
      ...state,
      isSessionVerified: true,
      url: action.payload,
    }),
  },
  initialState,
);

export default userReducer;
