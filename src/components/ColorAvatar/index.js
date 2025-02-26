/* eslint-disable no-bitwise */
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
  const raw = parseInt(color.split('#')[1], 16);
  const red = raw & 0xff0000;
  const green = raw & 0x00ff00;
  const blue = raw & 0x0000ff;
  const luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  const fontColor = luma > 0.5 ? 'black' : 'white';
  const multiplied = Array(3).fill(`0px 0px 3px ${luma > 0.5 ? 'white' : 'black'}`).join(', ');
  return (
    <Avatar
      className={className}
      size={size}
      style={{
        fontSize,
        backgroundColor: color,
        textShadow: multiplied,
        color: fontColor,
      }}
    >
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
