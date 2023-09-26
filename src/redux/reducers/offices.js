import { handleActions, combineActions } from 'redux-actions';
import { officesActions } from '../actions';

const initialState = {
  identity: {
    address: null,
    onchain: null,
    backend: null,
  },
  isGetIdentity: false,
  companyRequest: null,
  isGetCompanyRequest: null,
  companyRegistration: null,
  isGetCompanyRegistration: null,
  loading: false,
  balances: {
    LLD: {},
    LLM: {},
  },
  backendAddressLLMBalance: null,
};

const officesReducer = handleActions({
  [combineActions(
    officesActions.officeGetIdentity.call,
    officesActions.getCompanyRequest.call,
    officesActions.getCompanyRegistration.call,
    officesActions.registerCompany.call,
    officesActions.getBalances.call,
    officesActions.provideJudgementAndAssets.call,
    officesActions.getPalletIds.call,
  )]: (state) => ({
    ...state,
    loading: true,
  }),
  [combineActions(
    officesActions.officeGetIdentity.success,
    officesActions.getCompanyRequest.success,
    officesActions.getCompanyRegistration.success,
    officesActions.registerCompany.success,
    officesActions.getBalances.success,
    officesActions.provideJudgementAndAssets.success,
    officesActions.officeGetIdentity.failure,
    officesActions.getCompanyRequest.failure,
    officesActions.getCompanyRegistration.failure,
    officesActions.registerCompany.failure,
    officesActions.getBalances.failure,
    officesActions.provideJudgementAndAssets.failure,
    officesActions.getPalletIds.failure,
  )]: (state) => ({
    ...state,
    loading: false,
  }),
  [officesActions.officeGetIdentity.call]: (state, action) => ({
    ...state,
    identity: {
      address: action.payload,
      backend: null,
      onchain: null,
    },
    isGetIdentity: true,
  }),
  [officesActions.officeGetIdentity.success]: (state, action) => ({
    ...state,
    identity: {
      address: state.identity.address,
      backend: action.payload.backend,
      onchain: action.payload.onchain,
    },
    isGetIdentity: false,
  }),
  [officesActions.officeGetIdentity.failure]: (state) => ({
    ...state,
    identity: initialState.identity,
    isGetIdentity: false,
  }),
  [officesActions.getCompanyRequest.call]: (state, action) => ({
    ...state,
    companyRequest: {
      entity_id: action.payload,
      request: null,
    },
    isGetCompanyRequest: true,
  }),
  [officesActions.getCompanyRequest.success]: (state, action) => ({
    ...state,
    companyRequest: {
      entity_id: state.companyRequest.entity_id,
      request: action.payload,
    },
    isGetCompanyRequest: false,
  }),
  [officesActions.getCompanyRequest.failure]: (state) => ({
    ...state,
    isGetCompanyRequest: false,
  }),

  [officesActions.getCompanyRegistration.call]: (state, action) => ({
    ...state,
    companyRegistration: {
      entity_id: action.payload,
      registration: null,
    },
    isGetCompanyRegistration: true,
  }),
  [officesActions.getCompanyRegistration.success]: (state, action) => ({
    ...state,
    companyRegistration: {
      entity_id: state.companyRegistration.entity_id,
      registration: action.payload,
    },
    isGetCompanyRegistration: false,
  }),
  [officesActions.getCompanyRegistration.failure]: (state) => ({
    ...state,
    isGetCompanyRegistration: false,
  }),

  [officesActions.getBalances.call]: (state) => ({
    ...state,
    balances: initialState.balances,
  }),
  [officesActions.getBalances.success]: (state, action) => ({
    ...state,
    balances: action.payload,
  }),
  [officesActions.getBalances.failure]: (state) => ({
    ...state,
    balances: initialState.balances,
  }),
  [officesActions.getPalletIds.success]: (state, action) => ({
    ...state,
    pallets: action.payload,
  }),
}, initialState);

export default officesReducer;
