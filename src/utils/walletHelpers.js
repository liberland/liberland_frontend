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
  if (_parse(absIntvalue.toString(), decimals).gt(BN_ONE)) {
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

export const waitForInjectedWeb3 = async () => {
  const delay = (time) => new Promise((resolve) => { setTimeout(resolve, time); });
  const timeout = 5000;
  const start = Date.now();
  const interval = 100;

  // wait up to 5s for first extension
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await delay(interval);
    if (Date.now() - start > timeout) break;
    if (window.injectedWeb3) break;
  }

  // after first extension, debounce new ones
  let extensions = Object.keys(window.injectedWeb3).length;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await delay(interval);
    const newCount = Object.keys(window.injectedWeb3).length;
    if (extensions === newCount) break;
    extensions = newCount;
  }
};
