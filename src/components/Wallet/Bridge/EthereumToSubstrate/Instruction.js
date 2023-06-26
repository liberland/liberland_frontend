import React from 'react';

export function Instruction() {
  return (
    <div>
      Transferring assets through the bridge is a multi step process. This app will track it for you. Here's a summary of what will happen:
      <ol>
        <li>
          Your wrapped tokens will be transferred to bridge and you'll receive a
          Receipt. This only costs a small amount of Ethereum Transaction fee.
        </li>
        <li>Bridge will wait for the transfer transaction to be finalized. It takes ~15 minutes after transaction is confirmed.</li>
        <li>After finalization, Bridge network will transfer funds over to Liberland Blockchain. It takes ~1 minute.</li>
        <li>After transfer, there's a security freeze of 1h. Your funds are safely kept in Bridge during this period.</li>
        <li>After the freeze you can claim the coins on Liberland Blockchain. This costs 1 LLD + standard extrinsic fees.</li>
      </ol>
    </div>
  );
}
