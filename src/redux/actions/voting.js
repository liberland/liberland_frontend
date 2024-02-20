import { createActions } from 'redux-actions';

export const {
  addMyCandidacy,
  addCandidacyToElectoralSheet,
  sendElectoralSheet,
  setIsVotingInProgress,
  getLiberStakeAmount,
} = createActions({
  ADD_MY_CANDIDACY: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  ADD_CANDIDACY_TO_ELECTORAL_SHEET: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SEND_ELECTORAL_SHEET: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_IS_VOTING_IN_PROGRESS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_LIBER_STAKE_AMOUNT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
