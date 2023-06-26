import React from 'react';
import { ethers } from 'ethers';
import { useEthBridges } from '../../../../hooks/useEthBridges';

export function Instruction() {
  const bridges = useEthBridges();
  if (!bridges) return 'Loading...'; // FIXME proper loader

  const lldFee = ethers.utils.formatEther(bridges.LLD.mintFee);
  const llmFee = ethers.utils.formatEther(bridges.LLM.mintFee);

  return (
    <div>
      Transferring assets through the bridge is a multi step process. This app will track it for you. Here's a summary of what will happen:
      <ol>
        <li>
          Your LLD or LLM will be transferred to bridge and you'll receive a
          Receipt. This only costs a small amount of Libelrand Transaction fee.
        </li>
        <li>After transaction is confirmed, Bridge network will transfer funds over to Ethereum. It takes ~1 minute.</li>
        <li>After transfer, there's a security freeze of 1h. Your funds are safely kept in Bridge during this period.</li>
        <li>
          After the freeze you can claim the coins on Ethereum. This costs
          {lldFee}
          {' '}
          ETH for
          {bridges.LLD.token.symbol}
          {' '}
          transfer and
          {llmFee}
          {' '}
          ETH for
          {bridges.LLM.token.symbol}
          {' '}
          transfer (plus standard transaction fees).
        </li>
      </ol>
    </div>
  );
}
