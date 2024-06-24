import React from 'react';
import ScheduledCongressSpending from '../../Senate/ScheduledCongressSpending';
import styles from './styles.module.scss';

function ScheduledCongressSpendingWrapper() {
  return (
    <div className={styles.wrapper}>
      <ScheduledCongressSpending />
    </div>
  );
}

export default ScheduledCongressSpendingWrapper;
