import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import { useMediaQuery } from 'usehooks-ts';
import { getDecimalsForAsset, getExchangeRate, makeAssetToShow } from '../../../../utils/dexFormatter';
import { formatAssets } from '../../../../utils/walletHelpers';
import TradeTokensModalWrapper from '../../../Modals/TradeTokens';
import AddLiquidityModalWrapper from '../../../Modals/AddLiquidityModal';
import styles from './styles.module.scss';
import { ExchangeItemPropTypes } from '../proptypes';
import RemoveLiquidityModalWrapper from '../../../Modals/RemoveLiquidity';

function ExchangeItem({ poolData, assetsPoolData }) {
  const {
    asset1,
    asset2,
    lpTokensBalance,
    assetData1,
    assetData2,
    reserved,
    lpToken,
  } = poolData;
  const asset1ToShow = React.useMemo(() => makeAssetToShow(asset1, assetData1?.symbol), [assetData1, asset1]);
  const asset2ToShow = React.useMemo(() => makeAssetToShow(asset2, assetData2?.symbol), [assetData2, asset2]);
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
      <span className={styles.description}>
        Liquidity pool
      </span>
      &nbsp;
      <span className={styles.values}>
        {formatAssets(reserved?.asset1 || '0', decimals1, { symbol: asset1ToShow, optionalAll: true })}
        {' / '}
        {formatAssets(reserved?.asset2 || '0', decimals2, { symbol: asset2ToShow, optionalAll: true })}
      </span>
    </div>
  );

  const isBiggerThanDesktop = useMediaQuery('(min-width: 1500px)');

  return (
    <Card
      title={`${asset1ToShow} / ${asset2ToShow}`}
      extra={isBiggerThanDesktop ? liqPoolDescription : undefined}
    >
      {!isBiggerThanDesktop && liqPoolDescription}
      <Flex wrap gap="15px">
        <Flex wrap gap="15px">
          <TradeTokensModalWrapper
            assets={assets}
            asset1ToShow={asset1ToShow}
            asset2ToShow={asset2ToShow}
            isBuy
          />
          <div>
            <div className={styles.description}>
              {'1 '}
              {asset1Name}
            </div>
            <div className={styles.values}>
              {asset2AmountForAsset1}
              {' '}
              {asset2Name}
            </div>
          </div>
        </Flex>
        <Flex wrap gap="15px">
          <TradeTokensModalWrapper
            assets={assets}
            asset1ToShow={asset1ToShow}
            asset2ToShow={asset2ToShow}
          />
          <div>
            <div className={styles.description}>
              {'1 '}
              {asset2Name}
            </div>
            <div className={styles.values}>
              {asset1AmountForAsset2}
              {' '}
              {asset1Name}
            </div>
          </div>
        </Flex>
        <div className={styles.liquidityWrapper}>
          <Flex gap="15px" wrap>
            <AddLiquidityModalWrapper
              assets={assets}
              isReservedDataEmpty={isReservedDataEmpty}
            />
            <RemoveLiquidityModalWrapper
              assets={assets}
              reserved={reserved}
              lpTokensBalance={lpTokensBalance}
              liquidity={liquidity}
            />
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
