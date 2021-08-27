import { combineActions, handleActions } from 'redux-actions';
import { assemblyActions } from '../actions';

const initialState = {
  assembly: {
    isDraftSend: false,
  },
  proposals: [],
};

const assemblyReducer = handleActions(
  {
    [combineActions(
      assemblyActions.addMyDraft.call,
      assemblyActions.getMyProposals.call,
    )]: (state) => ({
      ...state,
      isDraftSend: true,
    }),
    [assemblyActions.getMyProposals.success]: (state, action) => ({
      ...state,
      proposals: action.payload,
    }),
    [combineActions(
      assemblyActions.getMyProposals.failure,
      assemblyActions.addMyDraft.success,
      assemblyActions.addMyDraft.failure,
    )]: (state) => ({
      ...state,
      isDraftSend: false,
    }),
  },
  initialState,
);

export default assemblyReducer;
