export const isCompanyConnected = (asset) => asset.company
  ?.relevantAssets
  ?.some(({ assetId }) => assetId?.value?.toString() === asset.index?.toString());
