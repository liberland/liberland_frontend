import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import CurrencyIcon from '../../CurrencyIcon';
import truncate from '../../../utils/truncate';
import Button from '../../Button/Button';
import styles from './styles.module.scss';

export default function CompanyAsset({
  index,
  name,
  symbol,
  logoURL,
  isConnected,
}) {
  return (
    <Card
      size="small"
      title={symbol}
      extra={(
        <div className="description">
          ID:
          {' '}
          {index}
        </div>
      )}
      actions={isConnected ? [
        <Flex wrap gap="15px" className={styles.pools}>
          <Button>
            TBD
          </Button>
        </Flex>,
      ] : undefined}
    >
      <Card.Meta
        description={(
          <Flex wrap gap="10px" align="center">
            <CurrencyIcon size={32} symbol={symbol} logo={logoURL} />
            <div className="description">
              {truncate(name, 20)}
            </div>
          </Flex>
        )}
      />
    </Card>
  );
}

CompanyAsset.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  logoURL: PropTypes.string,
  isConnected: PropTypes.bool,
};
