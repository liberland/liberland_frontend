export const concatNameWithPrefix = (name, prefix) => {
  if (!prefix) {
    return name;
  }
  const normalizedName = Array.isArray(name) ? name : [name];
  return [prefix, ...normalizedName];
};
