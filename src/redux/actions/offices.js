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
  getPendingAdditionalMerits,
  getTaxPayers,
} = createActions({
  GET_PENDING_ADDITIONAL_MERITS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
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
  GET_TAX_PAYERS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
