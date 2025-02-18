import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'antd/es/avatar';
import { isValidUrl } from '../../../../utils/url';
import ColorAvatar from '../../../ColorAvatar';

export default function CompanyImage({
  id,
  name,
  logo,
  size,
}) {
  return isValidUrl(logo) ? (
    <Avatar size={size} src={logo} />
  ) : (
    <ColorAvatar
      size={size}
      name={name || id || 'C'}
    />
  );
}

CompanyImage.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  logo: PropTypes.string,
  size: PropTypes.number.isRequired,
};
