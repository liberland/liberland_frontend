import { createActions } from 'redux-actions';

export const {
  addMyDraft,
  getMyProposals,
} = createActions({
  ADD_MY_DRAFT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_MY_PROPOSALS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
