import { createActions } from 'redux-actions';

export const {
  payout,
  getPendingRewards,
  getInfo,
  getSlashes,
  setSessionKeys,
} = createActions({
  PAYOUT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_PENDING_REWARDS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_INFO: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_SLASHES: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_SESSION_KEYS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
