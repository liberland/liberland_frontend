export const grainsInMerit = 1;
export const grainsInDollar = 1000000000000;
export const grainsInDemocracyMerit = 100000000000;

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
