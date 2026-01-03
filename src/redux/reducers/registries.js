import { combineActions, handleActions } from 'redux-actions';
import { registriesActions } from '../actions';

const initialState = {
  officialUserRegistryEntries: [],
  isGetRegistries: false,
  unobtrusive: false,
  officialRegistryEntries: [],
  companyRequests: [],
};

const registriesReducer = handleActions({
  [combineActions(
    registriesActions.getOfficialUserRegistryEntries.call,
    registriesActions.getOfficialRegistryEntries.call,
    registriesActions.requestCompanyRegistrationAction.call,
    registriesActions.requestEditCompanyRegistrationAction.call,
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
    registriesActions.cancelCompanyRequest.call,
    registriesActions.fetchCompanyRequests.call,
  )]: (state) => ({
    ...state,
    isGetRegistries: true,
  }),
  [combineActions(
    registriesActions.getOfficialUserRegistryEntries.call,
    registriesActions.getOfficialRegistryEntries.call,
    registriesActions.fetchCompanyRequests.call,
  )]: (state) => ({
    ...state,
    unobtrusive: true,
  }),
  [combineActions(
    registriesActions.getOfficialUserRegistryEntries.success,
    registriesActions.getOfficialUserRegistryEntries.failure,
    registriesActions.requestCompanyRegistrationAction.failure,
    registriesActions.requestEditCompanyRegistrationAction.failure,
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
    registriesActions.cancelCompanyRequest.failure,
    registriesActions.getOfficialRegistryEntries.success,
    registriesActions.getOfficialRegistryEntries.failure,
    registriesActions.fetchCompanyRequests.success,
    registriesActions.fetchCompanyRequests.failure,
  )]: (state) => ({
    ...state,
    isGetRegistries: false,
    unobtrusive: false,
  }),
  [registriesActions.getOfficialUserRegistryEntries.call]: (state) => ({
    ...state,
    officialUserRegistryEntries: [],
  }),
  [registriesActions.fetchCompanyRequests.call]: (state) => ({
    ...state,
    companyRequests: [],
  }),
  [registriesActions.getOfficialUserRegistryEntries.success]: (state, action) => ({
    ...state,
    officialUserRegistryEntries: action.payload,
  }),
  [registriesActions.fetchCompanyRequests.success]: (state, action) => ({
    ...state,
    companyRequests: action.payload,
  }),
  [registriesActions.getOfficialRegistryEntries.call]: (state) => ({
    ...state,
    officialRegistryEntries: [],
  }),
  [registriesActions.getOfficialRegistryEntries.success]: (state, action) => ({
    ...state,
    officialRegistryEntries: action.payload,
  }),
}, initialState);

export default registriesReducer;
