import { handleActions } from 'redux-actions';
import { BN_ZERO } from '@polkadot/util';
import { blockchainActions } from '../actions';

const initialState = {
  currentBlockNumber: 0,
  electionsBlock: 0,
  extensions: null,
  allWallets: null,
  userWalletAddress: '',
  errorExistsAndUnacknowledgedByUser: false,
  error: '',
  activeEra: {
    index: BN_ZERO,
    start: BN_ZERO,
  },
  preimages: {},
};

const blockchainReducer = handleActions({
  [blockchainActions.bestBlockNumber.value]: (state, action) => ({
    ...state,
    currentBlockNumber: action.payload.bestNumber,
    currentBlockTimestamp: action.payload.timestamp,
  }),
  [blockchainActions.setElectionsBlock.success]: (state, action) => ({
    ...state,
    electionsBlock: action.payload,
  }),
  [blockchainActions.setWallets.value]: (state, action) => ({
    ...state,
    allWallets: action.payload,
  }),
  [blockchainActions.setExtensions.value]: (state, action) => ({
    ...state,
    extensions: action.payload,
  }),
  [blockchainActions.setUserWallet.success]: (state, action) => ({
    ...state,
    userWalletAddress: action.payload,
  }),
  [blockchainActions.setErrorExistsAndUnacknowledgedByUser.success]: (state, action) => ({
    ...state,
    errorExistsAndUnacknowledgedByUser: action.payload,
  }),
  [blockchainActions.setError.success]: (state, action) => ({
    ...state,
    error: action.payload,
  }),
  [blockchainActions.activeEra.value]: (state, action) => ({
    ...state,
    error: action.payload,
  }),
  [blockchainActions.fetchPreimage.success]: (state, { payload }) => ({
    ...state,
    preimages: {
      ...state.preimages,
      [payload.hash.toString()]: payload.preimage,
    },
  }),
}, initialState);

export default blockchainReducer;
