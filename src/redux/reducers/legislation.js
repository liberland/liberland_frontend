import { handleActions } from 'redux-actions';
import { legislationActions } from '../actions';

const initialState = {
  legislation: [],
  isGetLegislation: false,
};

const legislationReducer = handleActions({
  [legislationActions.getLegislation.call]: (state, action) => ({
    ...state,
    legislation: {
      [action.payload]: undefined,
    },
    isGetLegislation: true,
  }),
  [legislationActions.getLegislation.success]: (state, action) => ({
    ...state,
    legislation: {
      [action.payload.tier]: action.payload.legislation,
    },
    isGetLegislation: false,
  }),
  [legislationActions.getLegislation.failure]: (state) => ({
    ...state,
    isGetLegislation: false,
  }),
}, initialState);

export default legislationReducer;
