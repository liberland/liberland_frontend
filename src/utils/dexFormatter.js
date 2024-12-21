import { BN } from '@polkadot/util';
import { BigNumber } from 'ethers';
import {
  calculateAmountMax,
  calculateAmountMin,
  formatAssets,
  parseAssets,
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

export const makeAssetToShow = (asset, symbol) => {
  let assetToShow = asset;
  if (asset === 'Native') {
    assetToShow = 'LLD';
  } else if (symbol) {
    assetToShow = symbol;
  }

  return assetToShow;
};

export const getDecimalsForAsset = (asset, decimal) => {
  if (asset === 'Native') {
    return 12;
  }
  return decimal || 0;
};

export const convertLiquidityData = (
  amount1Desired,
  amount2Desired,
  asset1Decimals,
  asset2Decimals,
  minAmountPercent,
) => {
  const amount1 = parseAssets(amount1Desired, asset1Decimals);
  const amount2 = parseAssets(amount2Desired, asset2Decimals);

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

export const convertTransferData = async (
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

  const getSwapPrice = isAsset1 ? getSwapPriceExactTokensForTokens : getSwapPriceTokensForExactTokens;
  const isAmountMax = !isAsset1;
  const amountIn = isAsset1 ? amount1Desired : amount2Desired;

  if (isBuy) {
    const decimals = isAsset1 ? asset2Decimals : asset1Decimals;
    amount = parseAssets(amountIn, decimals);
    amountData = await getSwapPrice(enum2, enum1, amount);
  } else {
    const decimals = isAsset1 ? asset1Decimals : asset2Decimals;
    amount = parseAssets(amountIn, decimals);
    amountData = await getSwapPrice(enum1, enum2, amount);
  }

  const calculateFunc = isAmountMax ? calculateAmountMax : calculateAmountMin;
  const amountMin = calculateFunc(new BN(amountData), amountOut);
  return { amount, amountMin };
};

export const convertAssetData = (assetsData, asset1, asset2) => {
  const asset1Values = assetsData[Number(asset1)];
  const asset1Metadata = asset1Values?.metadata;
  const assetData1 = {
    decimals: asset1Metadata?.decimals ? Number(asset1Metadata?.decimals) : undefined,
    deposit: asset1Metadata?.deposit,
    name: asset1Metadata?.name,
    symbol: asset1Metadata?.symbol,
    isStock: asset1Values?.isStock,
  };
  const asset2Values = assetsData[Number(asset2)];
  const asset2Metadata = asset2Values?.metadata;
  const assetData2 = {
    decimals: asset2Metadata?.decimals ? Number(asset2Metadata?.decimals) : undefined,
    deposit: asset2Metadata?.deposit,
    name: asset2Metadata?.name,
    symbol: asset2Metadata?.symbol,
    isStock: asset2Values?.isStock,
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

  const reservedFormated1 = sanitizeValue(formatAssets(reserved1, decimals1, { withAll: true }));
  const reservedFormated2 = sanitizeValue(formatAssets(reserved2, decimals2, { withAll: true }));

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

  const finalValue = removeTrailingZerosFromString(resultString);

  return finalValue;
};

export const calculatePooled = (
  lpTokensData,
  liquidityData,
  reservedAsset,
) => (new BN(reservedAsset).mul(new BN(lpTokensData))).div(new BN(liquidityData));
