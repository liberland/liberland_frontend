import React, { forwardRef } from 'react';
import { createGradient } from '../Mining/utils';
import styles from './styles.module.scss';

// eslint-disable-next-line react/prop-types
function Gradient({ val }, ref) {
  return (
    <div
      ref={ref}
      className={styles.gradient}
    >
      <div style={createGradient(val)} className={styles.paint} />
    </div>
  );
}

export default forwardRef(Gradient);
