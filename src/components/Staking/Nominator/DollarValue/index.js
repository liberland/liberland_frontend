import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Avatar from 'antd/es/avatar';
import { useMediaQuery } from 'usehooks-ts';
import LLD from '../../../../assets/icons/lld.svg';

function DollarValue({ value }) {
  const isBiggerThanDesktop = useMediaQuery('(min-width: 1600px)');
  return (
    <Flex gap="5px" align="center">
      <strong>
        {value || 0}
      </strong>
      <Avatar size={isBiggerThanDesktop ? 24 : 16} src={LLD} alt="LLD" />
    </Flex>
  );
}

DollarValue.propTypes = {
  value: PropTypes.string,
};

export default DollarValue;
