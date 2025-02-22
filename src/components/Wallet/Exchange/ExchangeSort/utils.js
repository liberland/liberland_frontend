export const sortByMap = {
  Alphabetically: (aPoolData, _, bPoolData, __) => (aPoolData.assetData1?.symbol || 'LLD')
    .localeCompare(bPoolData.assetData1?.symbol || 'LLD') || (aPoolData.assetData2?.symbol || 'LLD')
    .localeCompare(bPoolData.assetData2?.symbol || 'LLD'),
  'By liquidity': (aPoolData, aAssetsPoolData, bPoolData, bAssetsPoolData) => {
    const aLiquidity = aAssetsPoolData[aPoolData.lpToken]?.supply || 0;
    const bLiquidity = bAssetsPoolData[bPoolData.lpToken]?.supply || 0;
    return aLiquidity - bLiquidity;
  },
};
