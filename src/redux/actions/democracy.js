import { createActions } from 'redux-actions';

export const {
  getDemocracy,
  secondProposal,
  voteOnReferendum,
  propose,
  voteForCongress,
  delegate,
  undelegate
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
  VOTE_ON_REFERENDUM: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  PROPOSE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  VOTE_FOR_CONGRESS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  DELEGATE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  UNDELEGATE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
