import { formatBalance } from '@polkadot/util';

export const grainsInDollar = 1000000000000;

export const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

export const formatMerits = (picoMerits) => formatter.format(parseInt(picoMerits));
export const formatDollars = (picoDollars) => formatter.format(parseInt(picoDollars) / grainsInDollar);
export const formatMeritTransaction = (merits) => {
  const prefix = parseInt(merits) > 0 ? '+' : '-';
  const absIntMerits = Math.abs(parseInt(merits));
  return `${prefix} ${formatter.format(absIntMerits)} LLM`;
};
export const formatPolkadotBalance = (polkadotBalance) => {
  const polkadotFormattedBalance = formatBalance(polkadotBalance, { withSi: false, withUnit: false, decimals: 0 });
  return parseInt(polkadotFormattedBalance.replace('.', '')) / 10;
};

export const dollarsToGrains = (dollars) => parseInt(dollars) * grainsInDollar;
