import { createActions } from 'redux-actions';

export const {
  getNfts,
} = createActions({
  GET_NFTS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
