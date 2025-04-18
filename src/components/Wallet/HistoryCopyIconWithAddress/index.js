import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import { useSelector } from 'react-redux';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import { identitySelectors } from '../../../redux/selectors';
import ColorAvatar from '../../ColorAvatar';
import truncate from '../../../utils/truncate';

function HistoryCopyIconWithAddress({
  address,
  isTruncate,
}) {
  const { identity } = useSelector(identitySelectors.selectorIdentityMotions)?.[address] || {};
  const { legal, name } = identity || {};
  const displayName = legal || name || 'Unknown';
  return (
    <Flex wrap gap="10px" justify="start" align="center">
      <ColorAvatar name={displayName} size={24} fontSize={12} />
      <Flex vertical gap="7px" justify="start" align="baseline">
        <strong>
          {truncate(displayName, 20)}
        </strong>
        <div className="description">
          <CopyIconWithAddress address={address} isTruncate={isTruncate} />
        </div>
      </Flex>
    </Flex>
  );
}

HistoryCopyIconWithAddress.propTypes = {
  address: PropTypes.string.isRequired,
  isTruncate: PropTypes.bool,
};

export default HistoryCopyIconWithAddress;
