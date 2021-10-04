import { createActions } from 'redux-actions';

export const {
  getCurrentLaws,
} = createActions({
  GET_CURRENT_LAWS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
