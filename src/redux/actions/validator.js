import { createActions } from 'redux-actions';

export const {
  payout,
  getPendingRewards,
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
});
