import React from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';

const Status = ({ status }) => (
  <span
    className={cx(styles.status,
      { [styles.completed]: status === 'completed', [styles.declined]: status === 'declined' })}
  >
    {status}
  </span>
);

export default Status;
