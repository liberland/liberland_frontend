import { createActions } from 'redux-actions';

export const {
  payout,
  getPendingRewards,
  getInfo,
  getSlashes,
  setSessionKeys,
  getPayee,
  setPayee,
  getNominators,
  getStakerRewards,
  validate,
  chill,
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
  GET_PAYEE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_PAYEE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_NOMINATORS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_STAKER_REWARDS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  VALIDATE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CHILL: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
