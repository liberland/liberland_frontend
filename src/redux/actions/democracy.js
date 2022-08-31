import { createActions } from 'redux-actions';

export const {
  getDemocracy,
  secondProposal,
} = createActions({
  GET_DEMOCRACY: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SECOND_PROPOSAL: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
