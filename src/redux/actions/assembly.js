import { createActions } from 'redux-actions';
// FIXME delete this and other assembly related files
export const {
  addMyDraft,
  submitProposal,
  getByHashes,
  getMyProposals,
  editDraft,
  deleteProposal,
  updateAllProposals,
  getAllSendProposals,
  voteByProposal,
  getConstitutionalChange,
  getLegislation,
  getDecision,
  setGotSomeError,
  getTextPdf,
} = createActions({
  ADD_MY_DRAFT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SUBMIT_PROPOSAL: {
    call: (id) => ({ id }),
    success: undefined,
    failure: undefined,
  },
  GET_BY_HASHES: {
    call: (hashes) => ({ hashes }),
    success: undefined,
    failure: undefined,
  },
  GET_MY_PROPOSALS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  EDIT_DRAFT: {
    call: (proposalData) => ({ data: proposalData }),
    success: undefined,
    failure: undefined,
  },
  DELETE_PROPOSAL: {
    call: (id) => ({ id }),
    success: undefined,
    failure: undefined,
  },
  UPDATE_ALL_PROPOSALS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_ALL_SEND_PROPOSALS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  VOTE_BY_PROPOSAL: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_CONSTITUTIONAL_CHANGE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_LEGISLATION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_DECISION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_GOT_SOME_ERROR: {
    failure: undefined,
  },
  GET_TEXT_PDF: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
