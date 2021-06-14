import { handleActions } from 'redux-actions';
import { authActions } from '../actions';

const initialState = {
  signIn: null,
  signUp: null,
};

const errorsReducer = handleActions(
  {
    [authActions.signIn.failure]: (state, action) => ({
      ...state,
      signIn: action.payload,
    }),
    [authActions.signUp.failure]: (state, action) => ({
      ...state,
      signUp: action.payload,
    }),
  },
  initialState,
);

export default errorsReducer;
