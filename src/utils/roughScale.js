const roughScale = (x, base) => {
  if (Number.isSafeInteger(x)) { return x; }
  const parsed = parseInt(x, base);
  if (Number.isNaN(parsed)) { return 0; }
  return ((parsed * 100) / 100);
};

export default roughScale;
