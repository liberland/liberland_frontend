import { createActions } from 'redux-actions';

export const {
  setIdentity,
  getIdentity,
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
});
