import React from 'react';
import Slashes from './Slashes';
import Status from './Status';
import NominatorsList from './NominatorsList';
import Stats from './Stats';
import StartStopButton from './StartStopButton';
import CreateValidatorButton from './CreateValidatorButton';
import styles from './styles.module.scss';
import SetSessionKeysModalWrapper from '../../Modals/SetSessionKeysModal';

export default function Overview() {
  return (
    <div className={styles.validatorWrapper}>
      <h3>Validator status</h3>
      <div className={styles.flex}>
        <div className={`${styles.internalWrapper} ${styles.startsChart}`}>
          <span className={styles.rowWrapper}>
            Status:
            <b><Status /></b>
          </span>
          <Stats />
        </div>
        <div className={styles.internalWrapper}>
          <NominatorsList />
        </div>
      </div>
      <div className={styles.rowEnd}>
        <CreateValidatorButton />
        <SetSessionKeysModalWrapper />
        <StartStopButton />
      </div>
      <Slashes />
    </div>
  );
}
