import { createActions } from 'redux-actions';

export const {
  getCurrentBlockNumber,
  getPeriodAndVotingDuration,
  setElectionsBlock,
  updateDateElections,
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
  SET_ELECTIONS_BLOCK: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  UPDATE_DATE_ELECTIONS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
