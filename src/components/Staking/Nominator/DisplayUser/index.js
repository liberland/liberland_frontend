import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Avatar from 'antd/es/avatar';
import { useMediaQuery } from 'usehooks-ts';
import { getAvatarParameters } from '../../../../utils/avatar';
import truncate from '../../../../utils/truncate';
import NoUser from '../../../../assets/icons/no-user.svg';
import CopyIconWithAddress from '../../../CopyIconWithAddress';

function DisplayUser({
  displayName,
  address,
}) {
  const isBiggerThanDesktop = useMediaQuery('(min-width: 1600px)');
  const { color, text } = getAvatarParameters(displayName || 'U');
  const size = isBiggerThanDesktop ? 19 : 32;
  return displayName ? (
    <Flex wrap gap="5px" align="center">
      <Avatar size={size} style={{ backgroundColor: color, fontSize: 12 }}>
        {text}
      </Avatar>
      {isBiggerThanDesktop ? truncate(displayName, 20) : (
        <Flex vertical gap="5px" align="center">
          {truncate(displayName, 20)}
          <CopyIconWithAddress address={address} isTruncate />
        </Flex>
      )}
    </Flex>
  ) : (
    <Flex wrap gap="5px" align="center">
      <Avatar size={size} src={NoUser} alt="No user found" />
      {!isBiggerThanDesktop && (
        <CopyIconWithAddress address={address} isTruncate />
      )}
    </Flex>
  );
}

DisplayUser.propTypes = {
  displayName: PropTypes.string,
  address: PropTypes.string.isRequired,
};

export default DisplayUser;
