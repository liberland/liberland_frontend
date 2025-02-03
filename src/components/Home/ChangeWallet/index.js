import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import Dropdown from 'antd/es/dropdown/dropdown';
import DownOutlined from '@ant-design/icons/DownOutlined';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import {
  blockchainActions, democracyActions, validatorActions, walletActions,
} from '../../../redux/actions';
import { blockchainSelectors } from '../../../redux/selectors';
import truncate from '../../../utils/truncate';
import Polkadot from '../../../assets/icons/polkadot.svg';
import styles from './styles.module.scss';
import Button from '../../Button/Button';

function ChangeWallet() {
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 768px)');
  const wallets = useSelector(blockchainSelectors.allWalletsSelector);
  const walletAdressSelector = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );

  const dispatch = useDispatch();
  const onWalletAdresssChange = useCallback((address) => {
    if (address) {
      dispatch(blockchainActions.setUserWallet.success(address));
      dispatch(validatorActions.getInfo.call());
      dispatch(walletActions.getWallet.call());
      dispatch(democracyActions.getDemocracy.call());
      localStorage.setItem('BlockchainAdress', address);
    }
  }, [dispatch]);

  useEffect(() => {
    if (wallets?.length === 1 && !walletAdressSelector) {
      onWalletAdresssChange(wallets[0].address);
    }
  }, [walletAdressSelector, wallets, onWalletAdresssChange]);

  const displaySelected = useMemo(() => {
    const found = wallets.find(({ address }) => walletAdressSelector === address);
    if (found) {
      const { meta, address } = found;
      const copy = (
        <CopyIconWithAddress
          address={address}
          noDetails
        />
      );
      return meta?.name
        ? (
          <>
            {meta?.name}
            {' '}
            (
            {truncate(address, 10)}
            )
            {copy}
          </>
        )
        : (
          <>
            {truncate(address, 24)}
            {copy}
          </>
        );
    }
    return 'No address selected';
  }, [walletAdressSelector, wallets]);

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: wallets.map(({ meta, address }) => ({
          key: address,
          label: meta?.name ? `${meta?.name} (${truncate(address, 10)})` : truncate(address, 24),
        })),
        selectedKeys: [walletAdressSelector],
        onClick: ({ key }) => onWalletAdresssChange(key),
      }}
      className={styles.dropdown}
    >
      <Button
        link={isBiggerThanSmallScreen}
        primary={!isBiggerThanSmallScreen}
        nano={!isBiggerThanSmallScreen}
        className={styles.button}
      >
        {isBiggerThanSmallScreen && (
          <img src={Polkadot} className={styles.polkadot} alt="Polkadot icon" />
        )}
        {displaySelected}
        <DownOutlined />
      </Button>
    </Dropdown>
  );
}

export default ChangeWallet;
