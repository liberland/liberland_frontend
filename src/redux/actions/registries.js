import { createActions } from 'redux-actions';

export const {
  getOfficialRegistryEntries,
  getOfficialUserRegistryEntries,
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
  registerAssetAction,
  requestEditCompanyRegistrationAction,
  cancelCompanyRequest,
  requestUnregisterCompanyRegistrationAction,
} = createActions({
  GET_OFFICIAL_REGISTRY_ENTRIES: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_OFFICIAL_USER_REGISTRY_ENTRIES: {
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
  },
  REQUEST_EDIT_COMPANY_REGISTRATION_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CANCEL_COMPANY_REQUEST: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REQUEST_UNREGISTER_COMPANY_REGISTRATION_ACTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
