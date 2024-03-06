import { handleActions, combineActions } from 'redux-actions';
import { contractsActions } from '../actions';

const initialState = {
  loading: false,
  contracts: null,
  isUserJudge: false,
  names: null,
};

const contractReducer = handleActions(
  {
    [combineActions(
      contractsActions.signContract.call,
      contractsActions.signContractJudge.call,
      contractsActions.getContracts.call,
    )]: (state) => ({
      ...state,
      loading: true,
    }),

    [combineActions(
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
  },
  initialState,
);

export default contractReducer;
