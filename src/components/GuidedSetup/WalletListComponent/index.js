import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import truncate from '../../../utils/truncate';
import { setCentralizedBackendAddress } from '../../../utils/setCentralizedBackendAddress';
import Button from '../../Button/Button';
import styles from '../styles.module.scss';
import { propsWalletListUserID } from '../propsTypes/propTypes';
import { blockchainSelectors, userSelectors } from '../../../redux/selectors';
import { blockchainActions } from '../../../redux/actions';

function WalletListComponent() {
  const dispatch = useDispatch();
  const walletList = useSelector(blockchainSelectors.allWalletsSelector);
  const userId = useSelector(userSelectors.selectUserId);

  return (
    <div style={{ width: '100%' }}>
      {walletList.length > 0 && walletList.map((walletObject, index) => (
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
              onClick={() => {
                dispatch(blockchainActions.setUserWallet.success(walletObject.address));
                setCentralizedBackendAddress(walletObject.address, userId, { dispatch });
              }}
            >
              Connect
            </Button>
          </div>
          <br />
        </div>
      ))}
      {walletList.length === 0 && <div>No wallet connected. Connect your wallet to get started!</div>}
    </div>
  );
}

WalletListComponent.propTypes = propsWalletListUserID;

export default WalletListComponent;
