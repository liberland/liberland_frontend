import React from 'react';
import { useSelector } from 'react-redux';
import { bridgeSelectors } from '../../../../redux/selectors';

import { Transfer } from './Transfer';

import styles from '../styles.module.scss';

export function Transfers({ ethBridges }) {
  const transfers = useSelector(bridgeSelectors.toSubstrateTransfers);
  const allTransfers = Object.values(transfers).sort((a, b) => b.date - a.date);

  return (
    <table className={styles.transferTable}>
      <thead>
        <tr>
          <th>Start date</th>
          <th>Receipt ID</th>
          <th>Recipient</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {allTransfers.map((t) => {
          const bridge = ethBridges[t.asset];
          return <Transfer key={t.txHash} ethBridge={bridge} transfer={t} />;
        })}
      </tbody>
    </table>
  );
}
