import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import List from 'antd/es/list';
import Card from 'antd/es/card';

import { formatAssets } from '../../../utils/walletHelpers';
import { senateSelectors } from '../../../redux/selectors';
import SendAssetModalWrapper from '../../Modals/SendAssetModal';

function AssetOverview({
  additionalAssets,
  isRemarkNeeded,
  isCongress,
}) {
  const filteredAssets = React.useMemo(
    () => additionalAssets?.filter((asset) => asset?.balance?.balance > 0) || [],
    [additionalAssets],
  );
  const userIsMember = useSelector(senateSelectors.userIsMember);

  const renderItem = (assetData) => (
    <Card
      actions={userIsMember ? [
        <SendAssetModalWrapper
          isRemarkNeeded={isRemarkNeeded}
          isCongress={isCongress}
          assetData={assetData}
        />,
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

  return (
    <List
      dataSource={filteredAssets}
      grid={{ gutter: 10, column: filteredAssets.length }}
      renderItem={renderItem}
    />
  );
}

AssetOverview.defaultProps = {
  additionalAssets: [],
  isRemarkNeeded: false,
  isCongress: true,
};

AssetOverview.propTypes = {
  isCongress: PropTypes.bool,
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
