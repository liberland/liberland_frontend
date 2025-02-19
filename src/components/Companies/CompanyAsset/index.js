import React from 'react';
import PropTypes from 'prop-types';
import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import CurrencyIcon from '../../CurrencyIcon';
import truncate from '../../../utils/truncate';
import styles from './styles.module.scss';

export default function CompanyAsset({
  index,
  name,
  symbol,
  logoURL,
  actions,
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
      actions={actions ? [
        <Flex wrap gap="15px" className={styles.pools}>
          {actions}
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
  actions: PropTypes.arrayOf(PropTypes.node.isRequired),
};
