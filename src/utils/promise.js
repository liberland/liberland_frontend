const resolveMappedPromises = async (promises) => {
  const keys = Object.keys(promises);
  const acc = {};
  for (let i = 0; i < keys.length; i += 1) {
    const result = await promises[keys[i]];
    acc[keys[i]] = result;
  }
  return acc;
};

export {
  resolveMappedPromises,
};
