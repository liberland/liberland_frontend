import React, { useState, useMemo } from 'react';
import { getExchangeRate, makeAssetToShow } from '../../../../utils/dexFormater';
import TradeTokensModalWrapper from '../../../Modals/TradeTokens';
import AddLiquidityModalWrapper from '../../../Modals/AddLiquidityModal';
import styles from '../styles.module.scss';
import Button from '../../../Button/Button';
import ExchangeShowMore from '../ExchangeShowMore';
import { ExchangeItemPropTypes } from '../proptypes';

function ExchangeItem({ dex }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBuyTrade, setIsBuyTrade] = useState(false);
  const [isShowMoreOpen, setIsShowMoreOpen] = useState(false);
  const [isOpenLiquidityModal, setIsOpenLiquidityModal] = useState(false);
  const handleModalLiquidity = () => setIsOpenLiquidityModal(
    (prevValue) => !prevValue,
  );
  const handleModal = () => setIsModalOpen((prevValue) => !prevValue);
  const {
    asset1,
    asset2,
    lpTokensBalance,
    liquidity,
    assetData1,
    assetData2,
    reserved,
  } = dex;

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

  const swapPriceTokensForExactTokens = getExchangeRate(
    reserved?.asset1,
    reserved?.asset2,
    assetData1?.decimals,
    assetData2?.decimals,
  );
  const swapPriceExactTokensForTokens = getExchangeRate(
    reserved?.asset2,
    reserved?.asset1,
    assetData2?.decimals,
    assetData1?.decimals,
  );

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
                  {` = ${swapPriceTokensForExactTokens} `}
                  <span className={styles.bold}>{asset2ToShow}</span>
                </span>

                <span>
                  <span className={styles.bold}>{asset2ToShow}</span>
                  {` = ${swapPriceExactTokensForTokens} `}
                  <span className={styles.bold}>{asset1ToShow}</span>
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
        />
        )}
      </div>
    </>
  );
}

ExchangeItem.propTypes = {
  dex: ExchangeItemPropTypes.isRequired,
};

export default ExchangeItem;
