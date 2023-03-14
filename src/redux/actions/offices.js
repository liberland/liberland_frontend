import { createActions } from 'redux-actions';

export const {
  getIdentity,
  provideJudgement,
  getCompanyRequest,
  getCompanyRegistration,
  registerCompany,
} = createActions({
  GET_IDENTITY: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  PROVIDE_JUDGEMENT: {
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
});
