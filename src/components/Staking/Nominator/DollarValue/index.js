import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Avatar from 'antd/es/avatar';
import LLD from '../../../../assets/icons/lld.svg';

function DollarValue({ value }) {
  return (
    <Flex gap="5px">
      <strong>
        {value || 0}
      </strong>
      <Avatar size={16} src={LLD} alt="LLD" />
    </Flex>
  );
}

DollarValue.propTypes = {
  value: PropTypes.string,
};

export default DollarValue;
