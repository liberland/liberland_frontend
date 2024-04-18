import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import routesNotSameWallet from '../../../router/routesNotSameWallet';
import router from '../../../router';
import { blockchainActions, validatorActions, walletActions } from '../../../redux/actions';
import { blockchainSelectors } from '../../../redux/selectors';
import truncate from '../../../utils/truncate';
import styles from './styles.module.scss';

function ChangeWallet({ setIsMenuOpen }) {
  const wallets = useSelector(blockchainSelectors.allWalletsSelector);
  const walletAdressSelector = useSelector(
    blockchainSelectors.userWalletAddressSelector,
  );

  const history = useHistory();
  const dispatch = useDispatch();
  const onWalletAdresssChange = (address) => {
    if (!address) return;
    dispatch(blockchainActions.setUserWallet.success(address));
    dispatch(validatorActions.getInfo.call());
    dispatch(walletActions.getWallet.call());
    if (
      !routesNotSameWallet.some((path) => path === history.location.pathname)
    ) {
      history.push(router.home.profile);
    }
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
        {wallets.map((wallet) => (
          <option key={wallet.address} value={wallet.address}>
            {truncate(wallet.address, 24)}
          </option>
        ))}
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
