import { createActions } from 'redux-actions';

export const {
  getFinances,
} = createActions({
  GET_FINANCES: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
