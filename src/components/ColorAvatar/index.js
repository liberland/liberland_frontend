import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'antd/es/avatar';
import { getAvatarParameters } from '../../utils/avatar';

function ColorAvatar({
  size,
  className,
  name,
  fontSize,
}) {
  const { color, text } = getAvatarParameters(name);
  return (
    <Avatar className={className} size={size} style={{ fontSize, backgroundColor: color }}>
      {text}
    </Avatar>
  );
}

ColorAvatar.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
};

export default ColorAvatar;
