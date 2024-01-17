// LIBS
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { errorsSelectors, blockchainSelectors } from '../../../redux/selectors';

// STYLES
import styles from './styles.module.scss';
// COMPONENTS
import { ReactComponent as Divider } from '../../../assets/icons/divider.svg';
import { ReactComponent as WalletIcon } from '../../../assets/icons/wallet.svg';
import Header from '../Header';
import Button from '../../Button/Button';

function SignIn() {
  const {
    register,
    setError,
  } = useForm();
  const dispatch = useDispatch();
  const apiError = useSelector(errorsSelectors.selectSignIn);
  const allAccounts = useSelector(blockchainSelectors.allWalletsSelector);
  // TODO REFACTOR
  const queryString = window.location.hash;
  const beginToken = queryString.indexOf('=');
  const endToken = queryString.indexOf('&');
  const ssoAccessTokenHash = queryString.substring(beginToken + 1, endToken);

  useEffect(() => {
    if (apiError) {
      setError(
        'email',
        apiError.data.error,
      );
    }
    if (ssoAccessTokenHash) {
      sessionStorage.setItem('ssoAccessTokenHash', ssoAccessTokenHash);
    }
  }, [apiError, setError, dispatch, ssoAccessTokenHash, allAccounts]);

  const goToLiberlandSignin = () => {
    window.location.replace(process.env.REACT_APP_SSO_API_IMPLICIT_LINK);
  };
  const goToLiberland2FASignin = () => {
    window.location.replace(process.env.REACT_APP_SSO2FA_API_IMPLICIT_LINK);
  };
  const goToLiberland2FASignout = () => {
    window.location.replace(process.env.REACT_APP_SSO2FA_API_LOGOUT_IMPLICIT_LINK);
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
        <div onClick={goToLiberland2FASignin}>
          2fa login
        </div>
        <div onClick={goToLiberland2FASignout}>
          2fa logout
        </div>
      </div>
    </div>
  );
}

export default SignIn;
