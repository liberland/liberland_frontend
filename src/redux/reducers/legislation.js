import { handleActions, combineActions } from 'redux-actions';
import { legislationActions } from '../actions';

const initialState = {
  legislation: [],
  isGetLegislation: false,
};

const legislationReducer = handleActions({
  [combineActions(
    legislationActions.getLegislation.call,
    legislationActions.castVeto.call,
    legislationActions.revertVeto.call
  )]: (state) => ({
    ...state,
    isGetLegislation: true,
  }),
  [combineActions(
    legislationActions.castVeto.failure,
    legislationActions.castVeto.success,
    legislationActions.getLegislation.failure,
    legislationActions.getLegislation.success,
    legislationActions.revertVeto.failure,
    legislationActions.revertVeto.success,
  )]: (state) => ({
    ...state,
    isGetLegislation: false,
  }),
  [legislationActions.getLegislation.call]: (state, action) => ({
    ...state,
    legislation: {
      [action.payload]: undefined,
    },
  }),
  [legislationActions.getLegislation.success]: (state, action) => ({
    ...state,
    legislation: {
      [action.payload.tier]: action.payload.legislation,
    },
  }),
}, initialState);

export default legislationReducer;
