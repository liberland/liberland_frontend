import { createActions } from 'redux-actions';

export const {
  officeGetIdentity,
  provideJudgementAndAssets,
  getCompanyRequest,
  getCompanyRegistration,
  registerCompany,
  getBalances,
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
});
