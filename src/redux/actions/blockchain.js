import { createActions } from 'redux-actions';

export const {
  bestBlockNumber,
  setElectionsBlock,
  updateDateElections,
  setWallets,
  setExtensions,
  setUserWallet,
  setErrorExistsAndUnacknowledgedByUser,
  getErrorExistsAndUnacknowledgedByUser,
  setError,
  activeEra,
  fetchPreimage,
} = createActions({
  BEST_BLOCK_NUMBER: {
    value: undefined,
  },
  GET_PERIOD_AND_VOTING_DURATION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_ELECTIONS_BLOCK: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  UPDATE_DATE_ELECTIONS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_WALLETS: {
    value: undefined,
  },
  SET_EXTENSIONS: {
    value: undefined,
  },
  SET_USER_WALLET: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_ERROR_EXISTS_AND_UNACKNOWLEDGED_BY_USER: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_ERROR_EXISTS_AND_UNACKNOWLEDGED_BY_USER: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_ERROR: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  ACTIVE_ERA: {
    value: undefined,
  },
  FETCH_PREIMAGE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
