import React from 'react';

import styles from './styles.module.scss';

// eslint-disable-next-line react/prop-types
const ProgressBar = ({ percent }) => (
  <div className={styles.wrapper}>
    <div className={styles.container}>
      <div className={styles.progress} style={{ width: `${percent}%` }} />
    </div>
    <p>
      {percent}
      %
    </p>
  </div>
);

export default ProgressBar;
