import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Result from 'antd/es/result';
import { useMediaQuery } from 'usehooks-ts';
import { formatAssets } from '../../../utils/walletHelpers';
import SendAssetModal from '../../Modals/SendAssetModal';
import styles from './styles.module.scss';
import MoneyCard from '../../MoneyCard';
import CurrencyIcon from '../../CurrencyIcon';
import { isCompanyConnected } from '../../../utils/asset';

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
  const renderItem = (assetData) => {
    const isConnected = isCompanyConnected(assetData);
    const logo = isConnected ? assetData.company.logoURL : undefined;
    return (
      <MoneyCard
        actions={!isCongress || userIsMember ? [
          <SendAssetModal
            isRemarkNeeded={isRemarkNeeded}
            assetData={assetData}
            officeType={officeType}
            key="send"
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
          <CurrencyIcon size={22} symbol={assetData.metadata.symbol} logo={logo} />
        )}
      />
    );
  };

  if (!filteredAssets.length) {
    return (
      <Result
        status={404}
        title="No additional assets found"
      />
    );
  }

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
    metadata: PropTypes.shape({
      symbol: PropTypes.string,
      name: PropTypes.string,
      decimals: PropTypes.string,
    }),
    balance: PropTypes.string,
  })),
};

export default AssetOverview;
