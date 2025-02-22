import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from 'antd/es/list';
import { useMediaQuery } from 'usehooks-ts';
import truncate from '../../../utils/truncate';
import { setCentralizedBackendAddress } from '../../../utils/setCentralizedBackendAddress';
import Button from '../../Button/Button';
import styles from '../styles.module.scss';
import { blockchainSelectors, userSelectors } from '../../../redux/selectors';
import { blockchainActions } from '../../../redux/actions';
import ColorAvatar from '../../ColorAvatar';

function WalletListComponent() {
  const dispatch = useDispatch();
  const walletList = useSelector(blockchainSelectors.allWalletsSelector);
  const userId = useSelector(userSelectors.selectUserId);
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 992px)');

  return (
    <List
      dataSource={walletList}
      itemLayout={isBiggerThanSmallScreen ? 'horizontal' : 'vertical'}
      locale={{ emptyText: 'No wallet connected. Connect your wallet to get started!' }}
      renderItem={({ address }) => (
        <List.Item
          actions={[
            <Button
              primary
              className={styles.connectWalletAddressButton}
              onClick={() => {
                dispatch(blockchainActions.setUserWallet.success(address));
                setCentralizedBackendAddress(address, userId, { dispatch });
              }}
            >
              Connect
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={<ColorAvatar size={32} name={address} />}
            title={truncate(address, isBiggerThanSmallScreen ? 20 : 10)}
          />
        </List.Item>
      )}
    />
  );
}

export default WalletListComponent;
