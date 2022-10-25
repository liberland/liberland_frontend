import matchPowHelper from './matchPowHelper';

const prettyNumber = (num, nomalize = true) => {
  let normalizeNum = num;
  if (nomalize) {
    normalizeNum = matchPowHelper(num);
  }
  if (normalizeNum >= 1000) return `${(normalizeNum / 1000).toFixed(2)}k`;
  if (normalizeNum >= 10 ** 6) return `${(normalizeNum / (10 ** 6)).toFixed(2)}m`;
  if (normalizeNum >= 10 ** 9) return `${(normalizeNum / (10 ** 9)).toFixed(2)}b`;
  return normalizeNum.toFixed(2);
};

export default prettyNumber;
