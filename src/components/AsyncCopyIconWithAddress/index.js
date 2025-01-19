import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Avatar from 'antd/es/avatar';
import { useDispatch, useSelector } from 'react-redux';
import CopyIconWithAddress from '../CopyIconWithAddress';
import { identityActions } from '../../redux/actions';
import { identitySelectors } from '../../redux/selectors';
import { decodeAndFilter } from '../../utils/identityParser';
import { getAvatarParameters } from '../../utils/avatar';

function AsyncCopyIconWithAddress({
  address,
  isTruncate,
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(identityActions.getIdentityOf.call(address));
  }, [dispatch, address]);
  const identity = useSelector(identitySelectors.selectorIdentityOf)[address];
  const { info } = identity?.isSome ? identity.unwrap() : {};
  const { legal } = decodeAndFilter(info, ['legal']) || {};
  const { color, text } = getAvatarParameters(legal || address);

  return (
    <Flex wrap gap="10px">
      <Avatar style={{ backgroundColor: color, fontSize: '12px' }} size={24}>
        {text}
      </Avatar>
      <CopyIconWithAddress
        address={address}
        isTruncate={isTruncate}
        legal={legal}
      />
    </Flex>
  );
}

AsyncCopyIconWithAddress.propTypes = {
  address: PropTypes.string.isRequired,
  isTruncate: PropTypes.bool,
};

export default AsyncCopyIconWithAddress;
