import { combineActions, handleActions } from 'redux-actions';
import { assemblyActions } from '../actions';

const initialState = {
  isDraftSend: false,
  proposals: [],
  allSendProposals: [],
  constitutionalChange: [],
  legislation: [],
  decision: [],
  textPdf: [],
};

const assemblyReducer = handleActions(
  {
    [combineActions(
      assemblyActions.addMyDraft.call,
      assemblyActions.getMyProposals.call,
      assemblyActions.submitProposal.call,
      assemblyActions.updateAllProposals.call,
      assemblyActions.getAllSendProposals.call,
      assemblyActions.voteByProposal.call,
      assemblyActions.getConstitutionalChange.call,
      assemblyActions.getLegislation.call,
      assemblyActions.getDecision.call,
      assemblyActions.getTextPdf.call,
    )]: (state) => ({
      ...state,
      isDraftSend: true,
    }),
    [assemblyActions.getMyProposals.success]: (state, action) => ({
      ...state,
      proposals: action.payload,
      isDraftSend: false,
    }),
    [assemblyActions.updateAllProposals.success]: (state, action) => ({
      ...state,
      allSendProposals: action.payload,
      isDraftSend: false,
    }),
    [assemblyActions.getConstitutionalChange.success]: (state, action) => ({
      ...state,
      constitutionalChange: action.payload,
      isDraftSend: false,
    }),
    [assemblyActions.getLegislation.success]: (state, action) => ({
      ...state,
      legislation: action.payload,
      isDraftSend: false,
    }),
    [assemblyActions.getDecision.success]: (state, action) => ({
      ...state,
      decision: action.payload,
      isDraftSend: false,
    }),
    [assemblyActions.getTextPdf.success]: (state, action) => ({
      ...state,
      textPdf: action.payload,
      isDraftSend: false,
    }),
    [combineActions(
      assemblyActions.getMyProposals.failure,
      assemblyActions.addMyDraft.success,
      assemblyActions.addMyDraft.failure,
      assemblyActions.submitProposal.success,
      assemblyActions.submitProposal.failure,
      assemblyActions.updateAllProposals.failure,
      assemblyActions.voteByProposal.success,
      assemblyActions.voteByProposal.failure,
      assemblyActions.getConstitutionalChange.failure,
      assemblyActions.getLegislation.failure,
      assemblyActions.getDecision.failure,
      assemblyActions.getTextPdf.failure,
    )]: (state) => ({
      ...state,
      isDraftSend: false,
    }),
  },
  initialState,
);

export default assemblyReducer;
