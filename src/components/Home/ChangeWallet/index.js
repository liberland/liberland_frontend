import React, { useEffect, useMemo } from 'react';
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

function ChangeWallet() {
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 576px)');
  const wallets = useSelector(blockchainSelectors.allWalletsSelector);
  const walletAdressSelector = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );

  const dispatch = useDispatch();
  const onWalletAdresssChange = (address) => {
    if (address) {
      dispatch(blockchainActions.setUserWallet.success(address));
      dispatch(validatorActions.getInfo.call());
      dispatch(walletActions.getWallet.call());
      dispatch(democracyActions.getDemocracy.call());
      localStorage.setItem('BlockchainAdress', address);
    }
  };

  useEffect(() => {
    if (wallets?.length === 1 && !walletAdressSelector) {
      onWalletAdresssChange(wallets[0].address);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAdressSelector, wallets]);

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
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#" onClick={(e) => e.preventDefault()} className={styles.dropdownLink}>
        {isBiggerThanSmallScreen && (
          <img src={Polkadot} className={styles.polkadot} alt="Polkadot icon" />
        )}
        {displaySelected}
        <DownOutlined />
      </a>
    </Dropdown>
  );
}

export default ChangeWallet;
