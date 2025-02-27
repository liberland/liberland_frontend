import { BN_ZERO } from '@polkadot/util';
import { valueToBN } from '../../../../utils/walletHelpers';

const alphabetSort = (aPoolData, bPoolData) => (aPoolData.assetData1?.symbol || 'LLD')
  .localeCompare(bPoolData.assetData1?.symbol || 'LLD') || (aPoolData.assetData2?.symbol || 'LLD')
  .localeCompare(bPoolData.assetData2?.symbol || 'LLD');

const getNativeLiquidity = (poolData) => {
  if (poolData.asset1 === 'Native') {
    return poolData.reserved ? valueToBN(poolData.reserved.asset1) : BN_ZERO;
  }
  if (poolData.asset2 === 'Native') {
    return poolData.reserved ? valueToBN(poolData.reserved.asset2) : BN_ZERO;
  }
  throw new Error('Wrong use of liquidity fn');
};

export const sortByMap = {
  'LLD first': (aPoolData, _, bPoolData, __) => {
    const aHasNative = aPoolData.asset1 === 'Native' || aPoolData.asset2 === 'Native' ? 1 : -1;
    const bHasNative = bPoolData.asset1 === 'Native' || bPoolData.asset2 === 'Native' ? 1 : -1;
    if (aHasNative === 1 && bHasNative === 1) {
      const aLiq = getNativeLiquidity(aPoolData);
      const bLiq = getNativeLiquidity(bPoolData);
      return bLiq.gt(aLiq) ? 1 : -1;
    }
    if (aHasNative === -1 && bHasNative === -1) {
      return alphabetSort(aPoolData, bPoolData);
    }
    return bHasNative - aHasNative;
  },
  Alphabetically: (aPoolData, _, bPoolData, __) => alphabetSort(aPoolData, bPoolData),
  'By liquidity': (aPoolData, aAssetsPoolData, bPoolData, bAssetsPoolData) => {
    const aLiquidity = aAssetsPoolData[aPoolData.lpToken]?.supply || 0;
    const bLiquidity = bAssetsPoolData[bPoolData.lpToken]?.supply || 0;
    return aLiquidity - bLiquidity;
  },
};
