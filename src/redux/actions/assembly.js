import { createActions } from 'redux-actions';

export const {
  addMyDraft,
  // editMyDraft,
  // submitMyDraft,
} = createActions({
  ADD_MY_DRAFT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
