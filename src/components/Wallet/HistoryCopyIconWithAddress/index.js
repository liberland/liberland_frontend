import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import { useSelector } from 'react-redux';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import { identitySelectors } from '../../../redux/selectors';
import ColorAvatar from '../../ColorAvatar';

function HistoryCopyIconWithAddress({
  address,
  isTruncate,
}) {
  const { identity } = useSelector(identitySelectors.selectorIdentityMotions)?.[address] || {};
  const { legal, name } = identity || {};
  return (
    <Flex wrap gap="10px">
      <ColorAvatar size={24} name={legal || name || address} fontSize={12} />
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
