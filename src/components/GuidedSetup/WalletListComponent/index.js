import { useDispatch } from 'react-redux';
import React from 'react';
import truncate from '../../../utils/truncate';
import { setCentralizedBackendAddress } from '../../../utils/setCentralizedBackendAdress';
import Button from '../../Button/Button';
import styles from '../styles.module.scss';
import { proposWalletListUserID } from '../propsTypes/propTypes';

function WalletListComponent({ walletList, userId }) {
  const dispatch = useDispatch();
  return (
    <div style={{ width: '100%' }}>
      {walletList.map((walletObject, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className={styles.connectWalletContainer} key={`availableWallet${index}`}>
          <div
            className={styles.connectWalletAddressText}
          >
            {truncate(walletObject.address, 25)}

          </div>
          <div
            className={styles.connectWalletAddressButtonContainer}
          >
            <Button
              primary
              className={styles.connectWalletAddressButton}
              onClick={() => setCentralizedBackendAddress(walletObject.address, userId, { dispatch })}
            >
              Connect
            </Button>
          </div>
          <br />
        </div>
      ))}
    </div>
  );
}

WalletListComponent.propTypes = proposWalletListUserID;

export default WalletListComponent;
