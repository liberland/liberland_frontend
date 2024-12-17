import { combineActions, handleActions } from 'redux-actions';
import { nftsActions } from '../actions';

const initialState = {
  isLoading: false,
  userNfts: [],
  userCollections: [],
  nfts: [],
  nftsOnSale: [],
};

const nftsReducer = handleActions({
  [combineActions(
    nftsActions.getNfts.call,
    nftsActions.createCollection.call,
    nftsActions.mintNft.call,
    nftsActions.destroyNft.call,
    nftsActions.setMetadataNft.call,
    nftsActions.setAttributesNft.call,
    nftsActions.bidNft.call,
    nftsActions.transferNft.call,
    nftsActions.sellNft.call,
    nftsActions.getUserCollections.call,
    nftsActions.getAllNfts.call,
    nftsActions.getNftsOnSale.call,
  )]: (state) => ({
    ...state,
    isLoading: true,
  }),
  [nftsActions.getNfts.success]: (state, action) => ({
    ...state,
    userNfts: action.payload,
  }),
  [nftsActions.getUserCollections.success]: (state, action) => ({
    ...state,
    userCollections: action.payload,
  }),
  [nftsActions.getAllNfts.success]: (state, action) => ({
    ...state,
    nfts: action.payload,
  }),
  [nftsActions.getNftsOnSale.success]: (state, action) => ({
    ...state,
    nftsOnSale: action.payload,
  }),
  [combineActions(
    nftsActions.getNfts.failure,
    nftsActions.getNfts.success,
    nftsActions.createCollection.failure,
    nftsActions.createCollection.success,
    nftsActions.mintNft.failure,
    nftsActions.mintNft.success,
    nftsActions.destroyNft.failure,
    nftsActions.destroyNft.success,
    nftsActions.setMetadataNft.failure,
    nftsActions.setMetadataNft.success,
    nftsActions.setAttributesNft.failure,
    nftsActions.setAttributesNft.success,
    nftsActions.bidNft.failure,
    nftsActions.bidNft.success,
    nftsActions.transferNft.failure,
    nftsActions.transferNft.success,
    nftsActions.sellNft.failure,
    nftsActions.sellNft.success,
    nftsActions.getUserCollections.success,
    nftsActions.getUserCollections.failure,
    nftsActions.getAllNfts.failure,
    nftsActions.getAllNfts.success,
    nftsActions.getNftsOnSale.success,
    nftsActions.getNftsOnSale.failure,
  )]: (state) => ({
    ...state,
    isLoading: initialState.isLoading,
  }),
}, initialState);

export default nftsReducer;
