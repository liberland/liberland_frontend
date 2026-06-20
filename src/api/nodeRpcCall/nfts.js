import { hexToU8a, u8aToHex } from '@polkadot/util';
import pako from 'pako';
import { getApi, submitExtrinsic } from './core';

const encodeRemarkUser = async (dataToEncode) => {
  const api = await getApi();
  const data = api.createType('RemarkInfoUser', dataToEncode);
  return u8aToHex(pako.deflate(data.toU8a()));
};

const encodeRemark = async (dataToEncode) => {
  const api = await getApi();
  const data = api.createType('RemarkInfo', dataToEncode);
  return u8aToHex(pako.deflate(data.toU8a()));
};

const decodeRemark = async (dataToEncode) => {
  const api = await getApi();
  const encodedData = dataToEncode.toHex();
  const compressedData = hexToU8a(encodedData);
  const decompressed = pako.inflate(compressedData);
  const remarkInfo = api.createType('RemarkInfo', decompressed);

  return remarkInfo;
};

const decoder = new TextDecoder();

function processData(data) {
  const decodedData = decoder.decode(data);
  try {
    return JSON.parse(decodedData);
  } catch (e) {
    return { name: decodedData };
  }
}

const getIpfsHash = (ipfsUrl) => {
  if (ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl.split('/').pop();
  }
  return null;
};

const getMetadataWithoutPinata = (ipfsUrl) => {
  const decoded = JSON.parse(ipfsUrl);
  return decoded;
};

async function processUrlData(ipfsUrl, json = true) {
  try {
    const ipfsHash = getIpfsHash(ipfsUrl);
    if (!ipfsHash) {
      return getMetadataWithoutPinata(ipfsUrl);
    }
    const url = `https://${process.env.REACT_APP_PINATA_GATEWAY}/ipfs/${ipfsHash}`;
    const response = await fetch(url, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch IPFS data: ${response.status} ${response.statusText}`);
    }
    return json ? await response.json() : response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load NFT metadata from IPFS:', error);
    return null;
  }
}

async function checkUserCollection(userAddress) {
  const api = await getApi();
  const collectionKeys = await api.query.nfts.account.entries(userAddress);
  const collectionIds = [];
  const nftIds = [];

  collectionKeys.forEach(([key]) => {
    const [collectionId, nftId] = key.args.slice(1);
    collectionIds.push(collectionId.toString());
    nftIds.push(nftId.toString());
  });
  return [collectionIds, nftIds];
}

const getAllNfts = async (walletAddress, onlyForSale) => {
  const api = await getApi();
  const nftEntries = await api.query.nfts.item.entries();

  const collectionIds = nftEntries.map(([key]) => key.args[0].toString());
  const nftIds = nftEntries.map(([key]) => key.args[1].toString());

  const [userCollectionIds, userNftIds] = await checkUserCollection(walletAddress);

  const [collectionMetadata, itemMetadata] = await Promise.all([
    api.query.nfts.collectionMetadataOf.multi(collectionIds),
    api.query.nfts.itemMetadataOf.multi(collectionIds.map((id, index) => [id, nftIds[index]])),
  ]);

  const nftDetails = await Promise.all(
    nftEntries.map(async ([key], index) => {
      const [collectionId, nftId] = key.args;

      const collectionDataOpt = collectionMetadata[index];
      const collectionMetadataUnwrapped = collectionDataOpt.isNone ? null : collectionDataOpt.unwrap();

      const itemDataOpt = itemMetadata[index];
      const itemMetadataUnwrapped = itemDataOpt.isNone ? null : itemDataOpt.unwrap();
      const processedItemData = itemMetadataUnwrapped
        ? await processUrlData(decoder.decode(itemMetadataUnwrapped.data))
        : null;

      const itemPriceOpt = await api.query.nfts.itemPriceOf(collectionId, nftId);
      const itemPrice = itemPriceOpt.isNone ? null : itemPriceOpt.unwrap()[0].toString();
      const imageUrl = processedItemData?.image || processedItemData?.imageUrl;
      const image = imageUrl ? await processUrlData(imageUrl, false) : null;

      if (onlyForSale && !itemPrice) {
        return null;
      }

      const isUserNft = userCollectionIds.includes(collectionId.toString())
                        && userNftIds.includes(nftId.toString());

      return {
        collectionId: collectionId.toString(),
        nftId: nftId.toString(),
        isUserNft,
        collectionMetadata: {
          name: collectionMetadataUnwrapped?.name?.toString(),
        },
        itemMetadata: {
          ...processedItemData,
          image: image?.url || imageUrl,
          itemPrice,
        },
      };
    }),
  );

  return nftDetails.filter((detail) => detail !== null);
};

const getUserNfts = async (walletAddress) => {
  const api = await getApi();

  const [collectionIds, nftIds] = await checkUserCollection(walletAddress);

  const [collectionMetadata, itemMetadata] = await Promise.all([
    api.query.nfts.collectionMetadataOf.multi(collectionIds),
    api.query.nfts.itemMetadataOf.multi(collectionIds.map((id, index) => [id, nftIds[index]])),
  ]);

  const nftDetails = await Promise.all(
    collectionIds.map(async (collectionId, index) => {
      const collectionDataOpt = collectionMetadata[index];
      const itemDataOpt = itemMetadata[index];
      const collectionData = collectionDataOpt.isNone ? null : collectionDataOpt.unwrap();
      const itemData = itemDataOpt.isNone ? null : itemDataOpt.unwrap();
      const processedCollectionData = collectionData ? processData(collectionData.data) : null;
      const processedItemData = itemData ? await processUrlData(decoder.decode(itemData.data)) : null;
      const imageUrl = processedItemData?.image || processedItemData?.imageUrl;
      const image = imageUrl ? await processUrlData(imageUrl, false) : null;

      const itemPriceOpt = await api.query.nfts.itemPriceOf(collectionId, nftIds[index]);
      const itemPrice = itemPriceOpt.isNone ? null : itemPriceOpt.unwrap()[0].toString();
      return {
        collectionId,
        nftId: nftIds[index],
        collectionMetadata: {
          name: processedCollectionData?.name,
        },
        itemMetadata: {
          ...processedItemData,
          image: image?.url || imageUrl,
          itemPrice,
        },
      };
    }),
  );

  return nftDetails;
};

async function getUserCollection(walletAddress) {
  const api = await getApi();

  const collectionKeys = await api.query.nfts.collectionAccount.keys(walletAddress);

  const collections = collectionKeys.map(({ args: [address, collectionId] }) => ({
    address: address.toString(),
    collectionId: collectionId.toNumber(),
  }));

  return collections;
}

async function createCollectionNfts(admin, config, walletAddress) {
  const api = await getApi();
  const extrinsic = api.tx.nfts.create(admin, config);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function mintNFT(collectionId, itemId, mintTo, walletAddress) {
  const api = await getApi();
  const extrinsic = api.tx.nfts.mint(collectionId, itemId, mintTo, null);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function destroyNFT(collectionId, itemId, walletAddress) {
  const api = await getApi();
  const extrinsic = api.tx.nfts.burn(collectionId, itemId);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function setMetadataNFT(collectionId, itemId, metadataCID, walletAddress) {
  const api = await getApi();
  const metadata = `ipfs://${metadataCID}`;
  const extrinsic = api.tx.nfts.setMetadata(collectionId, itemId, metadata);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function setAttributes(collectionId, itemId, namespace, key, value, walletAddress) {
  const api = await getApi();
  const extrinsic = api.tx.nfts.setAttribute(collectionId, itemId, namespace, key, value);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function sellNFT(collectionId, itemId, price, walletAddress) {
  const api = await getApi();
  const buyer = api.createType('Option<MultiAddress>', null);
  const extrinsic = api.tx.nfts.setPrice(collectionId, itemId, price, buyer);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function bidNFT(collectionId, itemId, bidPrice, walletAddress) {
  const api = await getApi();
  const extrinsic = api.tx.nfts.buyItem(collectionId, itemId, bidPrice);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

async function transferNFT(collectionId, itemId, newOwner, walletAddress) {
  const api = await getApi();
  const extrinsic = api.tx.nfts.transfer(collectionId, itemId, newOwner);
  return submitExtrinsic(extrinsic, walletAddress, api);
}

export {
  encodeRemarkUser,
  encodeRemark,
  decodeRemark,
  getAllNfts,
  getUserNfts,
  getUserCollection,
  createCollectionNfts,
  mintNFT,
  destroyNFT,
  setMetadataNFT,
  setAttributes,
  sellNFT,
  bidNFT,
  transferNFT,
};
