import { createActions } from 'redux-actions';

export const {
  setIdentity,
  getIdentity,
  getIdentityMotions,
  getX,
} = createActions({
  SET_IDENTITY: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_IDENTITY: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_IDENTITY_MOTIONS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_X: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
