import React, { useState } from 'react';
import WalletListComponent from '../WalletListComponent';
import { proposMissingWallet } from '../propsTypes/propTypes';
import styles from '../styles.module.scss';

function MissingWalletComponent({
  walletList, registeredAddress, userId,
}) {
  const [showWallets, setShowWallets] = useState(false);
  return (
    <div>
      <h2>Missing wallet</h2>
      <p>You already registered a wallet address but it is not available on this device</p>
      <br />
      <p>The address you registered is: </p>
      <br />
      <p className={styles.blockchainAddressContainer}>{registeredAddress}</p>
      <br />
      <p>Please log in with a browser or app that has this address available.</p>
      <p>
        Alternatively, you can reigster another address on
        <a href={process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}>liberland.org</a>
        {' '}
        or contact support.
      </p>
      <br />
      <p>
        If you are absolutely sure you want to change your wallet address to one available on this device
        <button onClick={() => setShowWallets(true)}>
          <b>click here</b>
        </button>
      </p>
      <br />
      {showWallets && (
      <div style={{ width: '100%' }}>
        <WalletListComponent walletList={walletList} userId={userId} />
      </div>
      )}
    </div>
  );
}

MissingWalletComponent.propTypes = proposMissingWallet;

export default MissingWalletComponent;
