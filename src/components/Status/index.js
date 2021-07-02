import React from 'react';
import cx from 'classnames';

import styles from './styles.module.scss';

const Status = ({
  status, completed, declined, pending, className,
}) => (
  <span
    className={cx(styles.status, className,
      { [styles.completed]: completed, [styles.declined]: declined, [styles.pending]: pending })}
  >
    {status}
  </span>
);

export default Status;
