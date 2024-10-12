export const BLOCKS_PER_DAY = 24 * (3600 / 6);
export const daysToBlocks = (days) => parseInt(days) * BLOCKS_PER_DAY;

export const setMetadataCache = (genesisHash, specVersion, metadata) => {
  localStorage.substrateApiMetadata = JSON.stringify({
    [`${genesisHash}-${specVersion}`]: metadata,
  });
};

export const getMetadataCache = () => {
  const metadataEncoded = localStorage.substrateApiMetadata;
  if (metadataEncoded) {
    return JSON.parse(metadataEncoded);
  }

  return undefined;
};

export const getNestedValue = (data, path) => path.reduce((acc, key) => acc && acc[key], data);
