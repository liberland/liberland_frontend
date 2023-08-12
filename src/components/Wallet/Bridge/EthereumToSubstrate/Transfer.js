import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import { encodeAddress } from '@polkadot/util-crypto';

import Button from '../../../Button/Button';
import { bridgeActions } from '../../../../redux/actions';
import { blockchainSelectors, bridgeSelectors } from '../../../../redux/selectors';
import useSubstrateBridgeTransfer from '../../../../hooks/useSubstrateBridgeTransfer';

export function Transfer({ ethBridge, transfer }) {
  const dispatch = useDispatch();
  const userWalletAddress = useSelector(blockchainSelectors.userWalletAddressSelector);
  const rawSubstrateState = useSubstrateBridgeTransfer(transfer.asset, transfer.txHash, transfer.receipt_id);
  const substrateBlockNumber = useSelector(blockchainSelectors.blockNumber); // FIXME this isn't updating realtime and we need this realtime
  const bridgesConstants = useSelector(bridgeSelectors.bridgesConstants);

  useEffect(() => {
    if (bridgesConstants === null)
      dispatch(bridgeActions.getBridgesConstants.call());
  }, [dispatch, bridgesConstants])

  const withdraw = () => {
    dispatch(bridgeActions.withdraw.call({
      userWalletAddress,
      values: {
        asset: ethBridge.asset,
        receipt_id: transfer.receipt_id,
        txHash: transfer.txHash,
      },
    }));
  };

  if (!bridgesConstants) return null;

  let substrateState = 'unknown'; // unknown, voting, approved, ready, processed
  if (rawSubstrateState?.status?.isApproved) {
    const withdrawalDelayInBlocks = bridgesConstants[transfer.asset].withdrawalDelay.toNumber();
    const approvedOn = rawSubstrateState.status.asApproved.toNumber();
    if (substrateBlockNumber >= withdrawalDelayInBlocks + approvedOn) substrateState = 'ready';
    else substrateState = 'approved';
  } else if (rawSubstrateState?.status?.isProcessed) {
    substrateState = 'processed';
  }

  let state;
  if (!transfer.receipt_id) {
    state = 'Waiting for tx confirmation';
  } else if (substrateState === 'unknown') {
    state = 'Waiting for tx to be finalized (~15 minutes)';
  } else if (substrateState === 'voting') {
    state = 'Processing (~1h)';
  } else if (substrateState === 'approved') {
    state = 'Processing (~1h)';
  } else if (substrateState !== 'processed' && !rawSubstrateState?.withdrawTx) {
    state = 'Unlock ready';
  } else if (substrateState !== 'processed') {
    state = 'Waiting for unlock tx confirmation';
  } else {
    state = 'Processed';
  }

  return (
    <tr>
      <td>{new Date(transfer.date).toLocaleString()}</td>
      <td>{transfer.receipt_id ? transfer.receipt_id : 'pending'}</td>
      <td>{encodeAddress(transfer.substrateRecipient)}</td>
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
              Withdraw on Liberland Blockchain
            </Button>
          )}
      </td>
    </tr>
  );
}
