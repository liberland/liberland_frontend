import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getDecimalsForAsset, getExchangeRate, makeAssetToShow } from '../../../../utils/dexFormatter';
import TradeTokensModalWrapper from '../../../Modals/TradeTokens';
import AddLiquidityModalWrapper from '../../../Modals/AddLiquidityModal';
import styles from '../styles.module.scss';
import Button from '../../../Button/Button';
import ExchangeShowMore from '../ExchangeShowMore';
import { ExchangeItemPropTypes } from '../proptypes';
import RemoveLiquidityModalWrapper from '../../../Modals/RemoveLiquidity';

function ExchangeItem({ poolData, assetsPoolData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBuyTrade, setIsBuyTrade] = useState(false);
  const [isShowMoreOpen, setIsShowMoreOpen] = useState(false);
  const [isOpenLiquidityModal, setIsOpenLiquidityModal] = useState(false);
  const [isModalRemoveLiquidityOpen, setIsModalRemoveLiquidityOpen] = useState(false);
  const handleModalLiquidity = () => setIsOpenLiquidityModal(
    (prevValue) => !prevValue,
  );

  const handleModal = () => setIsModalOpen((prevValue) => !prevValue);
  const handleModalLiquidityRemove = () => setIsModalRemoveLiquidityOpen((prevValue) => !prevValue);
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

  const swapPriceTokensForExactTokens = getExchangeRate(
    reserved?.asset1,
    reserved?.asset2,
    decimals1,
    decimals2,
  );
  const swapPriceExactTokensForTokens = getExchangeRate(
    reserved?.asset2,
    reserved?.asset1,
    decimals2,
    decimals1,
  );

  const liquidity = assetsPoolData[lpToken]?.supply;

  const isReservedDataEmpty = reserved ? (reserved?.asset2?.isEmpty || reserved?.asset1?.isEmpty) : true;

  return (
    <>
      {isModalOpen && (
        <TradeTokensModalWrapper
          handleModal={handleModal}
          assets={assets}
          isBuy={isBuyTrade}
        />
      )}
      {isOpenLiquidityModal && (
        <AddLiquidityModalWrapper
          handleModal={handleModalLiquidity}
          assets={assets}
          isReservedDataEmpty={isReservedDataEmpty}
        />
      )}
      {isModalRemoveLiquidityOpen && (
        <RemoveLiquidityModalWrapper
          handleModal={handleModalLiquidityRemove}
          assets={assets}
          reserved={reserved}
          lpTokensBalance={lpTokensBalance}
          liquidity={liquidity}
        />
      )}
      <div className={styles.item}>
        <div className={styles.buttons}>
          <div className={styles.buttonsWithRate}>
            <div className={styles.transactionButtons}>
              <Button
                disabled={!reserved}
                small
                primary
                onClick={() => {
                  handleModal();
                  setIsBuyTrade(false);
                }}
              >
                SELL
                {' '}
                {asset1ToShow}
                {' '}
                FOR
                {' '}
                {asset2ToShow}
              </Button>
              <Button
                disabled={!reserved}
                small
                primary
                onClick={() => {
                  handleModal();
                  setIsBuyTrade(true);
                }}
              >
                BUY
                {' '}
                {asset1ToShow}
                {' '}
                FOR
                {' '}
                {asset2ToShow}
              </Button>
            </div>
            {swapPriceTokensForExactTokens
            && swapPriceExactTokensForTokens
              && (
              <div className={styles.exchangeRate}>
                <span>
                  <span className={styles.bold}>{asset1ToShow}</span>
                  {` = ${swapPriceExactTokensForTokens} `}
                  <span className={styles.bold}>{asset2ToShow}</span>
                </span>

                <span>
                  <span className={styles.bold}>{asset2ToShow}</span>
                  {` = ${swapPriceTokensForExactTokens} `}
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
          handleModalLiquidityRemove={handleModalLiquidityRemove}
          handleModalLiquidity={handleModalLiquidity}
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
    </>
  );
}

ExchangeItem.propTypes = {
  poolData: PropTypes.shape(ExchangeItemPropTypes).isRequired,
  assetsPoolData: PropTypes.shape({
    supply: PropTypes.string,
  }).isRequired,
};

export default ExchangeItem;
