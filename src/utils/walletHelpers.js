import {
  BN, BN_ONE, BN_ZERO, formatBalance,
} from '@polkadot/util';
import { ethers } from 'ethers';
import { parseInt } from 'lodash';

const meritDecimals = 12;
const dollarDecimals = 12;

// take string or number and parse to BN using correct base
export const valueToBN = (i) => {
  const s = i.toString();
  if (s.startsWith && s.startsWith('0x')) {
    return new BN(s.slice(2), 16);
  }
  return new BN(s);
};

const _format = ((value, decimals) => formatBalance(
  valueToBN(value),
  {
    decimals,
    forceUnit: '-',
    withSi: false,
    locale: 'en',
    withZero: false,
  },
));

const _parse = (value, decimals) => {
  const ethersBN = ethers.utils.parseUnits(value, decimals);
  return new BN(ethersBN.toHexString().replace(/^0x/, ''), 'hex');
};

export const formatMerits = (grains) => _format(grains, meritDecimals);
export const formatDollars = (grains) => _format(grains, dollarDecimals);
export const parseMerits = (merits) => _parse(merits, meritDecimals);
export const parseDollars = (dollars) => _parse(dollars, dollarDecimals);
export const parseAssets = (assets, assetDecimals) => _parse(assets, assetDecimals);
export const formatAssets = (assets, assetDecimals) => _format(assets, Number(assetDecimals));

const configDefault = {
  isSymbolFirst: false,
  isAsset: false,
};

export const formatTransaction = (value_raw, bigSymbol, smallSymbol, decimals, config = configDefault) => {
  const value = valueToBN(value_raw);
  const prefix = value.gt(BN_ZERO) ? '+' : '-';
  const absIntvalue = value.abs();

  if (_parse(absIntvalue.toString(), decimals).gt(BN_ONE)) {
    const formatValue = _format(absIntvalue, config.isAsset ? parseInt(decimals) : decimals);
    return config.isSymbolFirst
      ? `${bigSymbol} ${prefix}${formatValue}`
      : `${prefix} ${formatValue} ${bigSymbol}`;
  }

  return config.isSymbolFirst
    ? `${smallSymbol} ${prefix}${_format(absIntvalue, 0)}`
    : `${prefix} ${_format(absIntvalue, 0)} ${smallSymbol}`;
};

export const formatMeritTransaction = (merits_raw, config = configDefault) => formatTransaction(
  merits_raw,
  'LLM',
  'grains',
  meritDecimals,
  config,
);

export const formatDollarTransaction = (dollars_raw, config = configDefault) => formatTransaction(
  dollars_raw,
  'LLD',
  'picoLLD',
  dollarDecimals,
  config,
);

export const formatAssetTransaction = (dollars_raw, asset, decimals, config = configDefault) => formatTransaction(
  dollars_raw,
  asset,
  asset,
  decimals,
  config,
);
