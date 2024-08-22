// eslint-disable-next-line import/no-cycle
import { encodeRemark } from '../api/nodeRpcCall';
import { parseAssets } from './walletHelpers';

export const objectToHex = (object) => {
  const jsonString = JSON.stringify(object);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(jsonString);
  const hexString = `0x${Array.from(bytes).map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
  return hexString;
};

export const extractItemsFromObject = async (obj, assetsData) => {
  const selectKeys = Object.keys(obj).filter((key) => key.startsWith('select'));
  const resultArray = await Promise.all(selectKeys.map(async (key) => {
    const assetInfo = assetsData.find((item) => item.value === obj[key]);
    const remark = {
      currency: obj[key],
      project: obj[`project${key.slice(-1)}`],
      description: obj[`description${key.slice(-1)}`],
      category: obj[`category${key.slice(-1)}`],
      supplier: obj[`supplier${key.slice(-1)}`],
      date: Date.now(),
      finalDestination: obj[`finalDestination${key.slice(-1)}`],
      amountInUsd: obj[`amountInUsd${key.slice(-1)}`],
    };
    const encodedRemark = await encodeRemark(remark);
    return {
      transfer: {
        asset: obj[key],
        balance: parseAssets(obj[`transfer${key.slice(-1)}`], assetInfo.decimals),
        recipient: obj[`recipient${key.slice(-1)}`],
        index: assetInfo.index,
      },
      remark: encodedRemark,
    };
  }));
  return resultArray;
};

export const IndexHelper = {
  LLD: '-2',
  POLITIPOOL_LLM: '-1',
};

export const closestNumberToZeroNotInArray = (arr) => {
  for (let i = 0; ; i += 1) {
    if (!arr.includes(i)) return i;
  }
};

export const hexToObject = (hexString) => {
  const hex = hexString.startsWith('0x') ? hexString.slice(2) : hexString;

  const bytes = new Uint8Array(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

  const decoder = new TextDecoder();
  const jsonString = decoder.decode(bytes);

  const object = JSON.parse(jsonString);
  return object;
};
