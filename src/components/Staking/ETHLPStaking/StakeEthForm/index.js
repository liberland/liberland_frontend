import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import ModalRoot from '../../../Modals/ModalRoot';
import { ethSelectors } from '../../../../redux/selectors';
import { ethActions } from '../../../../redux/actions';
import { TextInput } from '../../../InputComponents';
import Button from '../../../Button/Button';
import { formatCustom } from '../../../../utils/walletHelpers';
import { stakeLPWithEth } from '../../../../api/ethereum';
import styles from './styles.module.scss';

function StakeEthForm({
  account,
  stakingToken,
  onClose,
}) {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    setError,
    formState: {
      errors,
      isSubmitting,
      isSubmitSuccessful,
    },
  } = useForm({
    mode: 'onChange',
  });

  const value = watch('stake', '');
  const lp = watch('lp', '');
  const connected = useSelector(ethSelectors.selectorConnected);
  const exchangeRate = useSelector(ethSelectors.selectorWethLpExchangeRate);
  const exchangeRateLoading = useSelector(ethSelectors.selectorWethLpExchangeRateLoading);
  const exchangeRateError = useSelector(ethSelectors.selectorWethLpExchangeRateError);
  const dispatch = useDispatch();
  const [results, setResults] = React.useState([0, 0]);

  React.useEffect(() => {
    dispatch(ethActions.getWethLpExchangeRate.call({ decimals: stakingToken.decimals }));
  }, [dispatch, stakingToken.decimals]);

  React.useEffect(() => {
    if (value && exchangeRate) {
      try {
        const product = (window.BigInt(stakingToken.decimals) * exchangeRate.exchangeRate * window.BigInt(value))
          / window.BigInt(stakingToken.decimals);
        setValue('lp', formatCustom(product.toString(), stakingToken.decimals));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  }, [exchangeRate, setValue, stakingToken.decimals, value]);

  const onSubmit = async ({ stake }) => {
    try {
      const signer = await connected.provider.getSigner(account);
      setResults(await stakeLPWithEth(signer, stake, stakingToken.decimals, stakingToken.address, connected.provider));
    } catch (e) {
      setError('stake', {
        message: 'Something went wrong',
      });
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setValue('stake', '');
    }
  };

  if (exchangeRateError) {
    return <div className={styles.form}>Something went wrong</div>;
  }

  if (exchangeRateLoading) {
    return <div className={styles.form}>Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <label className={styles.wrapper} htmlFor="stake">
        Stake your ETH through Uniswap
        <div className={styles.inputWrapper}>
          <TextInput
            register={register}
            id="stake"
            name="stake"
            errorTitle="Stake"
            value={value}
            className={styles.input}
            onChange={(event) => setValue('stake', event.target.value)}
            validate={(input) => (!input || /^-?\d*\.?\d+$/.test(input) ? undefined : 'Invalid stake')}
            disabled={isSubmitting}
            placeholder="ETH"
            required
          />
        </div>
        {errors.stake && (
        <div className={styles.error}>
          {errors.stake.message}
        </div>
        )}
        {isSubmitSuccessful && (
        <div className={styles.success}>
          Staked
          {' '}
          {formatCustom(results[1], stakingToken.decimals, true)}
          {' '}
          {stakingToken.symbol}
          , returned:
          {' '}
          {formatCustom(results[0], 18, true)}
          {' '}
          WETH
        </div>
        )}
      </label>
      <label className={styles.wrapper} htmlFor="lp">
        Staked LP based on ETH
        <div className={styles.inputWrapper}>
          <TextInput
            id="lp"
            register={register}
            name="lp"
            errorTitle="LP"
            value={lp}
            className={styles.input}
            readOnly
            placeholder={stakingToken.symbol}
          />
        </div>
      </label>
      <div className={styles.buttonRow}>
        <div className={styles.closeForm}>
          <Button disabled={isSubmitting} medium onClick={onClose}>
            Close
          </Button>
        </div>
        <div>
          <Button
            primary
            medium
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : 'Stake ETH'}
          </Button>
        </div>
      </div>
    </form>
  );
}

StakeEthForm.propTypes = {
  account: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  stakingToken: PropTypes.shape({
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    decimals: PropTypes.number.isRequired,
  }).isRequired,
};

function StakeEthFormModalWrapper(props) {
  const [show, setShow] = React.useState();
  return (
    <div className={styles.modal}>
      <Button primary medium onClick={() => setShow(true)}>
        Stake ETH
      </Button>
      {show && (
        <ModalRoot>
          <StakeEthForm {...props} onClose={() => setShow(false)} />
        </ModalRoot>
      )}
    </div>
  );
}

export default StakeEthFormModalWrapper;
