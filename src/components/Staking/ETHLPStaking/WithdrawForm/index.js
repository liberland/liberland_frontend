import React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import ModalRoot from '../../../Modals/ModalRoot';
import { ethSelectors } from '../../../../redux/selectors';
import { TextInput } from '../../../InputComponents';
import Button from '../../../Button/Button';
import { formatCustom } from '../../../../utils/walletHelpers';
import { withdrawTokens } from '../../../../api/ethereum';
import styles from './styles.module.scss';

function WithdrawForm({
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

  const value = watch('withdraw', '');
  const connected = useSelector(ethSelectors.selectorConnected);
  const onSubmit = async ({ withdraw }) => {
    try {
      const signer = await connected.provider.getSigner(account);
      await withdrawTokens(signer, stakingToken.address, withdraw);
    } catch (e) {
      setError('withdraw', {
        message: 'Something went wrong',
      });
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setValue('withdraw', '');
    }
  };

  React.useLayoutEffect(() => {
    if (isSubmitSuccessful) {
      setInterval(() => onClose(), 3000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      <label className={styles.wrapper}>
        Withdraw your ETH-LLD Uniswap v2 liquidity token
        <div className={styles.inputWrapper}>
          <TextInput
            register={register}
            name="withdraw"
            errorTitle="Withdraw amount"
            value={value}
            className={styles.input}
            onChange={(event) => setValue('withdraw', event.target.value)}
            validate={(input) => (!input || /^-?\d*\.?\d+$/.test(input) ? undefined : 'Invalid withdrawal amount')}
            disabled={isSubmitting}
            placeholder={stakingToken.symbol}
            required
          />
        </div>
        {errors.withdraw && (
        <div className={styles.error}>
          {errors.withdraw.message}
        </div>
        )}
        {isSubmitSuccessful && (
        <div className={styles.success}>
          Withdrawal was successfull,
          <br />
          click on refresh to see the result.
          <br />
          Form will close in 3 seconds.
        </div>
        )}
      </label>
      <div className={styles.buttonRow}>
        <div className={styles.closeForm}>
          <Button disabled={isSubmitting} medium onClick={onClose}>
            Cancel
          </Button>
        </div>
        <div className={styles.withdrawAll}>
          <Button
            secondary
            medium
            type="button"
            disabled={isSubmitting}
            onClick={() => setValue('withdraw', stakingToken.balance)}
          >
            Withdraw all
            {' '}
            {formatCustom(stakingToken.balance, stakingToken.decimals)}
            {' tokens'}
          </Button>
        </div>
        <div>
          <Button
            primary
            medium
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : 'Withdraw tokens'}
          </Button>
        </div>
      </div>
    </form>
  );
}

WithdrawForm.propTypes = {
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

function WithdrawFormModalWrapper(props) {
  const [show, setShow] = React.useState();
  return (
    <div className={styles.modal}>
      <Button primary medium onClick={() => setShow(true)}>
        Withdraw tokens
      </Button>
      {show && (
        <ModalRoot>
          <WithdrawForm {...props} onClose={() => setShow(false)} />
        </ModalRoot>
      )}
    </div>
  );
}

export default WithdrawFormModalWrapper;
