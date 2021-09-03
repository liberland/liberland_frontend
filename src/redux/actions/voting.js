import { createActions } from 'redux-actions';

export const {
  addMyCandidacy,
  getListOfCandidacy,
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
});
