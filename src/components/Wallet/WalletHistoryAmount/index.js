import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Avatar from 'antd/es/avatar';
import Title from 'antd/es/typography/Title';
import { getAvatarParameters } from '../../../utils/avatar';
import lld from '../../../assets/icons/lld.svg';
import llm from '../../../assets/icons/llm.svg';
import styles from './styles.module.scss';

function WalletHistoryAmount({ value, currency, isTitle }) {
  const { color, text } = getAvatarParameters(currency || '$');
  const display = isTitle ? <Title className={styles.title} level={5}>{value}</Title> : value;
  switch (currency) {
    case 'LLD':
      return (
        <Flex wrap gap="5px" align="center">
          {display}
          <Avatar size={24} src={lld} alt="LLD" />
        </Flex>
      );
    case 'LLM':
      return (
        <Flex wrap gap="5px" align="center">
          {display}
          <Avatar size={24} src={llm} alt="LLM" />
        </Flex>
      );
    default:
      return (
        <Flex wrap gap="5px" align="center">
          {display}
          <Avatar style={{ backgroundColor: color, fontSize: 12 }} size={24} alt={currency}>
            {text}
          </Avatar>
        </Flex>
      );
  }
}

WalletHistoryAmount.propTypes = {
  value: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  isTitle: PropTypes.bool,
};

export default WalletHistoryAmount;
