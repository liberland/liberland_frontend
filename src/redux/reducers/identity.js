import { handleActions, combineActions } from 'redux-actions';
import { identityActions } from '../actions';

const initialState = {
  loading: false,
  unobtrusive: false,
  identity: null,
};

const identityReducer = handleActions(
  {
    [combineActions(
      identityActions.getIdentity.call,
      identityActions.setIdentity.call,
      identityActions.getIdentityMotions.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),

    [combineActions(
      identityActions.getIdentity.call,
      identityActions.getIdentityMotions.call,
    )]: (state) => ({
      ...state,
      unobtrusive: true,
    }),

    [combineActions(
      identityActions.getIdentity.success,
      identityActions.getIdentity.failure,
      identityActions.setIdentity.success,
      identityActions.setIdentity.failure,
      identityActions.getIdentityMotions.success,
      identityActions.getIdentityMotions.failure,
    )]: (state) => ({
      ...state,
      loading: initialState.loading,
      unobtrusive: initialState.unobtrusive,
    }),

    [identityActions.getIdentity.call]: (state) => ({
      ...state,
      identity: null,
    }),

    [identityActions.getIdentity.success]: (state, action) => ({
      ...state,
      identity: action.payload,
    }),

    [identityActions.getIdentityMotions.call]: (state) => ({
      ...state,
      identityMotions: null,
    }),

    [identityActions.getIdentityMotions.success]: (state, action) => ({
      ...state,
      identityMotions: action.payload,
    }),
  },
  initialState,
);

export default identityReducer;
