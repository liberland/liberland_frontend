import { handleActions, combineActions } from 'redux-actions';
import { legislationActions } from '../actions';

const initialState = {
  legislation: {},
  citizenCount: undefined,
  isGetLegislation: false,
  unobtrusive: false,
};

const legislationReducer = handleActions({
  [combineActions(
    legislationActions.getLegislation.call,
    legislationActions.getCitizenCount.call,
    legislationActions.castVeto.call,
    legislationActions.revertVeto.call,
  )]: (state) => ({
    ...state,
    isGetLegislation: true,
  }),
  [combineActions(
    legislationActions.getLegislation.call,
    legislationActions.getCitizenCount.call,
  )]: (state) => ({
    ...state,
    unobtrusive: true,
  }),
  [combineActions(
    legislationActions.castVeto.failure,
    legislationActions.castVeto.success,
    legislationActions.getCitizenCount.failure,
    legislationActions.getCitizenCount.success,
    legislationActions.getLegislation.failure,
    legislationActions.getLegislation.success,
    legislationActions.revertVeto.failure,
    legislationActions.revertVeto.success,
  )]: (state) => ({
    ...state,
    isGetLegislation: false,
    unobtrusive: false,
  }),
  [legislationActions.getCitizenCount.call]: (state) => ({
    ...state,
    citizenCount: undefined,
  }),
  [legislationActions.getCitizenCount.success]: (state, action) => ({
    ...state,
    citizenCount: action.payload,
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
