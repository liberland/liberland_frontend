import { combineActions, handleActions } from 'redux-actions';
import { registriesActions } from '../actions';

const initialState = {
  officialUserRegistryEntries: [],
  isGetRegistries: false,
  registryCRUDAction: {
    registry: null,
    action: null,
    dataObject: null,
  },
};

const registriesReducer = handleActions({
  [combineActions(
    registriesActions.getOfficialUserRegistryEntries.call,
    registriesActions.setRegistryCRUDAction.call,
    registriesActions.requestCompanyRegistrationAction.call,
    registriesActions.requestCompanyEditAction.call,
    registriesActions.requestCompanyDeleteAction.call,
    registriesActions.registerCompanyAction.call,
    registriesActions.requestLandRegistrationAction.call,
    registriesActions.requestLandEditAction.call,
    registriesActions.registerLandAction.call,
    registriesActions.requestAssetRegistrationAction.call,
    registriesActions.requestAssetEditAction.call,
    registriesActions.requestAssetDeleteAction.call,
    registriesActions.registerAssetAction.call,
  )]: (state) => ({
    ...state,
    isGetRegistries: true,
  }),
  [combineActions(
    registriesActions.getOfficialUserRegistryEntries.success,
    registriesActions.getOfficialUserRegistryEntries.failure,
    registriesActions.setRegistryCRUDAction.success,
    registriesActions.setRegistryCRUDAction.failure,
    registriesActions.requestCompanyRegistrationAction.failure,
    registriesActions.requestCompanyEditAction.failure,
    registriesActions.requestCompanyDeleteAction.failure,
    registriesActions.registerCompanyAction.failure,
    registriesActions.requestLandRegistrationAction.failure,
    registriesActions.requestLandEditAction.failure,
    registriesActions.registerLandAction.failure,
    registriesActions.requestAssetRegistrationAction.failure,
    registriesActions.requestAssetEditAction.failure,
    registriesActions.requestAssetDeleteAction.failure,
    registriesActions.registerAssetAction.failure,
  )]: (state) => ({
    ...state,
    isGetRegistries: false,
  }),
  [registriesActions.getOfficialUserRegistryEntries.call]: (state) => ({
    ...state,
    officialUserRegistryEntries: [],
  }),
  [registriesActions.getOfficialUserRegistryEntries.success]: (state, action) => ({
    ...state,
    officialUserRegistryEntries: action.payload,
  }),
  [registriesActions.setRegistryCRUDAction.success]: (state, action) => ({
    ...state,
    registryCRUDAction: action.payload,
  }),
}, initialState);

export default registriesReducer;
