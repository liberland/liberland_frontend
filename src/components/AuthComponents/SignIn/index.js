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
import { ReactComponent as Lock } from '../../../assets/icons/lock.svg';
import { ReactComponent as MailAt } from '../../../assets/icons/mail-at.svg';
import { ReactComponent as Wallet } from '../../../assets/icons/wallet.svg';
import Header from '../Header';
import { CheckboxInput, PasswordInput, TextInput } from '../../InputComponents';
import router from '../../../router';
import Button from '../../Button/Button';

function SignIn() {
  const {
    handleSubmit,
    register,
    formState: { errors },
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
  if (!ssoAccessTokenHash) {
    alert(`Due to stupid but temporary reasons, you should get here through this link, otherwise bugs will happen ${process.env.REACT_APP_SSO_API_IMPLICIT_LINK}`);
  }

  useEffect(() => {
    if (apiError) {
      setError(
        'email',
        apiError.data.error,
      );
    }
  }, [apiError, setError, dispatch]);

  const onSubmit = (values) => {
    dispatch(authActions.signIn.call({
      credentials: values,
      history,
      ssoAccessTokenHash,
    }));
  };

  return (
    <div>
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <div className={styles.signInWrapper}>
        <h3>Sign In to Liberland</h3>
        <p>Welcome back, you’ve been missed!</p>
        <Button medium>
          <Wallet />
          (fake)Sign In with wallet
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
          <Button primary type="submit">Sign In</Button>
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
