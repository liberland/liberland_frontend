import { createActions } from 'redux-actions';

export const {
  getLegislation,
} = createActions({
  GET_LEGISLATION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
