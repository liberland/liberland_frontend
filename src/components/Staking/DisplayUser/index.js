import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Avatar from 'antd/es/avatar';
import { useMediaQuery } from 'usehooks-ts';
import { getAvatarParameters } from '../../../utils/avatar';
import truncate from '../../../utils/truncate';
import NoUser from '../../../assets/icons/no-user.svg';
import CopyIconWithAddress from '../../CopyIconWithAddress';

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
        <Flex vertical gap="2px">
          {truncate(displayName, 20)}
          {address && (
            <div className="description">
              <CopyIconWithAddress address={address} isTruncate />
            </div>
          )}
        </Flex>
      )}
    </Flex>
  ) : (
    <Flex wrap gap="2px" align="center">
      <Avatar size={size} src={NoUser} alt="No user found" />
      {!isBiggerThanDesktop && address && (
        <div className="description">
          <CopyIconWithAddress address={address} isTruncate />
        </div>
      )}
    </Flex>
  );
}

DisplayUser.propTypes = {
  displayName: PropTypes.string,
  address: PropTypes.string,
};

export default DisplayUser;
