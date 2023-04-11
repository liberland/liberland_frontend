import { createActions } from 'redux-actions';

export const {
  getLegislation,
  castVeto,
  revertVeto,
  getCitizenCount,
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
  GET_CITIZEN_COUNT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
