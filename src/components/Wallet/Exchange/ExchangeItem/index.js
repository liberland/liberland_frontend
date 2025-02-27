import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import { useMediaQuery } from 'usehooks-ts';
import { useLocation, useHistory } from 'react-router-dom';
import { getDecimalsForAsset, getExchangeRate, makeAssetToShow } from '../../../../utils/dexFormatter';
import { formatAssets } from '../../../../utils/walletHelpers';
import TradeTokensModalWrapper from '../../../Modals/TradeTokens';
import AddLiquidityModal from '../../../Modals/AddLiquidityModal';
import styles from './styles.module.scss';
import { ExchangeItemPropTypes } from '../proptypes';
import RemoveLiquidityModalWrapper from '../../../Modals/RemoveLiquidity';
import CurrencyIcon from '../../../CurrencyIcon';
import { isCompanyConnected } from '../../../../utils/asset';
import router from '../../../../router';
import Button from '../../../Button/Button';

function ExchangeItem({ poolData, assetsPoolData }) {
  const history = useHistory();
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
    <Flex vertical gap="3px" className={styles.liquidityPool}>
      <span className="description">
        Liquidity pool
      </span>
      <span className="values">
        {formatAssets(reserved?.asset1 || '0', decimals1, { symbol: asset1ToShow, optionalAll: true })}
        {' / '}
        {formatAssets(reserved?.asset2 || '0', decimals2, { symbol: asset2ToShow, optionalAll: true })}
      </span>
    </Flex>
  );

  const isBiggerThanDesktop = useMediaQuery('(min-width: 1500px)');
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 1200px)');
  const isConnected1 = isCompanyConnected({ index: asset1, ...assetData1 });
  const isConnected2 = isCompanyConnected({ index: asset2, ...assetData2 });
  const logo1 = isConnected1 ? assetData1.company.logoURL : undefined;
  const logo2 = isConnected2 ? assetData2.company.logoURL : undefined;
  const companyLink1 = isConnected1 ? router.companies.view.replace(':companyId', assetData1.company.id) : undefined;
  const companyLink2 = isConnected2 ? router.companies.view.replace(':companyId', assetData2.company.id) : undefined;
  const showCompanyNames = isConnected1 && isConnected2;
  const showCompanyLink1 = isConnected1 ? (
    <Button key="comp1" primary href={companyLink1} onClick={() => history.push(companyLink1)}>
      Show company
      {showCompanyNames && ` ${asset1ToShow}`}
    </Button>
  ) : undefined;
  const showCompanyLink2 = isConnected2 ? (
    <Button key="comp2" primary href={companyLink2} onClick={() => history.push(companyLink2)}>
      Show company
      {showCompanyNames && ` ${asset2ToShow}`}
    </Button>
  ) : undefined;
  const companyLinks = [
    showCompanyLink1,
    showCompanyLink2,
  ];

  const name1 = (
    <Flex wrap gap="5px" align="center">
      {asset1ToShow}
      <CurrencyIcon size={20} symbol={asset1ToShow} logo={logo1} />
    </Flex>
  );
  const name2 = (
    <Flex wrap gap="5px" align="center">
      {asset2ToShow}
      <CurrencyIcon size={20} symbol={asset2ToShow} logo={logo2} />
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
      <Flex wrap gap="15px" vertical={!isBiggerThanDesktop} align={isBiggerThanDesktop ? 'center' : undefined}>
        <Flex wrap gap="15px" flex={1} vertical={!isBiggerThanSmallScreen} justify="space-between">
          <Flex wrap gap="15px" align="center" flex={0.5}>
            <CurrencyIcon size={40} symbol={asset1ToShow} logo={logo1} />
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
            <CurrencyIcon size={40} symbol={asset2ToShow} logo={logo2} />
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
        <Flex vertical gap="15px">
          <Flex gap="15px" wrap justify={isBiggerThanDesktop ? 'end' : undefined}>
            <TradeTokensModalWrapper
              assets={assets}
              asset1ToShow={asset1ToShow}
              asset2ToShow={asset2ToShow}
              isOpenOnRender={areDexQuerySamePair}
              companyLinks={companyLinks}
            />
            <AddLiquidityModal
              assets={assets}
              isReservedDataEmpty={isReservedDataEmpty}
            />
          </Flex>
          {reserved && (
            <Flex wrap gap="15px" justify="end">
              <RemoveLiquidityModalWrapper
                assets={assets}
                reserved={reserved}
                lpTokensBalance={lpTokensBalance}
                liquidity={liquidity}
              />
            </Flex>
          )}
          <Flex wrap gap="15px" justify="end">
            {companyLinks}
          </Flex>
        </Flex>
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
