import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  blockchainActions, democracyActions, validatorActions, walletActions,
} from '../../../redux/actions';
import { blockchainSelectors } from '../../../redux/selectors';
import truncate from '../../../utils/truncate';
import styles from './styles.module.scss';

function ChangeWallet({ setIsMenuOpen }) {
  const wallets = useSelector(blockchainSelectors.allWalletsSelector);
  const walletAdressSelector = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );

  const dispatch = useDispatch();
  const onWalletAdresssChange = (address) => {
    if (!address) return;
    dispatch(blockchainActions.setUserWallet.success(address));
    dispatch(validatorActions.getInfo.call());
    dispatch(walletActions.getWallet.call());
    dispatch(democracyActions.getDemocracy.call());
    localStorage.setItem('BlockchainAdress', address);
  };

  const onChangeSelect = (e) => {
    onWalletAdresssChange(e.target.value);
    if (setIsMenuOpen) {
      setIsMenuOpen((prevValue) => !prevValue);
    }
  };

  if (!wallets || wallets.length < 2) return null;
  return (
    <div className={styles.selectWrapper}>
      <select
        value={walletAdressSelector}
        className={styles.select}
        onChange={onChangeSelect}
      >
        {wallets.map((wallet) => {
          const metaName = wallet?.meta?.name;
          const { address } = wallet;
          const addressToShow = metaName ? `${metaName} (${truncate(address, 10)})` : truncate(address, 24);
          return (
            <option key={wallet.address} value={wallet.address}>
              {addressToShow}
            </option>
          );
        })}
      </select>
    </div>
  );
}

ChangeWallet.defaultProps = {
  setIsMenuOpen: null,
};

ChangeWallet.propTypes = {
  setIsMenuOpen: PropTypes.func,
};

export default ChangeWallet;
