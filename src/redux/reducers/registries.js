import { handleActions } from 'redux-actions';
import { registriesActions } from '../actions';

const initialState = {
  officialUserRegistryEntries: [],
  isGetRegistries: false,
  registryCRUDAction: {
    registry: null,
    action: null,
    dataObject: null
  }
};

const registriesReducer = handleActions({
  [registriesActions.getOfficialUserRegistryEntries.call]: (state, action) => ({
    ...state,
    officialUserRegistryEntries: [],
    isGetRegistries: true,
  }),
  [registriesActions.getOfficialUserRegistryEntries.success]: (state, action) => ({
    ...state,
    officialUserRegistryEntries:  action.payload,
    isGetRegistries: false,
  }),
  [registriesActions.getOfficialUserRegistryEntries.failure]: (state) => ({
    ...state,
    isGetRegistries: false,
  }),
  [registriesActions.setRegistryCRUDAction.success]: (state, action) => ({
    ...state,
    registryCRUDAction: action.payload
  }),
}, initialState);

export default registriesReducer;
