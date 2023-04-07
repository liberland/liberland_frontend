import { createActions } from 'redux-actions';

export const {
  getLegislation,
  castVeto,
  revertVeto,
} = createActions({
  GET_LEGISLATION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CAST_VETO: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REVERT_VETO: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
