import { createActions } from 'redux-actions';

export const {
  officeGetIdentity,
  provideJudgementAndAssets,
  getCompanyRequest,
  getCompanyRegistration,
  registerCompany,
  getBalances,
  getPalletIds,
  unregisterCompany,
  setRegisteredCompanyData,
} = createActions({
  OFFICE_GET_IDENTITY: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  PROVIDE_JUDGEMENT_AND_ASSETS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_COMPANY_REQUEST: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_COMPANY_REGISTRATION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  REGISTER_COMPANY: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_BALANCES: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_PALLET_IDS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  UNREGISTER_COMPANY: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_REGISTERED_COMPANY_DATA: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
