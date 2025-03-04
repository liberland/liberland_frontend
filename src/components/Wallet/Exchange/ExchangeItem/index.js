import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import { useMediaQuery } from 'usehooks-ts';
import { useLocation } from 'react-router-dom';
import { getDecimalsForAsset, getExchangeRate, makeAssetToShow } from '../../../../utils/dexFormatter';
import { formatAssets } from '../../../../utils/walletHelpers';
import TradeTokensModalWrapper from '../../../Modals/TradeTokens';
import AddLiquidityModal from '../../../Modals/AddLiquidityModal';
import styles from './styles.module.scss';
import { ExchangeItemPropTypes } from '../proptypes';
import RemoveLiquidityModalWrapper from '../../../Modals/RemoveLiquidity';
import CurrencyIcon from '../../../CurrencyIcon';

function ExchangeItem({ poolData, assetsPoolData }) {
  const location = useLocation();
  const {
    asset1,
    asset2,
    lpTokensBalance,
    assetData1,
    assetData2,
    reserved,
    lpToken,
  } = poolData;
  const asset1ToShow = useMemo(() => makeAssetToShow(asset1, assetData1?.symbol), [assetData1, asset1]);
  const asset2ToShow = useMemo(() => makeAssetToShow(asset2, assetData2?.symbol), [assetData2, asset2]);
  const asset1Name = asset1 === 'Native' ? 'Liberland dollar' : assetData1.name;
  const asset2Name = asset2 === 'Native' ? 'Liberland dollar' : assetData2.name;
  const assets = {
    asset1,
    asset2,
    assetData1,
    assetData2,
    asset1ToShow,
    asset2ToShow,
    reserved,
  };

  const decimals1 = getDecimalsForAsset(asset1, assetData1?.decimals);
  const decimals2 = getDecimalsForAsset(asset2, assetData2?.decimals);

  const asset1AmountForAsset2 = getExchangeRate(
    reserved?.asset1,
    reserved?.asset2,
    decimals1,
    decimals2,
  );
  const asset2AmountForAsset1 = getExchangeRate(
    reserved?.asset2,
    reserved?.asset1,
    decimals2,
    decimals1,
  );

  const liquidity = assetsPoolData[lpToken]?.supply;

  const isReservedDataEmpty = reserved ? (reserved?.asset2?.isEmpty || reserved?.asset1?.isEmpty) : true;

  const liqPoolDescription = (
    <div className={styles.liquidityPool}>
      <span className="description">
        Liquidity pool
      </span>
      &nbsp;
      <span className="values">
        {formatAssets(reserved?.asset1 || '0', decimals1, { symbol: asset1ToShow, optionalAll: true })}
        {' / '}
        {formatAssets(reserved?.asset2 || '0', decimals2, { symbol: asset2ToShow, optionalAll: true })}
      </span>
    </div>
  );

  const isBiggerThanDesktop = useMediaQuery('(min-width: 1500px)');
  const name1 = (
    <Flex wrap gap="5px" align="center">
      {asset1ToShow}
      <CurrencyIcon size={20} symbol={asset1ToShow} />
    </Flex>
  );
  const name2 = (
    <Flex wrap gap="5px" align="center">
      {asset2ToShow}
      <CurrencyIcon size={20} symbol={asset2ToShow} />
    </Flex>
  );

  const areDexQuerySamePair = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const dexQuery = params.get('dex');

    if (!dexQuery) return false;

    const pair = dexQuery.split('/').map((item) => item.toLowerCase());

    const asset1Text = asset1ToShow.toLowerCase();
    const asset2Text = asset2ToShow.toLowerCase();

    return (
      (pair[0] === asset1Text && pair[1] === asset2Text)
      || (pair[0] === asset2Text && pair[1] === asset1Text)
    );
  }, [asset1ToShow, asset2ToShow, location.search]);

  return (
    <Card
      title={(
        <Flex wrap gap="15px">
          {name1}
          <span>/</span>
          {name2}
        </Flex>
      )}
      extra={isBiggerThanDesktop ? liqPoolDescription : undefined}
    >
      {!isBiggerThanDesktop && liqPoolDescription}
      <Flex wrap gap="15px">
        <Flex wrap gap="15px" flex={0.8} justify="space-between">
          <Flex wrap gap="15px" align="center" flex={0.5}>
            <div>
              <div className="description">
                {'1 '}
                {asset1Name}
              </div>
              <div className="values">
                {asset2AmountForAsset1}
                {' '}
                {asset2Name}
              </div>
            </div>
          </Flex>
          <Flex wrap gap="15px" align="center" flex={0.5}>
            <div>
              <div className="description">
                {'1 '}
                {asset2Name}
              </div>
              <div className="values">
                {asset1AmountForAsset2}
                {' '}
                {asset1Name}
              </div>
            </div>
          </Flex>
        </Flex>
        <div className={styles.liquidityWrapper}>
          <Flex gap="15px" wrap>
            <TradeTokensModalWrapper
              assets={assets}
              asset1ToShow={asset1ToShow}
              asset2ToShow={asset2ToShow}
              isOpenOnRender={areDexQuerySamePair}
            />
            <AddLiquidityModal
              assets={assets}
              isReservedDataEmpty={isReservedDataEmpty}
            />
            {reserved && (
              <RemoveLiquidityModalWrapper
                assets={assets}
                reserved={reserved}
                lpTokensBalance={lpTokensBalance}
                liquidity={liquidity}
              />
            )}
          </Flex>
        </div>
      </Flex>
    </Card>
  );
}

ExchangeItem.propTypes = {
  poolData: PropTypes.shape(ExchangeItemPropTypes).isRequired,
  assetsPoolData: PropTypes.shape({
    supply: PropTypes.string,
  }).isRequired,
};

export default ExchangeItem;
