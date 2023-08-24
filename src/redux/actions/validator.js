import { createActions } from 'redux-actions';

export const {
  payout,
  getPendingRewards,
  getInfo,
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
});
