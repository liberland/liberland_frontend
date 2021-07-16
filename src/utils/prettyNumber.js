import matchPowHelper from './matchPowHelper';

const prettyNumber = (num) => {
  if (num >= 1000) return `${(matchPowHelper(num) / 1000).toFixed(2)}k`;
  if (num >= 10 ** 6) return `${(matchPowHelper(num) / (10 ** 6)).toFixed(2)}m`;
  if (num >= 10 ** 9) return `${(matchPowHelper(num) / (10 ** 9)).toFixed(2)}b`;
  return num;
};

export default prettyNumber;
