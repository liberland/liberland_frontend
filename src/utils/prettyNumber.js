const prettyNumber = (num) => {
  if (num >= 1000) return `${num}k`;
  if (num >= 10 ** 6) return `${num}m`;
  if (num >= 10 ** 9) return `${num}b`;
  return num;
};

export default prettyNumber;
