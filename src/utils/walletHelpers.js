import { BN, formatBalance } from '@polkadot/util';

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

export const formatDemocracyMerits = (picoMerits) => formatter.format(valueToBN(picoMerits).div(grainsInDemocracyMerit));

export const formatDollars = (picoDollars) => formatter.format(valueToBN(picoDollars).div(grainsInDollar));
export const formatMeritTransaction = (merits_raw) => {
  const merits = valueToBN(merits_raw);
  const prefix = merits.gt(0) ? '+' : '-';
  const absIntMerits = merits.abs();
  if (absIntMerits.gt(grainsInMerit)) {
    return `${prefix} ${formatter.format(absIntMerits.div(grainsInMerit))} LLM`;
  }
  return `${prefix} ${formatter.format(absIntMerits)} grains`;
};
export const formatPolkadotBalance = (polkadotBalance) => {
  const polkadotFormattedBalance = formatBalance(polkadotBalance, { withSi: false, withUnit: false, decimals: 0 });
  return valueToBN(polkadotFormattedBalance.replace('.', '')).div(10);
};

export const dollarsToGrains = (dollars) => valueToBN(dollars).mul(grainsInDollar);

export const meritsToGrains = (merits) => valueToBN(merits).mul(grainsInDemocracyMerit);
