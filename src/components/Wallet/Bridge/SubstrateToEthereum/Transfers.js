import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBlockNumber } from '@usedapp/core';
import { bridgeSelectors } from '../../../../redux/selectors';
import { useEthBridges } from '../../../../hooks/useEthBridges';
import { Transfer } from './Transfer';
import styles from '../styles.module.scss';
import { bridgeActions } from '../../../../redux/actions';

export function Transfers() {
  const dispatch = useDispatch();

  const areToEthereumTransfersInitialized = useSelector(bridgeSelectors.areToEthereumTransfersInitialized);
  useEffect(() => {
    dispatch(bridgeActions.getTransfersToEthereum.call());
  }, [dispatch, areToEthereumTransfersInitialized]);

  const areToSubstrateTransfersInitialized = useSelector(bridgeSelectors.areToSubstrateTransfersInitialized);
  useEffect(() => {
    dispatch(bridgeActions.getTransfersToSubstrate.call());
  }, [dispatch, areToSubstrateTransfersInitialized]);

  const transfers = useSelector(bridgeSelectors.toEthereumTransfers);
  const ethBridges = useEthBridges();
  const blockNumber = useBlockNumber();
  if (!ethBridges || !blockNumber) return 'Loading...'; // FIXME proper loader
  const allTransfers = [
    ...Object.values(transfers.LLM),
    ...Object.values(transfers.LLD),
  ].sort((a, b) => b.date - a.date);

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
