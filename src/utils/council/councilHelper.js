import { parseAssets } from '../walletHelpers';

export const objectToHex = (object) => {
  const jsonString = JSON.stringify(object);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(jsonString);
  const hexString = `0x${Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')}`;
  return hexString;
};

export const extractItemFromObject = (part, assetsData) => {
  const assetInfo = assetsData.find((item) => item.value === part.select);
  const encodedRemark = part.combined;
  return {
    transfer: {
      asset: part.select,
      balance: parseAssets(
        part.amount,
        assetInfo.decimals,
      ),
      recipient: part.recipient,
      index: assetInfo.index,
    },
    remark: encodedRemark,
  };
};

export const extractItemsFromObject = (obj, assetsData) => {
  const resultArray = obj.map((part) => extractItemFromObject(part, assetsData));
  return resultArray;
};

export const closestNumberToZeroNotInArray = (arr) => {
  for (let i = 0; ; i += 1) {
    if (!arr.includes(i)) return i;
  }
};

export const hexToObject = (hexString) => {
  const hex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;

  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
  );

  const decoder = new TextDecoder();
  const jsonString = decoder.decode(bytes);

  const object = JSON.parse(jsonString);
  return object;
};
