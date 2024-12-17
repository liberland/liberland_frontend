import React from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Card from 'antd/es/card';
import { useMediaQuery } from 'usehooks-ts';

import { formatAssets } from '../../../utils/walletHelpers';
import SendAssetModalWrapper from '../../Modals/SendAssetModal';

function AssetOverview({
  additionalAssets,
  isRemarkNeeded,
  officeType,
  userIsMember,
}) {
  const filteredAssets = React.useMemo(
    () => additionalAssets?.filter((asset) => asset?.balance?.balance > 0) || [],
    [additionalAssets],
  );

  const renderItem = (assetData) => (
    <Card
      actions={userIsMember ? [
        <SendAssetModalWrapper
          isRemarkNeeded={isRemarkNeeded}
          assetData={assetData}
          officeType={officeType}
        />,
        <div />,
      ] : undefined}
    >
      <Card.Meta
        title={assetData.metadata.name}
        description={
          `${formatAssets(
            assetData.balance?.balance || '0',
            assetData.metadata.decimals,
            true,
          )} ${assetData.metadata.symbol}`
        }
      />
    </Card>
  );

  const isBiggerThanDesktop = useMediaQuery('(min-width: 1500px)');

  return (
    <Row gutter={[16, 16]}>
      {filteredAssets.map((assetData) => (
        <Col
          span={isBiggerThanDesktop ? Math.floor(Math.max(1, 24 / filteredAssets.length)) : 24}
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
  officeType: PropTypes.string.isRequired,
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
