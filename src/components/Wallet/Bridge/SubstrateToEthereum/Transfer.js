import React from 'react';
import { ethers, BigNumber } from 'ethers';
import {
  useContractFunction, useCall, useTransactions, compareAddress,
} from '@usedapp/core';

import Button from '../../../Button/Button';

export function Transfer({ ethBridge, transfer, ethBlockNumber }) {
  const { transactions } = useTransactions() ?? {};
  const { value: mintFee } = useCall({
    contract: ethBridge.contract,
    method: 'fee',
    args: [],
  }) ?? {};

  const { value: mintDelay } = useCall({
    contract: ethBridge.contract,
    method: 'mintDelay',
    args: [],
  }) ?? {};

  const { value: rawEthState } = useCall({
    contract: ethBridge.contract,
    method: 'incomingReceipts',
    args: [transfer.receipt_id],
  }) ?? {};

  const { send: mintSend } = useContractFunction(ethBridge.contract, 'mint', { transactionName: 'mint' });
  const withdraw = () => {
    mintSend(transfer.receipt_id, { value: mintFee[0] });
  };

  const mintTx = transactions
    .filter((tx) => tx.transactionName === 'mint' && compareAddress(tx.transaction.to, ethBridge.contract.address) === 0)
    .map((tx) => ethBridge.contract.interface.parseTransaction(tx.transaction).args)
    .find((args) => args.receiptId === transfer.receipt_id);

  let ethState = 'unknown'; // unknown, voting, approved, ready, processed
  if (rawEthState?.processedOn.gt(0)) {
    ethState = 'processed';
  } else if (rawEthState?.approvedOn.gt(0)) {
    if (BigNumber.from(ethBlockNumber).gt(rawEthState.approvedOn.add(mintDelay[0]))) {
      ethState = 'ready';
    } else {
      ethState = 'approved';
    }
  } else if (!rawEthState?.amount.eq(0)) {
    ethState = 'voting';
  }

  let state;
  if (ethState === 'unknown') {
    state = 'Waiting for tx to be finalized (~1 minute)';
  } else if (ethState === 'voting') {
    state = 'Processing (~1h)';
  } else if (ethState === 'approved') {
    state = 'Processing (~1h)';
  } else if (ethState === 'ready' && !mintTx) {
    state = 'Unlock ready';
  } else if (ethState !== 'processed') {
    state = 'Waiting for withdraw tx confirmation';
  } else {
    state = 'Processed';
  }

  return (
    <tr>
      <td>{new Date(transfer.date).toLocaleString()}</td>
      <td>{transfer.receipt_id}</td>
      <td>{transfer.ethRecipient}</td>
      <td>
        {ethers.utils.formatUnits(transfer.amount, ethBridge.token.decimals)}
        {' '}
        {ethBridge.token.symbol}
      </td>
      <td>{state}</td>
      <td>
        {state !== 'Unlock ready' ? null
          : (
            <Button
              primary
              medium
              onClick={withdraw}
            >
              Withdraw on Ethereum
            </Button>
          )}
      </td>
    </tr>
  );
}
