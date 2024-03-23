// LIBS
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { AuthContext } from 'react-oauth2-code-pkce';
import { blockchainSelectors } from '../../../redux/selectors';
// STYLES
import styles from './styles.module.scss';
// COMPONENTS
import { ReactComponent as Divider } from '../../../assets/icons/divider.svg';
import { ReactComponent as WalletIcon } from '../../../assets/icons/wallet.svg';
import Header from '../Header';
import Button from '../../Button/Button';

function SignIn() {
  const { login } = useContext(AuthContext);
  const {
    register,
  } = useForm();
  const allAccounts = useSelector(blockchainSelectors.allWalletsSelector);

  const goToLiberlandSignin = () => {
    login();
  };

  return (
    <div>
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <div className={styles.signInWrapper}>
        <h3>Sign In to Liberland</h3>
        <p>Welcome back, you’ve been missed!</p>
        <Button medium primary onClick={() => goToLiberlandSignin()}>
          <div className={styles.icon}>
            <WalletIcon />
          </div>

          Liberland Sign in
        </Button>
        <p className={styles.divider}>
          <Divider />
          <span>Wallets Available</span>
          <Divider />
        </p>
        <form className={styles.signInForm}>
          <div className={styles.inputWrapper}>
            <select className={styles.addressSwitcher} {...register('wallet_address')} required>
              { allAccounts.map((el) => (
                <option key={el.address} value={el.address}>{el.address}</option>
              ))}
            </select>
          </div>
        </form>
        <p className={styles.extraInfo}>
          To access the Liberland app you need eresident
          account as well as substrate/polkadot wallet that matches the address registered on liberland.org.
          {' '}
          A guide on how to get started with liberland can be found
          {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://liberland-1.gitbook.io/wiki/v/public-documents/blockchain/for-citizens/"
          >
            here
          </a>
          .
        </p>

      </div>
      <div className={styles.twoFAbuttons}>
        <a href={`${process.env.REACT_APP_SSO_API_ADMIN_LINK}`}>admin login</a>
      </div>
    </div>
  );
}

export default SignIn;
