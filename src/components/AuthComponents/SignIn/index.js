// LIBS
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

// REDUX
import { authActions } from '../../../redux/actions';

import { errorsSelectors, blockchainSelectors } from '../../../redux/selectors';

// STYLES
import styles from './styles.module.scss';
// COMPONENTS
import { ReactComponent as Divider } from '../../../assets/icons/divider.svg';
import { ReactComponent as Wallet } from '../../../assets/icons/wallet.svg';
import Header from '../Header';
import { CheckboxInput } from '../../InputComponents';
import router from '../../../router';
import Button from '../../Button/Button';
import axios from "axios";

function SignIn() {
  const {
    handleSubmit,
    register,
    setError,
  } = useForm();
  const dispatch = useDispatch();
  const history = useHistory();
  const apiError = useSelector(errorsSelectors.selectSignIn);
  const allAccounts = useSelector(blockchainSelectors.allWalletsSelector);
  const queryString = window.location.hash;
  // TODO REFACTOR
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
    if(ssoAccessTokenHash) {
      const api2 = axios.create({
        baseURL: process.env.REACT_APP_API2,
        withCredentials: true,
      });
      api2.defaults.headers.common['X-token'] = ssoAccessTokenHash;

      api2.get('/users/me').then((result) => {
        const walletAddress = allAccounts.find( account => account.address === result?.data?.blockchainAddress)
        if(walletAddress) {
          onSubmit({wallet_address: walletAddress.address, rememberMe: false})
        }
      });
    }
  }, [apiError, setError, dispatch, ssoAccessTokenHash, allAccounts]);

  const onSubmit = (values) => {
    dispatch(authActions.signIn.call({
      credentials: values,
      history,
      ssoAccessTokenHash,
    }));
  };

  const goToLiberlandSignin = () => {
    window.location.replace(process.env.REACT_APP_SSO_API_IMPLICIT_LINK);
  }

  return (
    <div>
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <div className={styles.signInWrapper}>
        <h3>Sign In to Liberland</h3>
        <p>Welcome back, you’ve been missed!</p>
        <Button medium primary onClick={() => goToLiberlandSignin()}>
          <Wallet />
          Liberland Sign in
        </Button>
        <p className={styles.divider}>
          <Divider />
          OR
          <Divider />
        </p>
        <form className={styles.signInForm} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputWrapper}>
            <select className={styles.addressSwitcher} {...register('wallet_address')} required>
              { allAccounts.map((el) => (
                <option key={el.address} value={el.address}>{el.address}</option>
              ))}
            </select>
          </div>
          <div className={styles.additionalActions}>
            <CheckboxInput
              register={register}
              name="rememberMe"
              placeholder="Password"
              label="Remember me?"
            />
            <Link to={router.signIn}>Forgot password?</Link>
          </div>
          <Button type="submit">Wallet sign in (WIP)</Button>
        </form>
        <p className={styles.signUpInfo}>
          Don&apos;t have have account yet?
          <Link to={router.signUp} className={styles.yellowLink}> Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
