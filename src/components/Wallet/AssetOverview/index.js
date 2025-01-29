import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Avatar from 'antd/es/avatar';
import { useMediaQuery } from 'usehooks-ts';
import { formatAssets } from '../../../utils/walletHelpers';
import SendAssetModalWrapper from '../../Modals/SendAssetModal';
import { getAvatarParameters } from '../../../utils/avatar';
import styles from './styles.module.scss';
import MoneyCard from '../../MoneyCard';

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
    const { color, text } = getAvatarParameters(assetData.metadata.name || 'A');
    return (
      <MoneyCard
        actions={!isCongress || userIsMember ? [
          <SendAssetModalWrapper
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
          <Avatar style={{ backgroundColor: color, fontSize: 12 }} alt={assetData.metadata.symbol} size={22}>
            {text}
          </Avatar>
        )}
      />
    );
  };

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
