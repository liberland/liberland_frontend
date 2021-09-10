import { combineActions, handleActions } from 'redux-actions';
import { assemblyActions } from '../actions';

const initialState = {
  isDraftSend: false,
  proposals: [],
};

const assemblyReducer = handleActions(
  {
    [combineActions(
      assemblyActions.addMyDraft.call,
      assemblyActions.getMyProposals.call,
      assemblyActions.submitProposal.call,
    )]: (state) => ({
      ...state,
      isDraftSend: true,
    }),
    [assemblyActions.getMyProposals.success]: (state, action) => ({
      ...state,
      proposals: action.payload,
      isDraftSend: false,
    }),
    [combineActions(
      assemblyActions.getMyProposals.failure,
      assemblyActions.addMyDraft.success,
      assemblyActions.addMyDraft.failure,
      assemblyActions.submitProposal.success,
      assemblyActions.submitProposal.failure,
    )]: (state) => ({
      ...state,
      isDraftSend: false,
    }),
  },
  initialState,
);

export default assemblyReducer;
