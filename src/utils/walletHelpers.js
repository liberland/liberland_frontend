import { formatBalance } from '@polkadot/util';

export const grainsInMerit = 1000000000000;
export const grainsInDollar = 1000000000000;
export const grainsInDemocracyMerit = 1000000000000;
export const grainsInMeritDecimals = 11;

export const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export const formatMerits = (picoMerits) => formatter.format(parseInt(picoMerits) / grainsInMerit);
export const formatDemocracyMerits = (picoMerits) => formatter.format(parseInt(picoMerits) / grainsInDemocracyMerit);
export const formatDollars = (picoDollars) => formatter.format(parseInt(picoDollars) / grainsInDollar);
export const formatMeritTransaction = (merits) => {
  const prefix = parseInt(merits) > 0 ? '+' : '-';
  const absIntMerits = Math.abs(parseInt(merits));
  if (absIntMerits > grainsInMerit) {
    return `${prefix} ${formatter.format(absIntMerits / grainsInMerit)} LLM`;
  }
  return `${prefix} ${formatter.format(absIntMerits)} grains`;
};
export const formatPolkadotBalance = (polkadotBalance) => {
  const polkadotFormattedBalance = formatBalance(polkadotBalance, { withSi: false, withUnit: false, decimals: 0 });
  return parseInt(polkadotFormattedBalance.replace('.', '')) / 10;
};

export const dollarsToGrains = (dollars) => parseInt(dollars) * grainsInDollar;

export const meritsToGrains = (merits) => parseInt(merits) * grainsInDemocracyMerit;
