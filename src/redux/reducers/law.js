import { handleActions } from 'redux-actions';
import { lawsActions } from '../actions';

const initialState = {
  currentLaws: [],
  isGetLaws: false,
};

const lawReducer = handleActions({
  [lawsActions.getCurrentLaws.call]: (state) => ({
    ...state,
    isGetLaws: true,
  }),
  [lawsActions.getCurrentLaws.success]: (state, action) => ({
    ...state,
    currentLaws: action.payload,
    isGetLaws: false,
  }),
  [lawsActions.getCurrentLaws.failure]: (state) => ({
    ...state,
    isGetLaws: false,
  }),
}, initialState);

export default lawReducer;
