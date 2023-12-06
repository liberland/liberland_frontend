import React from 'react';
import { useEthers } from '@usedapp/core';
import Button from '../../../Button/Button';
import truncate from '../../../../utils/truncate';

function Connect() {
  const { account, activateBrowserWallet } = useEthers();
  if (account) {
    return (
      <>
        Connected Ethereum wallet:
        {' '}
        {truncate(account, 13)}
        .
      </>
    );
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <p>
        To use the bridge, you must connect your Ethereum Wallet (for example, MetaMask).
      </p>
      <div style={{ display: 'inline-block', margin: '10px auto' }}>
        <Button primary small onClick={() => activateBrowserWallet()}>Connect</Button>
      </div>
    </div>
  );
}

export default Connect;
