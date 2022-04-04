export const formatMerits = (picoMerits) => {
  return (parseInt(picoMerits) * Math.pow(10, -12)).toFixed(2);
};
