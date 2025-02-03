import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import { useMediaQuery } from 'usehooks-ts';
import { formatAssets } from '../../../utils/walletHelpers';
import SendAssetModal from '../../Modals/SendAssetModal';
import styles from './styles.module.scss';
import MoneyCard from '../../MoneyCard';
import CurrencyIcon from '../../CurrencyIcon';

function AssetOverview({
  additionalAssets,
  isRemarkNeeded,
  officeType,
  userIsMember,
  isCongress,
}) {
  const filteredAssets = useMemo(
    () => additionalAssets?.filter((asset) => asset?.balance?.balance > 0) || [],
    [additionalAssets],
  );
  const isBiggerThanDesktop = useMediaQuery('(min-width: 1500px)');
  const renderItem = (assetData) => (
    <MoneyCard
      actions={!isCongress || userIsMember ? [
        <SendAssetModal
          isRemarkNeeded={isRemarkNeeded}
          assetData={assetData}
          officeType={officeType}
        />,
      ] : undefined}
      amount={(
        <>
          {formatAssets(
            assetData.balance?.balance || '0',
            assetData.metadata.decimals,
            true,
          )}
          {' '}
          {assetData.metadata.symbol}
        </>
      )}
      title={(
        <span className={styles.name}>
          {assetData.metadata.name}
        </span>
      )}
      alt={assetData.metadata.symbol}
      icon={(
        <CurrencyIcon size={22} symbol={assetData.metadata.symbol} />
      )}
    />
  );

  return (
    <Row gutter={[16, 16]} wrap>
      {filteredAssets.map((assetData) => (
        <Col
          span={isBiggerThanDesktop ? 6 : 24}
          key={assetData.metadata.name}
        >
          {renderItem(assetData)}
        </Col>
      ))}
    </Row>
  );
}

AssetOverview.defaultProps = {
  additionalAssets: [],
  isRemarkNeeded: false,
  userIsMember: false,
};

AssetOverview.propTypes = {
  userIsMember: PropTypes.bool,
  isCongress: PropTypes.bool,
  officeType: PropTypes.string,
  isRemarkNeeded: PropTypes.bool,
  additionalAssets: PropTypes.arrayOf(PropTypes.shape({
    metadata: {
      symbol: PropTypes.string,
      name: PropTypes.string,
      decimals: PropTypes.number,
    },
    balance: {
      balance: PropTypes.number,
    },
  })),
};

export default AssetOverview;
