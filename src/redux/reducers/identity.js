import { handleActions, combineActions } from 'redux-actions';
import { identityActions } from '../actions';

const initialState = {
  loading: false,
  identity: null,
  identities: null,
};

const identityReducer = handleActions(
  {
    [combineActions(
      identityActions.getIdentity.call,
      identityActions.setIdentity.call,
      identityActions.getIdentities.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),

    [combineActions(
      identityActions.getIdentity.success,
      identityActions.getIdentity.failure,
      identityActions.getIdentities.success,
      identityActions.getIdentities.failure,
      identityActions.setIdentity.success,
      identityActions.setIdentity.failure,
    )]: (state) => ({
      ...state,
      loading: initialState.loading,
    }),

    [identityActions.getIdentity.call]: (state) => ({
      ...state,
      identity: null,
    }),

    [identityActions.getIdentity.success]: (state, action) => ({
      ...state,
      identity: action.payload,
    }),
    [identityActions.getIdentities.call]: (state) => ({
      ...state,
      identities: null,
    }),
    [identityActions.getIdentities.success]: (state, action) => {
      const { key, identity } = action.payload;
      const name = new TextDecoder().decode(identity.unwrap().info.display.asRaw);
      const objectKeyName = { key, name };
      let identitiesData = null;
      if (state.identities && state.identities.length > 0) {
        const checkIfIsNewAdress = state.identities.includes(objectKeyName);
        identitiesData = checkIfIsNewAdress ? [...state.identities] : [...state.identities, objectKeyName];
      } else {
        identitiesData = [objectKeyName];
      }
      return {
        ...state,
        identities: identitiesData,
      };
    },
  },
  initialState,
);

export default identityReducer;
