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

  return (
    <div
      className={classNames(className, styles.cover)}
      style={{
        minHeight: height,
        minWidth: width,
        filter: 'contrast(1.2) saturate(1.2)',
        background: `linear-gradient(45deg, ${color}, #${(~raw & 0xffffff).toString(16)})`,
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
