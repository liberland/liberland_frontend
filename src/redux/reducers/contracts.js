import { handleActions, combineActions } from 'redux-actions';
import { contractsActions } from '../actions';

const initialState = {
  loading: false,
  contracts: null,
  isUserJudge: false,
  names: null,
  myContracts: null,
  singleContract: null,
};

const contractReducer = handleActions(
  {
    [combineActions(
      contractsActions.getMyContracts.call,
      contractsActions.getMyContracts.call,
      contractsActions.signContract.call,
      contractsActions.signContractJudge.call,
      contractsActions.getContracts.call,
    )]: (state) => ({
      ...state,
      loading: true,
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
    )]: (state) => ({
      ...state,
      loading: initialState.loading,
    }),

    [contractsActions.getContracts.call]: (state) => ({
      ...state,
      contracts: initialState.contracts,
      isUserJudge: initialState.isUserJudge,
      names: initialState.names,
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
      names: initialState.names,
    }),

    [contractsActions.getSingleContract.success]: (state, action) => ({
      ...state,
      singleContract: action.payload.singleContract,
      isUserJudge: action.payload.isUserJudge,
      names: action.payload.names,
    }),
  },
  initialState,
);

export default contractReducer;
