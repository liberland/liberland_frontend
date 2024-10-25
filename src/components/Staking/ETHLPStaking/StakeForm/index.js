import React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { ethSelectors } from '../../../../redux/selectors';
import { TextInput } from '../../../InputComponents';
import Button from '../../../Button/Button';
import { formatCustom } from '../../../../utils/walletHelpers';
import { getTokenStakeOperations } from '../../../../api/ethereum';
import styles from './styles.module.scss';

function StakeForm({
  account,
  stakingToken,
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
  const connected = useSelector(ethSelectors.selectorConnected);
  const onSubmit = async ({ stake }) => {
    try {
      const signer = await connected.provider.getSigner(account);
      const operations = getTokenStakeOperations(signer, stakingToken.address);
      await operations.stake(stake);
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <label className={styles.wrapper}>
        Stake your
        {' '}
        {stakingToken.name}
        <div className={styles.inputWrapper}>
          <TextInput
            register={register}
            name="stake"
            errorTitle="Stake"
            value={value}
            className={styles.input}
            onChange={(event) => setValue('stake', event.target.value)}
            validate={(input) => (!input || /^-?\d*\.?\d+$/.test(input) ? undefined : 'Invalid stake')}
            disabled={isSubmitting}
            placeholder={stakingToken.symbol}
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
          Tokens staked successfully, click on refresh to see the result.
        </div>
        )}
      </label>
      <div className={styles.buttonRow}>
        <div className={styles.stakeAll}>
          <Button
            secondary
            medium
            type="button"
            disabled={isSubmitting}
            onClick={() => setValue('stake', stakingToken.balance)}
          >
            Stake all
            {' '}
            {formatCustom(stakingToken.balance, stakingToken.decimals)}
            {' '}
            {stakingToken.symbol}
          </Button>
        </div>
        <div>
          <Button
            primary
            medium
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : 'Stake tokens'}
          </Button>
        </div>
      </div>
    </form>
  );
}

StakeForm.propTypes = {
  account: PropTypes.string.isRequired,
  stakingToken: PropTypes.shape({
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    decimals: PropTypes.number.isRequired,
  }).isRequired,
};

export default StakeForm;
