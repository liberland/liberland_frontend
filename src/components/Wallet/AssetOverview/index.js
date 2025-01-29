import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Card from 'antd/es/card';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import { useMediaQuery } from 'usehooks-ts';
import { formatAssets } from '../../../utils/walletHelpers';
import SendAssetModal from '../../Modals/SendAssetModal';
import { getAvatarParameters } from '../../../utils/avatar';
import styles from './styles.module.scss';

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
      <Card
        actions={!isCongress || userIsMember ? [
          <Flex wrap justify="start">
            <SendAssetModal
              isRemarkNeeded={isRemarkNeeded}
              assetData={assetData}
              officeType={officeType}
            />
          </Flex>,
        ] : undefined}
        size="small"
        className={styles.card}
      >
        <Card.Meta
          title={(
            <span className={styles.name}>
              {assetData.metadata.name}
            </span>
          )}
        />
        <Flex wrap gap="5px" align="center">
          <Title level={5} className={styles.title}>
            {formatAssets(
              assetData.balance?.balance || '0',
              assetData.metadata.decimals,
              true,
            )}
            {' '}
            {assetData.metadata.symbol}
          </Title>
          <Avatar style={{ backgroundColor: color, fontSize: 12 }} alt={assetData.metadata.symbol} size={22}>
            {text}
          </Avatar>
        </Flex>
      </Card>
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
