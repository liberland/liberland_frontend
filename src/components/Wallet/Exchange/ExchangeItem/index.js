import React, { useState, useMemo } from 'react';
import { makeAssetToShow } from '../../../../utils/dexFormater';
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
    swapPriceTokensForExactTokens,
    swapPriceExactTokensForTokens,
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
          swapPriceExactTokensForTokens={swapPriceExactTokensForTokens}
          swapPriceTokensForExactTokens={swapPriceTokensForExactTokens}
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
