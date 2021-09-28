import { createActions } from 'redux-actions';

export const {
  signOut,
  signIn,
  signUp,
  verifySession,
  initGetDataFromNode,
} = createActions({
  SIGN_OUT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SIGN_IN: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SIGN_UP: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  VERIFY_SESSION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  INIT_GET_DATA_FROM_NODE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
