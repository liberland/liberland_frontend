import { formatBalance, BN } from '@polkadot/util';
import { BigNumber } from 'ethers';
import {
  formatAssets,
  formatDollars, formatMerits,
  parseAssets,
  parseDollars,
  parseMerits,
  sanitizeValue,
} from './walletHelpers';
// eslint-disable-next-line import/no-cycle
import {
  getSwapPriceExactTokensForTokens,
  getSwapPriceTokensForExactTokens,
} from '../api/nodeRpcCall';

export function convertToEnumDex(asset1, asset2) {
  const enum1 = asset1 === 'Native' ? asset1 : { Asset: asset1 };
  const enum2 = asset2 === 'Native' ? asset2 : { Asset: asset2 };
  return { enum1, enum2 };
}

export const formatter = (v, decimals = 12) => formatBalance(
  v,
  {
    decimals, forceUnit: '-', withSi: false, locale: 'en', withAll: true, withZero: false,
  },
);

export const formatterDecimals = (balance, decimals) => {
  let chainDecimals = 12;
  if (decimals === 0) {
    chainDecimals = 0;
  } else if (decimals) {
    chainDecimals = decimals;
  }
  const bigBalance = new BN(balance);
  const baseFactor = new BN(10).pow(new BN(chainDecimals));

  const integerPart = bigBalance.div(baseFactor).toString();
  const remainder = bigBalance.mod(baseFactor);
  const formattedRemainder = remainder.toString().padStart(chainDecimals, '0');
  if (!remainder.isZero()) {
    return `${integerPart}.${formattedRemainder}`;
  }
  return `${integerPart}`;
};

export const makeAssetToShow = (asset, symbol) => {
  let assetToShow = asset;

  if (asset === 'Native') {
    assetToShow = 'LLD';
  } else if (asset === '1') {
    assetToShow = 'LLM';
  } else if (symbol) {
    assetToShow = symbol;
  }

  return assetToShow;
};

export const formatProperlyValue = (asset, value, decimals, symbol) => {
  let formattedValue;
  if (asset === 'Native') {
    formattedValue = formatDollars(value, true);
  } else if (asset === '1') {
    formattedValue = formatMerits(value, true);
  } else {
    formattedValue = formatAssets(value, decimals || 0, true);
  }

  const returnValue = symbol ? `${formattedValue} ${symbol}` : formattedValue;
  return returnValue;
};

export const parseProperlyValue = (asset, value, decimals) => {
  let parsedValue;
  if (asset === 'Native') {
    parsedValue = parseDollars(value);
  } else if (asset === '1') {
    parsedValue = parseMerits(value);
  } else {
    parsedValue = parseAssets(value, decimals);
  }

  return parsedValue;
};

export const getDecimalsForAsset = (asset, decimal) => {
  if (asset === 'Native') {
    return 12;
  } if (asset === '1') {
    return 12;
  }
  return decimal || 0;
};

const calculateAmountMin = (
  amount,
  minAmountPercent,
  subResult = true,
) => {
  const defaultMinPercent = 0.5;
  const minAmountValue = (Number(minAmountPercent || defaultMinPercent) / 100).toString();
  const lengthDecimalPercent = minAmountValue.split('.')[1].length;
  const minAmountPercentBN = parseAssets(minAmountValue, lengthDecimalPercent);
  const decimalsBN = new BN(10).pow(new BN(lengthDecimalPercent));
  const percentBN = amount.mul(minAmountPercentBN).divn(decimalsBN);

  if (subResult) {
    const sub = amount.sub(percentBN.isZero() ? new BN(3) : percentBN);
    return sub.lte(new BN(0)) ? 1 : sub;
  }
  return amount.add(percentBN.isZero() ? new BN(3) : percentBN);
};

export const convertLiquidityData = (
  amount1Desired,
  amount2Desired,
  asset1Decimals,
  asset2Decimals,
  minAmountPercent,
  asset1,
  asset2,
) => {
  const amount1 = parseProperlyValue(asset1, sanitizeValue(amount1Desired), asset1Decimals);
  const amount2 = parseProperlyValue(asset2, sanitizeValue(amount2Desired), asset2Decimals);

  const amount1Min = calculateAmountMin(
    amount1,
    minAmountPercent,
  );
  const amount2Min = calculateAmountMin(
    amount2,
    minAmountPercent,
  );
  return {
    amount1, amount2, amount1Min, amount2Min,
  };
};

export const converTransferData = async (
  asset1,
  asset1Decimals,
  asset2,
  asset2Decimals,
  amount1Desired,
  amount2Desired,
  isBuy,
  amountOut,
  isAsset1,
) => {
  const { enum1, enum2 } = convertToEnumDex(asset1, asset2);

  let amount = null;
  let amountData = null;
  let subResult = true;

  if (isBuy) {
    amount = parseProperlyValue(
      isAsset1 ? asset2 : asset1,
      isAsset1 ? amount1Desired : amount2Desired,
      isAsset1 ? asset2Decimals : asset1Decimals,
    );
    amountData = await (isAsset1
      ? getSwapPriceExactTokensForTokens
      : getSwapPriceTokensForExactTokens)(enum2, enum1, amount);
    subResult = isAsset1 ? false : subResult;
  } else {
    amount = parseProperlyValue(
      isAsset1 ? asset1 : asset2,
      isAsset1 ? amount1Desired : amount2Desired,
      isAsset1 ? asset1Decimals : asset2Decimals,
    );
    amountData = await (isAsset1
      ? getSwapPriceExactTokensForTokens
      : getSwapPriceTokensForExactTokens)(enum1, enum2, amount);
    subResult = isAsset1 ? false : subResult;
  }

  const amountMin = calculateAmountMin(
    new BN(amountData),
    amountOut,
    !subResult,
  );
  return { amount, amountMin };
};

export const convertAssetData = (assetsData, asset1, asset2) => {
  const asset1Metadata = assetsData[Number(asset1)]?.metadata;
  const assetData1 = {
    decimals: asset1Metadata?.decimals ? Number(asset1Metadata?.decimals) : undefined,
    deposit: asset1Metadata?.deposit,
    name: asset1Metadata?.name,
    symbol: asset1Metadata?.symbol,
  };
  const asset2Metadata = assetsData[Number(asset2)]?.metadata;
  const assetData2 = {
    decimals: asset2Metadata?.decimals ? Number(asset2Metadata?.decimals) : undefined,
    deposit: asset2Metadata?.deposit,
    name: asset2Metadata?.name,
    symbol: asset2Metadata?.symbol,
  };
  return { assetData1, assetData2 };
};

function removeTrailingZerosFromString(str) {
  const trimmedStr = str.replace(/(\.[0-9]*[1-9])0+$/, '$1');
  // If the string ends with a decimal point after trimming, remove it
  if (trimmedStr.endsWith('.')) {
    return trimmedStr.slice(0, -1);
  }
  return trimmedStr;
}

export const getExchangeRate = (reserved1, reserved2, decimals1, decimals2) => {
  if (!reserved1 || !reserved2) {
    return null;
  }

  const reservedFormated1 = formatterDecimals(reserved1, decimals1);
  const reservedFormated2 = formatterDecimals(reserved2, decimals2);

  const num1 = BigNumber.from(reservedFormated1.replace('.', ''));
  const num2 = BigNumber.from(reservedFormated2.replace('.', ''));

  const decimalPlaces1 = (reservedFormated1.split('.')[1] || '').length;
  const decimalPlaces2 = (reservedFormated2.split('.')[1] || '').length;

  const shiftedNum1 = num1.mul(BigNumber.from(10).pow(decimalPlaces2));
  const shiftedNum2 = num2.mul(BigNumber.from(10).pow(decimalPlaces1));

  let result = shiftedNum1.div(shiftedNum2);
  const resultMod = shiftedNum1.mod(shiftedNum2);

  const isNeededMultiply = result.isZero() || (!result.isZero() && !resultMod.isZero());

  if (isNeededMultiply) {
    const shiftedNum1Multiple = shiftedNum1.mul(BigNumber.from(10).pow(BigNumber.from(18)));
    result = shiftedNum1Multiple.div(shiftedNum2);
  }

  const length = (result.toString().length || 0) - (decimalPlaces1 || 0) + (isNeededMultiply ? 18 : 0);
  const resultWithDecimal = result.toString().padStart(length, '0');
  const decimalIndex = resultWithDecimal.length - (decimalPlaces1 || 0) - (isNeededMultiply ? 18 - decimalPlaces1 : 0);

  const integer = resultWithDecimal.slice(0, decimalIndex);
  const decimal = resultWithDecimal.slice(decimalIndex);
  const integerNumber = Number(integer);
  let resultString = null;
  if (decimal) {
    resultString = `${integerNumber}.${decimal}`;
  } else {
    resultString = integerNumber.toString();
  }

  return removeTrailingZerosFromString(resultString);
};
