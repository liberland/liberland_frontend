/* eslint-disable no-bitwise */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getAvatarParameters } from '../../utils/avatar';
import styles from './styles.module.scss';

function ColorCover({
  width,
  height,
  className,
  name,
}) {
  const { color } = getAvatarParameters(name);
  const raw = parseInt(color.split('#')[1], 16);
  const inverseStr = (0x5F5F5F ^ raw).toString(16);
  return (
    <div
      className={classNames(className, styles.cover)}
      style={{
        minHeight: height,
        minWidth: width,
        filter: 'contrast(1.2) saturate(2)',
        background: `linear-gradient(45deg, ${color}, #${inverseStr.padEnd(6, inverseStr[inverseStr.length - 1])})`,
      }}
    />
  );
}

ColorCover.propTypes = {
  width: PropTypes.oneOf([PropTypes.number, PropTypes.string]).isRequired,
  height: PropTypes.oneOf([PropTypes.number, PropTypes.string]).isRequired,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default ColorCover;
