import { createActions } from 'redux-actions';

export const {
  changeRoute,
} = createActions({
  CHANGE_ROUTE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
