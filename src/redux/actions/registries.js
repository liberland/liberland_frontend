import { createActions } from 'redux-actions';

export const {
  getOfficialUserRegistryEntries,
  setRegistryCRUDAction,
  requestCompanyRegistrationAction,
  requestCompanyEditAction,
  requestCompanyDeleteAction,
  registerCompanyAction,
  requestLandRegistrationAction,
  requestLandEditAction,
  registerLandAction,
  requestAssetRegistrationAction,
  requestAssetEditAction,
  requestAssetDeleteAction,
  registerAssetAction
} = createActions({
  GET_OFFICIAL_USER_REGISTRY_ENTRIES: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_REGISTRY_C_R_U_D_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REQUEST_COMPANY_REGISTRATION_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REQUEST_COMPANY_EDIT_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REQUEST_COMPANY_DELETE_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REGISTER_COMPANY_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REQUEST_LAND_REGISTRATION_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REQUEST_LAND_EDIT_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REGISTER_LAND_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REQUEST_ASSET_REGISTRATION_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REQUEST_ASSET_EDIT_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REQUEST_ASSET_DELETE_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REGISTER_ASSET_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  }
});