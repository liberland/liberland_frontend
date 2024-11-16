import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import { getDecimalsForAsset, getExchangeRate, makeAssetToShow } from '../../../../utils/dexFormatter';
import TradeTokensModalWrapper from '../../../Modals/TradeTokens';
import AddLiquidityModalWrapper from '../../../Modals/AddLiquidityModal';
import styles from '../styles.module.scss';
import Button from '../../../Button/Button';
import ExchangeShowMore from '../ExchangeShowMore';
import { ExchangeItemPropTypes } from '../proptypes';
import RemoveLiquidityModalWrapper from '../../../Modals/RemoveLiquidity';

function ExchangeItem({ poolData, assetsPoolData }) {
  const [isShowMoreOpen, setIsShowMoreOpen] = useState(false);

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

  return (
    <Card
      title={`${asset1ToShow} / ${asset2ToShow}`}
      extra={(
        <>
          <span className={styles.liquidity}>

          </span>
          <span className={styles.liquidityValues}>

          </span>
        </>
      )}
    >
      <TradeTokensModalWrapper
        assets={assets}
        asset1ToShow={asset1ToShow}
        asset2ToShow={asset2ToShow}
        isBuy
      />
      <TradeTokensModalWrapper
        assets={assets}
        asset1ToShow={asset1ToShow}
        asset2ToShow={asset2ToShow}
      />
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
      <div className={styles.item}>
        <div className={styles.buttons}>
          <div className={styles.buttonsWithRate}>
            {asset1AmountForAsset2
            && asset2AmountForAsset1
              && (
              <div className={styles.exchangeRate}>
                <span>
                  <span className={styles.bold}>{asset1ToShow}</span>
                  {` = ${asset2AmountForAsset1} `}
                  <span className={styles.bold}>{asset2ToShow}</span>
                </span>

                <span>
                  <span className={styles.bold}>{asset2ToShow}</span>
                  {` = ${asset1AmountForAsset2} `}
                  <span className={styles.bold}>{asset1ToShow}</span>
                </span>
              </div>
              )}
            {(assetData1?.name || assetData2?.name) && (
              <div className={styles.exchangeName}>
                <span>
                  <span className={styles.bold}>
                    {asset1ToShow}
                  </span>
                  {' '}
                  name:
                  {' '}
                  {asset1 === 'Native' ? 'Liberland dollar' : assetData1.name}
                </span>
                <span>
                  <span className={styles.bold}>
                    {asset2ToShow}
                  </span>
                  {' '}
                  name:
                  {' '}
                  {asset2 === 'Native' ? 'Liberland dollar' : assetData2.name}
                </span>
              </div>
            )}
          </div>
          <div>
            <Button
              small
              green
              onClick={() => setIsShowMoreOpen((prevState) => !prevState)}
            >
              {isShowMoreOpen ? 'Show less' : 'Show more'}
            </Button>
          </div>
        </div>
        {isShowMoreOpen && (
        <ExchangeShowMore
          asset1={asset1}
          asset2={asset2}
          asset1ToShow={asset1ToShow}
          asset2ToShow={asset2ToShow}
          liquidity={liquidity}
          reserved={reserved}
          lpTokensBalance={lpTokensBalance}
          asset1Decimals={assetData1?.decimals}
          asset2Decimals={assetData2?.decimals}
          isReservedDataEmpty={isReservedDataEmpty}
        />
        )}
      </div>
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
