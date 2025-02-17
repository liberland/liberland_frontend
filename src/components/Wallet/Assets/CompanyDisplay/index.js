import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'antd/es/avatar';
import Flex from 'antd/es/flex';
import { isValidUrl } from '../../../../utils/url';
import ColorAvatar from '../../../ColorAvatar';

export default function CompanyDetail({
  id,
  name,
  logo,
  size,
}) {
  const companyLogo = isValidUrl(logo) ? (
    <Avatar size={size} src={logo} />
  ) : (
    <ColorAvatar
      size={size}
      name={name || id || 'C'}
    />
  );
  return (
    <Flex wrap gap="7px" align="center">
      {companyLogo}
      <Flex vertical gap="7px">
        <strong>
          {name || id || 'Unknown'}
        </strong>
        <div className="description">
          ID:
          {' '}
          {id || 'Unknown'}
        </div>
      </Flex>
    </Flex>
  );
}

CompanyDetail.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  logo: PropTypes.string,
  size: PropTypes.number.isRequired,
};
