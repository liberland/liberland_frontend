import React from 'react';
import { useTransactions, compareAddress } from '@usedapp/core';

import { Transfer } from './Transfer';
import { ethToSubReceiptId } from '../../../../utils/bridge';

import styles from '../styles.module.scss';

const addressInList = (addr, lst) => lst.some((v) => compareAddress(v, addr) === 0);

export function Transfers({ ethBridges }) {
  const { transactions } = useTransactions();
  const bridges = Object.values(ethBridges);
  const bridgeAddresses = bridges.map((b) => b.contract.address);
  const contractTransactions = transactions.filter((tx) => addressInList(tx.transaction.to, bridgeAddresses));
  const burns = contractTransactions.filter((tx) => tx.transactionName === 'burn');

  const transfers = burns.map((tx) => {
    const receipt_id = tx.receipt ? ethToSubReceiptId(tx.receipt) : null;
    return {
      receipt_id,
      burn: tx,
    };
  });

  if (transfers.length === 0) return null;

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
        {transfers.map((t) => {
          const bridge = bridges.find((b) => compareAddress(b.contract.address, t.burn.transaction.to) === 0);
          return <Transfer key={t.burn.transaction.hash} ethBridge={bridge} transfer={t} />;
        })}
      </tbody>
    </table>
  );
}
