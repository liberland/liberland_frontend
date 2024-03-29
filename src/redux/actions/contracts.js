import { createActions } from 'redux-actions';

export const {
  getContracts,
  signContract,
  signContractJudge,
  removeContract,
  getMyContracts,
  getSingleContract,
  createContract,
} = createActions({
  GET_CONTRACTS: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
  SIGN_CONTRACT: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
  SIGN_CONTRACT_JUDGE: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
  REMOVE_CONTRACT: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
  GET_MY_CONTRACTS: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
  GET_SINGLE_CONTRACT: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
  CREATE_CONTRACT: {
    CALL: undefined,
    SUCCESS: undefined,
    FAILURE: undefined,
  },
});
