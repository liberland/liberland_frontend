import {
  BN, BN_ONE, BN_ZERO, formatBalance,
} from '@polkadot/util';
import { ethers } from 'ethers';

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

const _format = (value, decimals) => formatBalance(
  valueToBN(value),
  {
    decimals,
    forceUnit: '-',
    withSi: false,
    locale: 'en',
  },
);

const _parse = (value, decimals) => {
  const ethersBN = ethers.utils.parseUnits(value, decimals);
  return new BN(ethersBN.toHexString().replace(/^0x/, ''), 'hex');
};

export const formatMerits = (grains) => _format(grains, meritDecimals);
export const formatDollars = (grains) => _format(grains, dollarDecimals);
export const parseMerits = (merits) => _parse(merits, meritDecimals);
export const parseDollars = (dollars) => _parse(dollars, dollarDecimals);

export const formatTransaction = (value_raw, bigSymbol, smallSymbol, decimals) => {
  const value = valueToBN(value_raw);
  const prefix = value.gt(BN_ZERO) ? '+' : '-';
  const absIntvalue = value.abs();
  if (_parse(absIntvalue, decimals).gt(BN_ONE)) {
    return `${prefix} ${_format(absIntvalue, decimals)} ${bigSymbol}`;
  }
  return `${prefix} ${_format(absIntvalue, 0)} ${smallSymbol}`;
};

export const formatMeritTransaction = (merits_raw) => formatTransaction(merits_raw, 'LLM', 'grains', meritDecimals);
export const formatDollarTransaction = (dollars_raw) => formatTransaction(
  dollars_raw,
  'LLD',
  'picoLLD',
  dollarDecimals,
);
