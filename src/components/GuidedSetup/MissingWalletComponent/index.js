import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import WalletListComponent from '../WalletListComponent';
import styles from '../styles.module.scss';
import { userSelectors } from '../../../redux/selectors';

function MissingWalletComponent() {
  const registeredAddress = useSelector(userSelectors.selectWalletAddress);
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
        Alternatively, you can register another address on
        {' '}
        <a href={process.env.REACT_APP_MAIN_LIBERLAND_WEBSITE}>liberland.org</a>
        {' '}
        or contact support.
      </p>
      <br />
      <p>
        If you are absolutely sure you want to change your wallet address to one available on this device
        {' '}
        <button onClick={() => setShowWallets(true)}>
          <b>click here</b>
        </button>
      </p>
      <br />
      {showWallets && (
      <div style={{ width: '100%' }}>
        <WalletListComponent />
      </div>
      )}
    </div>
  );
}

export default MissingWalletComponent;
