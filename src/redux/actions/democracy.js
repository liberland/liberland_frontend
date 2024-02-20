import { createActions } from 'redux-actions';

export const {
  delegate,
  getDemocracy,
  propose,
  proposeAmendLegislation,
  undelegate,
  voteForCongress,
  voteOnReferendum,
  citizenProposeRepealLegislation,
} = createActions({
  DELEGATE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_DEMOCRACY: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  PROPOSE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  PROPOSE_AMEND_LEGISLATION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  UNDELEGATE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  VOTE_FOR_CONGRESS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  VOTE_ON_REFERENDUM: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CITIZEN_PROPOSE_REPEAL_LEGISLATION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
