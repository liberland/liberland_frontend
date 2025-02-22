import { createActions } from 'redux-actions';

export const {
  getNfts,
  getAllNfts,
  createCollection,
  mintNft,
  destroyNft,
  setMetadataNft,
  setAttributesNft,
  bidNft,
  transferNft,
  sellNft,
  getUserCollections,
  getNftsOnSale,
} = createActions({
  GET_NFTS_ON_SALE: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_ALL_NFTS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_NFTS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  GET_USER_COLLECTIONS: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  CREATE_COLLECTION: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  MINT_NFT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  DESTROY_NFT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_METADATA_NFT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SET_ATTRIBUTES_NFT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  SELL_NFT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  BID_NFT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
  TRANSFER_NFT: {
    call: undefined,
    success: undefined,
    failure: undefined,
  },
});
