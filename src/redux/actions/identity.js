import { createActions } from 'redux-actions';

export const {
  setIdentity,
  getIdentity,
  getIdentityMotions,
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
  GET_IDENTITY_OF: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_IDENTITY_MOTIONS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
