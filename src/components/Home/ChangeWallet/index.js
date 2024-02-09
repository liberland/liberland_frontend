import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import routesNotSameWallet from '../../../router/routesNotSameWallet';
import router from '../../../router';
import { blockchainActions } from '../../../redux/actions';
import { blockchainSelectors } from '../../../redux/selectors';
import truncate from '../../../utils/truncate';
import styles from './styles.module.scss';

function ChangeWallet({ isMedium }) {
  const wallets = useSelector(blockchainSelectors.allWalletsSelector);
  const walletAdressSelector = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const onWalletAdresssChange = (address) => {
    if (!address) return;
    dispatch(blockchainActions.setUserWallet.success(address));
    if (
      !routesNotSameWallet.some((path) => path === history.location.pathname)
    ) {
      history.push(router.home.profile);
    }
    localStorage.setItem('BlockchainAdress', address);
  };
  if (!wallets || wallets.length < 2) return null;
  return (
    <div className={styles.selectWrapper}>
      <select
        defaultValue={walletAdressSelector}
        className={styles.select}
        onChange={(e) => onWalletAdresssChange(e.target.value)}
      >
        {wallets.map((wallet) => (
          <option key={wallet.address} value={wallet.address}>
            {truncate(wallet.address, isMedium ? 24 : 16)}
          </option>
        ))}
      </select>
    </div>
  );
}

ChangeWallet.propTypes = {
  isMedium: PropTypes.bool.isRequired,
};

export default ChangeWallet;
