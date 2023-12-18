import { createActions } from 'redux-actions';

export const {
  setIdentity,
  getIdentity,
  getIdentities,
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
  GET_IDENTITIES: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
