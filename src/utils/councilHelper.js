import { parseAssets } from './walletHelpers';

export const objectToHex = (object) => {
  const jsonString = JSON.stringify(object);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(jsonString);
  const hexString = `0x${Array.from(bytes).map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
  return hexString;
};

export const extractItemsFromObject = (obj, assetsData) => {
  const selectKeys = Object.keys(obj).filter((key) => key.startsWith('select'));
  const resultArray = selectKeys.map((key) => {
    const assetInfo = assetsData.find((item) => item.value === obj[key]);

    const remark = {
      currency: obj[key],
      project: obj[`project${key.slice(-1)}`],
      description: obj[`description${key.slice(-1)}`],
      category: obj[`category${key.slice(-1)}`],
      supplier: obj[`supplier${key.slice(-1)}`],
      date: Date.now(),
      finalDestination: obj[`recipient${key.slice(-1)}`],
      amountInUsd: obj[`amountInUsd${key.slice(-1)}`],
    };

    return {
      transfer: {
        asset: obj[key],
        balance: parseAssets(obj[`transfer${key.slice(-1)}`], assetInfo.decimals),
        recipient: obj[`recipient${key.slice(-1)}`],
        index: assetInfo.index,
      },
      remark: objectToHex(remark),
    };
  });
  return resultArray;
};

export const OperationsType = {
  LLD: 'LLD',
  LLM: 'LLM',
  POLTIPOOL_LLM: 'POLTIPOOL_LLM',
  ASSET: 'ASSET',
};

export const getOperationType = (itemValue) => {
  if (itemValue === OperationsType.LLD) {
    return OperationsType.LLD;
  } if (itemValue === OperationsType.LLM) {
    return OperationsType.LLM;
  }
  if (itemValue === OperationsType.POLTIPOOL_LLM) {
    return OperationsType.POLTIPOOL_LLM;
  }
  return OperationsType.ASSET;
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
