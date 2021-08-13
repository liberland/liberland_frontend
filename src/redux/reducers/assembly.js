import { combineActions, handleActions } from 'redux-actions';
import { assemblyActions } from '../actions';

const initialState = {
  assembly: {
    isDraftSend: false,
  },
};

const assemblyReducer = handleActions(
  {
    [assemblyActions.addMyDraft.call]: (state) => ({
      ...state,
      isDraftSend: true,
    }),
    [combineActions(
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
