import { formatBalance, BN } from '@polkadot/util';
import {
  formatAssets, formatDollars, formatMerits,
} from './walletHelpers';
import { getAmountsIn, getAmountsOut } from './getAmounts';

export function convertToEnumDex(asset1, asset2) {
  const enum1 = asset1 === 'Native' ? asset1 : { Asset: asset1 };
  const enum2 = asset2 === 'Native' ? asset2 : { Asset: asset2 };
  return { enum1, enum2 };
}

export const formatter = (v, decimals = 12) => formatBalance(
  v,
  {
    decimals, forceUnit: '-', withSi: false, locale: 'en', withZero: false,
  },
);

export const formatterDecimals = (balance, decimals) => {
  const chainDecimals = decimals || 12;
  const bigBalance = new BN(balance);
  const baseFactor = new BN(10).pow(new BN(chainDecimals));

  const integerPart = bigBalance.div(baseFactor).toString();
  const remainder = bigBalance.mod(baseFactor).toString();
  const formattedRemainder = remainder.padStart(chainDecimals, '0');

  return `${integerPart}.${formattedRemainder}`;
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
  } else if (decimals === 0) {
    formattedValue = formatter(value, decimals);
  } else {
    formattedValue = formatAssets(value, decimals);
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
  desiredAmount,
  reserveAsset1,
  reserveAsset2,
  defaultAmount = new BN(desiredAmount).div(new BN(100)),
) => {
  if (reserveAsset1 && reserveAsset2) {
    return (new BN(desiredAmount)).mul(new BN(reserveAsset2)).div(new BN(reserveAsset1));
  }
  return defaultAmount;
};

export const calculateAmountDesiredFormatted = (desiredAmount, decimals) => {
  const decimalsFromValue = desiredAmount.split('.')[1]?.length || 0;
  return new BN(desiredAmount.replace('.', ''))
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
  reservesThisAssets,
  ammountInputValue1,
  ammountInputValue2,
) => {
  const asset1DecimalsBN = getDecimalsBN(asset1, asset1Decimals);
  const asset2DecimalsBN = getDecimalsBN(asset2, asset2Decimals);

  const ammount1 = calculateAmountDesiredFormatted(amount1Desired, asset1DecimalsBN);
  const ammount2 = calculateAmountDesiredFormatted(amount2Desired, asset2DecimalsBN);

  let defaultAmount1Min = null;
  let defaultAmount2Min = null;

  if (!ammountInputValue1 || !ammountInputValue2) {
    defaultAmount1Min = calculateAmountMin(
      ammount1,
      reservesThisAssets?.asset1,
      reservesThisAssets?.asset2,
    );
    defaultAmount2Min = calculateAmountMin(
      ammount2,
      reservesThisAssets?.asset2,
      reservesThisAssets?.asset1,
    );
  }

  const ammountInputValue1Data = calculateAmountDesiredFormatted(ammountInputValue1, asset1DecimalsBN);
  const amountOutMin1BN = new BN(ammountInputValue1Data).mul(asset1DecimalsBN);
  const amount1Min = amountOutMin1BN.isZero() ? defaultAmount1Min : amountOutMin1BN;

  const ammountInputValue2Data = calculateAmountDesiredFormatted(ammountInputValue2, asset2DecimalsBN);
  const amountOutMin2BN = new BN(ammountInputValue2Data).mul(asset2DecimalsBN);
  const amount2Min = amountOutMin2BN.isZero() ? defaultAmount2Min : amountOutMin2BN;

  return {
    ammount1, ammount2, amount1Min, amount2Min,
  };
};

export const converTransferData = async (
  asset1,
  asset1Decimals,
  asset2,
  asset2Decimals,
  amountDesired,
  amountOutMin,
  isBuy,
  reservesThisAssets,
) => {
  const { enum1, enum2 } = convertToEnumDex(asset1, asset2);
  const asset1DecimalsBN = getDecimalsBN(asset1, asset1Decimals);
  const asset2DecimalsBN = getDecimalsBN(asset2, asset2Decimals);
  const actualDecimal = isBuy ? asset2DecimalsBN : asset1DecimalsBN;
  const amount = calculateAmountDesiredFormatted(amountDesired, actualDecimal);
  const reserveAsset1 = new BN(reservesThisAssets.asset1.toString());
  const reserveAsset2 = new BN(reservesThisAssets.asset2.toString());

  let amountMinItem = null;
  if (!amountOutMin) {
    const amountMinDecimalList = isBuy ? await getAmountsIn(
      amount,
      [enum1, enum2],
      reserveAsset2,
      reserveAsset1,
    ) : await getAmountsOut(
      amount,
      [enum1, enum2],
      reserveAsset1,
      reserveAsset2,
    );
    amountMinItem = amountMinDecimalList[amountMinDecimalList.length - 1];
  }
  const amountMinData = calculateAmountDesiredFormatted(amountOutMin, actualDecimal);
  const amountMinDecimal = amountMinItem === '0' ? new BN(1) : new BN(amountMinItem);

  const amountOutMinBN = amountMinData.mul(actualDecimal);

  const amountMin = amountOutMinBN.isZero() ? amountMinDecimal : amountOutMinBN;

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
