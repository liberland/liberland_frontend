import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import List from 'antd/es/list';
import uniq from 'lodash/uniq';
import { useMediaQuery } from 'usehooks-ts';
import truncate from '../../../utils/truncate';
import { setCentralizedBackendAddress } from '../../../utils/setCentralizedBackendAddress';
import Button from '../../Button/Button';
import styles from '../styles.module.scss';
import { blockchainSelectors, identitySelectors, userSelectors } from '../../../redux/selectors';
import { blockchainActions, identityActions } from '../../../redux/actions';
import ColorAvatar from '../../ColorAvatar';
import CopyIconWithAddress from '../../CopyIconWithAddress';

function WalletListComponent() {
  const dispatch = useDispatch();
  const walletList = useSelector(blockchainSelectors.allWalletsSelector);
  const userId = useSelector(userSelectors.selectUserId);
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 992px)');
  const names = useSelector(identitySelectors.selectorIdentityMotions);
  const identities = uniq(walletList?.map(({ address }) => address) || []);

  useEffect(() => {
    dispatch(identityActions.getIdentityMotions.call(identities));
  // little trick to ensure this isn´t called every new block
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identities.join('|'), dispatch]);

  return (
    <List
      dataSource={walletList}
      itemLayout={isBiggerThanSmallScreen ? 'horizontal' : 'vertical'}
      locale={{ emptyText: 'No wallet connected. Connect your wallet to get started!' }}
      renderItem={({ address }) => {
        const identity = names?.[address]?.identity;
        const title = identity?.legal || identity?.name || 'Unknown';

        return (
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
              avatar={<ColorAvatar size={32} name={title} />}
              title={truncate(title, isBiggerThanSmallScreen ? 20 : 10)}
              description={<CopyIconWithAddress isTruncate address={address} showAddress />}
            />
          </List.Item>
        );
      }}
    />
  );
}

export default WalletListComponent;
