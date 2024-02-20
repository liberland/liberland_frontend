import React from 'react';
import { useSelector } from 'react-redux';
import { useBlockNumber } from '@usedapp/core';
import { bridgeSelectors } from '../../../../redux/selectors';
import { useEthBridges } from '../../../../hooks/useEthBridges';
import { Transfer } from './Transfer';
import styles from '../styles.module.scss';

export function Transfers() {
  const transfers = useSelector(bridgeSelectors.toEthereumTransfers);
  const ethBridges = useEthBridges();
  const blockNumber = useBlockNumber();

  const toEthereumFailed = useSelector(bridgeSelectors.toEthereumTransfersFailed);

  if (toEthereumFailed) return 'Failed to fetch transaction to Ethereum history';

  if (!ethBridges || !blockNumber) return 'Loading...'; // FIXME proper loader
  const allTransfers = Object.values(transfers).sort((a, b) => b.date - a.date);

  if (allTransfers.length === 0) return null;

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
        {allTransfers.map((t) => (
          <Transfer
            key={t.receipt_id}
            ethBlockNumber={blockNumber}
            ethBridge={ethBridges[t.asset]}
            transfer={t}
          />
        ))}
      </tbody>
    </table>
  );
}
