import { createActions } from 'redux-actions';

export const {
  addMyCandidacy,
  getListOfCandidacy,
  addCandidacyToElectoralSheet,
  sendElectoralSheet,
  setIsVotingInProgress,
  getMinistersList,
  getPeriodAndVotingDuration,
} = createActions({
  ADD_MY_CANDIDACY: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_LIST_OF_CANDIDACY: {
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
  GET_MINISTERS_LIST: {
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
