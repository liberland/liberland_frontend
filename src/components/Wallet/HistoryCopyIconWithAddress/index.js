import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Avatar from 'antd/es/avatar';
import { useSelector } from 'react-redux';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import { identitySelectors } from '../../../redux/selectors';
import { getAvatarParameters } from '../../../utils/avatar';

function HistoryCopyIconWithAddress({
  address,
  isTruncate,
}) {
  const { identity } = useSelector(identitySelectors.selectorIdentityMotions)?.[address] || {};
  const { legal, name } = identity || {};
  const { color, text } = getAvatarParameters(legal || name || address);
  return (
    <Flex wrap gap="10px">
      <Avatar style={{ backgroundColor: color, fontSize: '12px' }} size={24}>
        {text}
      </Avatar>
      <CopyIconWithAddress
        address={address}
        isTruncate={isTruncate}
        legal={legal}
        name={name}
      />
    </Flex>
  );
}

HistoryCopyIconWithAddress.propTypes = {
  address: PropTypes.string.isRequired,
  isTruncate: PropTypes.bool,
};

export default HistoryCopyIconWithAddress;
