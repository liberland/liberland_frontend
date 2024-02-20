import React from 'react';
import { useSelector } from 'react-redux';
import { formatDollars } from '../../../../utils/walletHelpers';
import { validatorSelectors } from '../../../../redux/selectors';
import styles from '../styles.module.scss';

export default function PendingRewardsData() {
  const pendingRewards = useSelector(validatorSelectors.pendingRewards);

  return (
    <div className={styles.rowWrapper}>
      <span>Rewards pending: </span>
      <span>
        {formatDollars(pendingRewards ?? 0)}
        {' '}
        LLD
      </span>
    </div>
  );
}
