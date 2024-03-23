import { formatBalance } from '@polkadot/util';
import { formatAssets, formatDollars, formatMerits } from './walletHelpers';

export function convertToEnumDex(asset1, asset2) {
  const enum1 = asset1 === 'Native' ? asset1 : { Asset: asset1 };
  const enum2 = asset2 === 'Native' ? asset2 : { Asset: asset2 };
  return { enum1, enum2 };
}

export const formatter = (v) => formatBalance(
  v,
  {
    decimals: 12, forceUnit: '-', withSi: false, locale: 'en', withZero: false,
  },
);

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

export const formatPropertlyValue = (asset, value, symbol) => {
  let formattedValue;

  if (asset === 'Native') {
    formattedValue = formatDollars(value);
  } else if (asset === '1') {
    formattedValue = formatMerits(value);
  } else {
    formattedValue = formatAssets(value);
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
  return decimal || 1;
};
