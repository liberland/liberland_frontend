import { handleActions, combineActions } from 'redux-actions';
import { identityActions } from '../actions';

const initialState = {
  loading: false,
  identity: null,
  identities: {},
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
      identities: {},
    }),
    [identityActions.getIdentities.success]: (state, action) => {
      const identitiesMap = {};
      for (const item of action.payload) {
        const nameHashed = item.identity.display.asRaw;
        const name = nameHashed?.isEmpty ? null : new TextDecoder().decode(nameHashed);
        if (!name) {
          // eslint-disable-next-line no-continue
          continue;
        }
        identitiesMap[item.address] = name;
      }

      return {
        ...state,
        identities: identitiesMap,
      };
    },
  },
  initialState,
);

export default identityReducer;
