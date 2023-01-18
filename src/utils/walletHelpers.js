import { BN, BN_ZERO, formatBalance } from '@polkadot/util';

export const grainsInMerit = new BN('1000000000000');
export const grainsInDollar = new BN('1000000000000');
export const grainsInDemocracyMerit = new BN('1000000000000');

export const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

// take string or number and parse to BN using correct base
const valueToBN = (s) => {
  if (s.startsWith && s.startsWith('0x')) {
    return new BN(s.slice(2), 16);
  }
  return new BN(s);
};

export const formatMerits = (picoMerits) => formatter.format(valueToBN(picoMerits).div(grainsInMerit));

// eslint-disable-next-line max-len
export const formatDemocracyMerits = (picoMerits) => formatter.format(valueToBN(picoMerits).div(grainsInDemocracyMerit));

export const formatDollars = (picoDollars) => formatter.format(valueToBN(picoDollars).div(grainsInDollar));
export const formatPolkadotBalance = (polkadotBalance) => {
  const polkadotFormattedBalance = formatBalance(polkadotBalance, { withSi: false, withUnit: false, decimals: 0 });
  return valueToBN(polkadotFormattedBalance.replace('.', '')).div(new BN(10)).toString();
};

export const dollarsToGrains = (dollars) => valueToBN(dollars).mul(grainsInDollar);

export const meritsToGrains = (merits) => valueToBN(merits).mul(grainsInDemocracyMerit);

export const formatTransaction = (value_raw, bigSymbol, smallSymbol, decimals) => {
  const value = valueToBN(value_raw);
  const prefix = value.gt(BN_ZERO) ? '+' : '-';
  const absIntvalue = value.abs();
  if (absIntvalue.gt(decimals)) {
    return `${prefix} ${formatter.format(absIntvalue.div(decimals))} ${bigSymbol}`;
  }
  return `${prefix} ${formatter.format(absIntvalue)} ${smallSymbol}`;
};

export const formatMeritTransaction = (merits_raw) => formatTransaction(merits_raw, 'LLM', 'grains', grainsInMerit);
// eslint-disable-next-line max-len
export const formatDollarTransaction = (dollars_raw) => formatTransaction(dollars_raw, 'LLD', 'picoLLD', grainsInDollar);
