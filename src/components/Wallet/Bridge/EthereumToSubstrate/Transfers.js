import React, { useEffect } from 'react';
import { useEthers, useTransactions, compareAddress } from '@usedapp/core';
import { useDispatch, useSelector } from 'react-redux';
import { bridgeSelectors } from '../../../../redux/selectors';
import { bridgeActions } from '../../../../redux/actions';

import { Transfer } from './Transfer';
import { ethToSubReceiptId } from '../../../../utils/bridge';

import styles from '../styles.module.scss';

const addressInList = (addr, lst) => lst.some((v) => compareAddress(v, addr) === 0);

export function Transfers({ ethBridges }) {
  const dispatch = useDispatch();
  const { account } = useEthers();
  const initialized = useSelector(bridgeSelectors.toSubstrateInitialized);
  useEffect(() => {
    if (account && !initialized)
      dispatch(bridgeActions.getTransfersToSubstrate.call(account));
  }, [dispatch, account, initialized]);

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
