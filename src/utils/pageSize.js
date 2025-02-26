export const getDefaultPageSizes = (start) => {
  const defaults = [5, 10, 20, 50, 100];
  return { pageSizeOptions: [start, ...defaults.filter((d) => d > start)] };
};
