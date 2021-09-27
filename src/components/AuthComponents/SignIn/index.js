// LIBS
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

// REDUX
import { authActions } from '../../../redux/actions';
import { errorsSelectors } from '../../../redux/selectors';

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

const SignIn = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm();
  const dispatch = useDispatch();
  const history = useHistory();
  const apiError = useSelector(errorsSelectors.selectSignIn);

  useEffect(() => {
    if (apiError) {
      setError([
        {
          type: '',
          name: 'email',
          message: apiError.data.error,
        },
        {
          type: '',
          name: 'password',
          message: '',
        },
      ]);
    }
  }, [apiError, setError, dispatch]);

  const onSubmit = (values) => {
    dispatch(authActions.signIn.call({
      credentials: values,
      history,
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
          Sign In with wallet
        </Button>

        <p className={styles.divider}>
          <Divider />
          OR
          <Divider />
        </p>
        <form className={styles.signInForm} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputWrapper}>
            <TextInput
              register={register}
              name="email"
              placeholder="Your Email"
              errorTitle="Email"
              required
              error={errors.email}
              withIcon
              Icon={MailAt}
            />
            {
              errors.email
              && <span className={styles.error}>{errors.email.message}</span>
            }
          </div>
          <div className={styles.inputWrapper}>
            <PasswordInput
              register={register}
              name="password"
              placeholder="Password"
              required
              error={errors.password}
              withIcon
              Icon={Lock}
            />
            {
              errors.password && errors.password.message
              && <span className={styles.error}>{errors.password.message}</span>
            }
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
};

export default SignIn;
