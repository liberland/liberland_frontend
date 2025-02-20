import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import styles from './styles.module.scss';
import CurrencyIcon from '../../CurrencyIcon';

function WalletHistoryAmount({
  value,
  currency,
  logo,
  isTitle,
}) {
  return (
    <Flex wrap gap="5px" align="center">
      {isTitle ? <Title className={styles.title} level={5}>{value}</Title> : value}
      <CurrencyIcon size={24} symbol={currency} logo={logo} />
    </Flex>
  );
}

WalletHistoryAmount.propTypes = {
  value: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  logo: PropTypes.string,
  isTitle: PropTypes.bool,
};

export default WalletHistoryAmount;
