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
      const newList = action.payload.map((item) => {
        const name = new TextDecoder().decode(item.identity.display.asRaw);
        const objectKeyName = { key: item.address, name };
        const checkIfStateExist = state.identities && state.identities.length > 0;
        if (checkIfStateExist && state.identities.some((identity) => identity.key === objectKeyName.key)) {
          return null;
        }
        return { key: item.address, name };
      });

      return {
        ...state,
        identities: newList.filter((item) => item),
      };
    },
  },
  initialState,
);

export default identityReducer;
