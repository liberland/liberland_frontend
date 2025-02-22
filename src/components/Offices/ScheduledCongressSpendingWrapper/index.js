import React from 'react';
import ScheduledCongressSpending from '../../Senate/ScheduledCongressSpending';
import styles from './styles.module.scss';
import { MotionProvider } from '../../WalletCongresSenate/ContextMotions';

function ScheduledCongressSpendingWrapper() {
  return (
    <div className={styles.wrapper}>
      <MotionProvider>
        <ScheduledCongressSpending />
      </MotionProvider>
    </div>
  );
}

export default ScheduledCongressSpendingWrapper;
