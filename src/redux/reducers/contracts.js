import { handleActions, combineActions } from 'redux-actions';
import { contractsActions } from '../actions';

const initialState = {
  loading: false,
  unobtrusive: false,
  contracts: [],
  isUserJudge: false,
  names: null,
  myContracts: [],
  singleContract: null,
  signatures: [],
};

const contractReducer = handleActions(
  {
    [combineActions(
      contractsActions.getMyContracts.call,
      contractsActions.signContract.call,
      contractsActions.signContractJudge.call,
      contractsActions.getContracts.call,
      contractsActions.createContract.call,
      contractsActions.getSignaturesForContracts.call,
      contractsActions.getSingleContract.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),

    [combineActions(
      contractsActions.getMyContracts.call,
      contractsActions.getContracts.call,
      contractsActions.getSignaturesForContracts.call,
      contractsActions.getSingleContract.call,
    )]: (state) => ({
      ...state,
      unobtrusive: true,
    }),

    [combineActions(
      contractsActions.getMyContracts.success,
      contractsActions.getMyContracts.failure,
      contractsActions.getContracts.success,
      contractsActions.getContracts.failure,
      contractsActions.signContract.failure,
      contractsActions.signContract.success,
      contractsActions.removeContract.failure,
      contractsActions.removeContract.success,
      contractsActions.signContractJudge.failure,
      contractsActions.signContractJudge.success,
      contractsActions.createContract.success,
      contractsActions.createContract.failure,
      contractsActions.getSignaturesForContracts.failure,
      contractsActions.getSignaturesForContracts.success,
      contractsActions.getSingleContract.success,
      contractsActions.getSingleContract.failure,
    )]: (state) => ({
      ...state,
      loading: initialState.loading,
      unobtrusive: initialState.unobtrusive,
    }),

    [contractsActions.getContracts.call]: (state) => ({
      ...state,
      contracts: initialState.contracts,
      isUserJudge: initialState.isUserJudge,
    }),

    [contractsActions.getContracts.success]: (state, action) => ({
      ...state,
      contracts: action.payload.contracts,
      isUserJudge: action.payload.isUserJudge,
      names: action.payload.names,
    }),

    [contractsActions.getMyContracts.call]: (state) => ({
      ...state,
      myContracts: initialState.myContracts,
    }),

    [contractsActions.getMyContracts.success]: (state, action) => ({
      ...state,
      myContracts: action.payload.myContracts,
    }),

    [contractsActions.getSingleContract.call]: (state) => ({
      ...state,
      singleContract: initialState.singleContract,
      isUserJudge: initialState.isUserJudge,
    }),

    [contractsActions.getSingleContract.success]: (state, action) => ({
      ...state,
      singleContract: action.payload.singleContract,
      isUserJudge: action.payload.isUserJudge,
      names: action.payload.names,
    }),

    [contractsActions.getSignaturesForContracts.success]: (state, action) => ({
      ...state,
      signatures: { ...state.signatures, [action.payload.signatures.contractId]: action.payload.signatures },
      names: action.payload.names,
    }),
  },
  initialState,
);

export default contractReducer;
