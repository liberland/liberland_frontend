import { formatBalance, BN } from '@polkadot/util';
import { BigNumber } from 'ethers';
import {
  formatDollars, formatMerits,
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

export const formatProperlyValue = (asset, value, symbol, decimals) => {
  let formattedValue;

  if (asset === 'Native') {
    formattedValue = formatDollars(value);
  } else if (asset === '1') {
    formattedValue = formatMerits(value);
  } else {
    formattedValue = formatter(value, decimals);
  }

  const returnValue = symbol ? `${formattedValue} ${symbol}` : formattedValue;
  return returnValue;
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
  const minAmountValue = (Number(minAmountPercent || defaultMinPercent) / 100);
  const multiplier = new BN((minAmountValue * 1e18).toString());
  const { div, mod } = amount.mul(multiplier).divmod(new BN(1e18.toString()));
  const stringValue = mod.toString();

  const integerPart = stringValue.slice(0, -1e18.toString().length) || '0';
  const decimalPart = stringValue.slice(-1e18.toString().length);

  const dividedValueString = `${integerPart}.${decimalPart}`;
  const substract = new BN(Number(div) + Number(dividedValueString));
  const result = subResult
    ? amount.sub(substract.isZero() ? new BN(2) : substract)
    : amount.add(substract.isZero() ? new BN(2) : substract);
  return result;
};

export const calculateAmountDesiredFormatted = (desiredAmount, decimals) => {
  const valueString = desiredAmount.toString();
  const decimalsFromValue = valueString.split('.')[1]?.length || '0';
  return new BN(valueString.replace('.', ''))
    .mul(decimals)
    .div((new BN(10)
      .pow(new BN(decimalsFromValue))));
};

export const getDecimalsBN = (asset, decimals) => new BN(10).pow(new BN(getDecimalsForAsset(asset, decimals)));

export const convertLiquidityData = (
  amount1Desired,
  amount2Desired,
  asset1,
  asset2,
  asset1Decimals,
  asset2Decimals,
  minAmountPercent,
) => {
  const asset1DecimalsBN = getDecimalsBN(asset1, asset1Decimals);
  const asset2DecimalsBN = getDecimalsBN(asset2, asset2Decimals);

  const amount1 = calculateAmountDesiredFormatted(amount1Desired, asset1DecimalsBN);
  const amount2 = calculateAmountDesiredFormatted(amount2Desired, asset2DecimalsBN);

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
  amountDesired,
  isBuy,
  amountOut,
) => {
  const asset1DecimalsBN = getDecimalsBN(asset1, asset1Decimals);
  const asset2DecimalsBN = getDecimalsBN(asset2, asset2Decimals);
  const actualDecimal = isBuy ? asset2DecimalsBN : asset1DecimalsBN;

  const { enum1, enum2 } = convertToEnumDex(asset1, asset2);
  const amount = calculateAmountDesiredFormatted(amountDesired, actualDecimal);
  let amountMin = null;
  if (isBuy) {
    const swapPrice = await getSwapPriceTokensForExactTokens(enum1, enum2, amount);
    const swapPriceFormat = formatterDecimals(
      swapPrice,
      asset2Decimals,
    );
    const amountMinData = calculateAmountDesiredFormatted(swapPriceFormat, asset2DecimalsBN);
    amountMin = calculateAmountMin(
      amountMinData,
      amountOut,
      !isBuy,
    );
  } else {
    const swapPrice = await getSwapPriceExactTokensForTokens(enum1, enum2, amount);
    const swapPriceFormat = formatProperlyValue(
      swapPrice,
      asset1Decimals,
    );
    const amountMinData = calculateAmountDesiredFormatted(swapPriceFormat, asset1DecimalsBN);
    amountMin = calculateAmountMin(
      amountMinData,
      amountOut,
      !isBuy,
    );
  }
  return { amount, amountMin };
};

export const getBNDataToFindPrice = (asset, decimalsNumber, searchTerm) => {
  const decimalsData = getDecimalsForAsset(asset, decimalsNumber);
  const decimalsBN = getDecimalsBN(asset, decimalsData);
  const amount = calculateAmountDesiredFormatted(searchTerm, decimalsBN);
  return amount;
};

export const checkIfValueGreaterThanReserved = (
  v,
  asset1,
  asset1Decimals,
  asset2,
  asset2Decimals,
  reservesThisAssets,
  isBuy,
) => {
  const decimals = isBuy ? asset1Decimals : asset2Decimals;
  const asset = isBuy ? asset1 : asset2;
  const decimalsData = getDecimalsForAsset(asset, decimals);
  const decimalsBN = getDecimalsBN(asset, decimalsData);
  const value = calculateAmountDesiredFormatted(v, decimalsBN);

  const reserved = new BN(isBuy ? reservesThisAssets.asset2 : reservesThisAssets.asset1);
  return value.gte(reserved);
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
