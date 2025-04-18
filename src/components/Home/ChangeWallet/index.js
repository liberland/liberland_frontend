import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'usehooks-ts';
import Dropdown from 'antd/es/dropdown/dropdown';
import Avatar from 'antd/es/avatar';
import DownOutlined from '@ant-design/icons/DownOutlined';
import {
  blockchainActions, democracyActions, validatorActions, walletActions,
} from '../../../redux/actions';
import { blockchainSelectors } from '../../../redux/selectors';
import truncate from '../../../utils/truncate';
import Polkadot from '../../../assets/icons/polkadot.svg';
import CopyIconWithAddress from '../../CopyIconWithAddress';
import styles from './styles.module.scss';
import Button from '../../Button/Button';

function ChangeWallet({
  onSelect,
}) {
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
      onSelect?.(address);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (wallets?.length === 1 && !walletAdressSelector) {
      onWalletAdresssChange(wallets[0].address);
    }
  }, [walletAdressSelector, wallets, onWalletAdresssChange]);

  const displaySelected = useMemo(() => {
    const found = wallets.find(({ address }) => walletAdressSelector === address);
    if (found) {
      const { meta, address } = found;
      if (!isBiggerThanSmallScreen) {
        return meta?.name || truncate(address, 10);
      }
      return meta?.name
        ? (
          <>
            {meta?.name}
            {' '}
            (
            {truncate(address, 10)}
            )
          </>
        )
        : (
          <>
            {truncate(address, 24)}
          </>
        );
    }
    return 'No address selected';
  }, [walletAdressSelector, wallets, isBiggerThanSmallScreen]);

  return (
    <Flex gap={isBiggerThanSmallScreen ? undefined : '3px'} vertical={!isBiggerThanSmallScreen}>
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
          <Flex gap="5px" align="center">
            {isBiggerThanSmallScreen && (
              <Avatar size={20} src={Polkadot} alt="Polkadot icon" />
            )}
            {displaySelected}
            <DownOutlined />
          </Flex>
        </Button>
      </Dropdown>
      {walletAdressSelector && (
        <CopyIconWithAddress
          address={walletAdressSelector}
          hideAddress={isBiggerThanSmallScreen}
          truncateBy={{ bigScreen: 21, smallScreen: 21 }}
        />
      )}
    </Flex>
  );
}

ChangeWallet.propTypes = {
  onSelect: PropTypes.func,
};

export default ChangeWallet;
