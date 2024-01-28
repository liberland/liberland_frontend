import { handleActions } from 'redux-actions';
import { authActions } from '../actions';

const initialState = {
  signIn: null,
  signUp: null,
};

const errorsReducer = handleActions(
  {
    [authActions.signUp.failure]: (state, action) => ({
      ...state,
      signUp: action.payload,
    }),
  },
  initialState,
);

export default errorsReducer;
