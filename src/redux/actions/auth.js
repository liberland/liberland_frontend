import { createActions } from 'redux-actions';

export const {
  signOut,
  signUp,
  verifySession,
} = createActions({
  SIGN_OUT: {
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
});
