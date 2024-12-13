import React from 'react';
import PropsTypes from 'prop-types';
import styles from '../styles.module.scss';

function ProgressBar({ value, handleChange }) {
  return (
    <div className={styles.progresBar}>
      <input
        type="range"
        id="lpTokenBurn"
        name="lpTokenBurn"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

ProgressBar.propTypes = {
  value: PropsTypes.number.isRequired,
  handleChange: PropsTypes.func.isRequired,
};

export default ProgressBar;
