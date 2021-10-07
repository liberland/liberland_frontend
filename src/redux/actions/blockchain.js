import { createActions } from 'redux-actions';

export const {
  getCurrentBlockNumber,
  getPeriodAndVotingDuration,
} = createActions({
  GET_CURRENT_BLOCK_NUMBER: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_PERIOD_AND_VOTING_DURATION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
