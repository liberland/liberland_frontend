/* eslint-disable import/no-cycle */
import { BN_ZERO } from '@polkadot/util';
import { convertAssetData } from '../../utils/dexFormatter';
import { getAdditionalAssets } from './assets';
import { getApi, submitExtrinsic } from './core';

const getSwapPriceExactTokensForTokens = async (asset1, asset2, amount, includeTax = true) => {
  const api = await getApi();

  const maybeRate = await api.call.assetConversionApi.quotePriceExactTokensForTokens(
    asset1,
    asset2,
    amount,
    includeTax,
  );
  return maybeRate.unwrapOr(null);
};

const getSwapPriceTokensForExactTokens = async (asset1, asset2, amount, includeTax = true) => {
  const api = await getApi();

  const maybeRate = await api.call.assetConversionApi.quotePriceTokensForExactTokens(
    asset1,
    asset2,
    amount,
    includeTax,
  );
  return maybeRate.unwrapOr(null);
};

const getDexReserves = async (asset1, asset2) => {
  const api = await getApi();
  const maybeReserves = await api.call.assetConversionApi.getReserves(asset1, asset2);
  if (maybeReserves.isNone) {
    return null;
  }
  const [reservesOfAsset1, reservesOfAsset2] = maybeReserves.unwrap();
  return {
    asset1: reservesOfAsset1,
    asset2: reservesOfAsset2,
  };
};

const getAssetsDataFromPool = async () => {
  const api = await getApi();
  const maybeAssetDataFromPool = await api.query.poolAssets.asset.entries();
  const data = {};
  maybeAssetDataFromPool.map((item) => {
    const asset = item[0].toHuman()[0];
    const { supply } = item[1].unwrapOr(null);
    data[asset] = { supply };
    return { supply, asset };
  });
  return data;
};

const getLpTokensOwnedByAddress = async (lpTokenId, address) => {
  const api = await getApi();
  const maybeTokens = await api.query.poolAssets.account(lpTokenId, address);

  if (maybeTokens.isNone) {
    return null;
  }
  const tokens = maybeTokens.unwrapOrDefault();
  const { balance } = tokens;
  return { balance };
};

const getDexPools = async (walletAddress) => {
  try {
    const api = await getApi();
    const pools = await api.query.assetConversion.pools.entries();
    const assetsPoolData = await getAssetsDataFromPool();
    const poolsData = await Promise.all(pools.map(async ([poolKey, maybePoolData]) => {
      const [asset1, asset2] = poolKey.args[0];
      const { lpToken } = maybePoolData.unwrapOrDefault();
      const asset1checkIsNative = asset1.value.toString();
      const asset2checkIsNative = asset2.value.toString();
      const asset2Transform = asset2checkIsNative || asset2.toString();
      const asset1Transform = asset1checkIsNative || asset1.toString();
      const lpTokenTransform = lpToken.toString();
      const [lpTokensValue, reserved, assetsData] = await Promise.all([
        getLpTokensOwnedByAddress(lpTokenTransform, walletAddress),
        getDexReserves(asset1, asset2),
        getAdditionalAssets(walletAddress, true, true),
      ]);
      const { assetData1, assetData2 } = convertAssetData(assetsData, asset1Transform, asset2Transform);
      return {
        asset1: asset1Transform,
        asset2: asset2Transform,
        assetData1,
        assetData2,
        lpToken: lpTokenTransform,
        lpTokensBalance: lpTokensValue?.balance || BN_ZERO,
        reserved,
        isStock: assetData1?.isStock || assetData2?.isStock || false,
      };
    }));
    return { poolsData, assetsPoolData };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching DEX pools:', err);
    return [];
  }
};

const getDexPoolsExtendData = async (walletAddress) => {
  try {
    const dexData = await getDexPools(walletAddress);
    return dexData;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching DEX pools with extend data: ', error);
    return [];
  }
};

const swapExactTokensForTokens = async (path, amountIn, amountOutMin, sendTo, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.assetConversion.swapExactTokensForTokens(
    path,
    amountIn,
    amountOutMin,
    sendTo,
    true,
  );
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const createNewPool = async (aAsset, bAsset, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.assetConversion.createPool(aAsset, bAsset);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const swapTokensForExactTokens = async (path, amountOut, amountInMax, sendTo, walletAddress) => {
  const api = await getApi();
  const extrinsic = api.tx.assetConversion.swapTokensForExactTokens(path, amountOut, amountInMax, sendTo, true);
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const addLiquidity = async (
  asset1,
  asset2,
  amount1Desired,
  amount2Desired,
  amount1Min,
  amount2Min,
  mintTo,
  walletAddress,
) => {
  const api = await getApi();
  const extrinsic = api.tx.assetConversion.addLiquidity(
    asset1,
    asset2,
    amount1Desired,
    amount2Desired,
    amount1Min,
    amount2Min,
    mintTo,
  );
  return submitExtrinsic(extrinsic, walletAddress, api);
};

const getLiquidityWithdrawalFee = async () => {
  const api = await getApi();
  const maybeLiquidityWithdrawalFee = await api.consts.assetConversion.liquidityWithdrawalFee;
  return Number(maybeLiquidityWithdrawalFee);
};

const removeLiquidity = async (
  asset1,
  asset2,
  lpTokenBurn,
  amount1MinReceive,
  amount2MinReceive,
  withdrawTo,
  walletAddress,
) => {
  const api = await getApi();
  const extrinsic = api.tx.assetConversion.removeLiquidity(
    asset1,
    asset2,
    lpTokenBurn,
    amount1MinReceive,
    amount2MinReceive,
    withdrawTo,
  );
  return submitExtrinsic(extrinsic, walletAddress, api);
};

export {
  getSwapPriceExactTokensForTokens,
  getSwapPriceTokensForExactTokens,
  getDexReserves,
  getLpTokensOwnedByAddress,
  getDexPools,
  getDexPoolsExtendData,
  swapExactTokensForTokens,
  createNewPool,
  swapTokensForExactTokens,
  addLiquidity,
  getLiquidityWithdrawalFee,
  removeLiquidity,
};
