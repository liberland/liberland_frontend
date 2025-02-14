import { put, call, select } from 'redux-saga/effects';
import maxBy from 'lodash/maxBy';
import {
  createCollectionNfts,
  destroyNFT,
  getUserNfts,
  mintNFT,
  setMetadataNFT,
  setAttributes,
  sellNFT,
  bidNFT,
  transferNFT,
  getUserCollection,
  getAllNfts,
} from '../../api/nodeRpcCall';

import { nftsActions } from '../actions';
import { blockchainWatcher } from './base';
import { blockchainSelectors } from '../selectors';

// WORKERS

function* getUserNftsWorker(action) {
  const nfts = yield call(getUserNfts, action.payload);
  yield put(nftsActions.getNfts.success(nfts));
}

function* getUserCollectionsWorker(action) {
  const collection = yield call(getUserCollection, action.payload);
  yield put(nftsActions.getUserCollections.success(collection));
}

function* getNftsWorker(action) {
  const nfts = yield call(getAllNfts, action.payload);
  const hasUserNft = nfts.some((nft) => nft.isUserNft === true);
  yield put(nftsActions.getAllNfts.success({ hasUserNft, nfts }));
}

function* getNftsOnSaleWorker(action) {
  const nfts = yield call(getAllNfts, action.payload, true);
  const filteredNfts = nfts.filter((nft) => !nft.isUserNft);
  yield put(nftsActions.getNftsOnSale.success(filteredNfts));
}

function* createCollectionWorker(action) {
  const { walletAdmin, config } = action.payload;
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(createCollectionNfts, walletAdmin, config, walletAddress);
  yield put(nftsActions.createCollection.success());
  yield put(nftsActions.getNfts.call(walletAddress));
  yield put(nftsActions.getUserCollections.call(walletAddress));
}

function* mintNftWorker(action) {
  const { collectionId, itemId, mintTo } = action.payload;
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(mintNFT, collectionId, itemId, mintTo, walletAddress);
  yield put(nftsActions.mintNft.success());
  yield put(nftsActions.getNfts.call(walletAddress));
}

function* destroyNftWorker(action) {
  const { collectionId, itemId } = action.payload;
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(destroyNFT, collectionId, itemId, walletAddress);
  yield put(nftsActions.destroyNft.success());
  yield put(nftsActions.getNfts.call(walletAddress));
}

function* setMetadataWorker(action) {
  const { collectionId, metadataCID } = action.payload;
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  const nfts = yield call(
    getAllNfts,
    walletAddress,
  );
  const latest = maxBy(nfts, ({ nftId }) => Number(nftId));
  const itemId = latest ? Number(latest.nftId) + 1 : 1;
  yield call(mintNFT, collectionId, itemId, walletAddress, walletAddress);
  yield call(setMetadataNFT, collectionId, itemId, metadataCID, walletAddress);
  yield put(nftsActions.setMetadataNft.success());
  yield put(nftsActions.getNfts.call(walletAddress));
  yield put(nftsActions.getAllNfts.call(walletAddress));
}

function* setAttributesWorker(action) {
  const {
    collectionId, itemId, namespace, key, value,
  } = action.payload;
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(setAttributes, collectionId, itemId, namespace, key, value, walletAddress);
  yield put(nftsActions.setAttributesNft.success());
  yield put(nftsActions.getNfts.call(walletAddress));
}

function* sellNftWorker(action) {
  const {
    collectionId, itemId, price,
  } = action.payload;
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(sellNFT, collectionId, itemId, price, walletAddress);
  yield put(nftsActions.sellNft.success());
  yield put(nftsActions.getNfts.call(walletAddress));
}

function* bidNftWorker(action) {
  const { collectionId, itemId, bidPrice } = action.payload;
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(bidNFT, collectionId, itemId, bidPrice, walletAddress);
  yield put(nftsActions.bidNft.success());
  yield put(nftsActions.getNftsOnSale.call());
}

function* transferNftWorker(action) {
  const { collectionId, itemId, newOwner } = action.payload;
  const walletAddress = yield select(
    blockchainSelectors.userWalletAddressSelector,
  );
  yield call(transferNFT, collectionId, itemId, newOwner, walletAddress);
  yield put(nftsActions.transferNft.success());
  yield put(nftsActions.getNfts.call(walletAddress));
}

// WATCHERS

export function* getNftsOnSaleWatcher() {
  yield* blockchainWatcher(nftsActions.getNftsOnSale, getNftsOnSaleWorker);
}

export function* getNftsWatcher() {
  yield* blockchainWatcher(nftsActions.getAllNfts, getNftsWorker);
}

export function* getUserCollectionstWatcher() {
  yield* blockchainWatcher(nftsActions.getUserCollections, getUserCollectionsWorker);
}

export function* destroyNftWatcher() {
  yield* blockchainWatcher(nftsActions.destroyNft, destroyNftWorker);
}

export function* mintNftWatcher() {
  yield* blockchainWatcher(nftsActions.mintNft, mintNftWorker);
}

export function* createCollectionWatcher() {
  yield* blockchainWatcher(nftsActions.createCollection, createCollectionWorker);
}

export function* getUserNftsWatcher() {
  yield* blockchainWatcher(nftsActions.getNfts, getUserNftsWorker);
}

export function* setMetadataWatcher() {
  yield* blockchainWatcher(nftsActions.setMetadataNft, setMetadataWorker);
}

export function* setAttributesWatcher() {
  yield* blockchainWatcher(nftsActions.setAttributesNft, setAttributesWorker);
}

export function* sellNftWatcher() {
  yield* blockchainWatcher(nftsActions.sellNft, sellNftWorker);
}

export function* bidNftWatcher() {
  yield* blockchainWatcher(nftsActions.bidNft, bidNftWorker);
}

export function* transferNftWatcher() {
  yield* blockchainWatcher(nftsActions.transferNft, transferNftWorker);
}
