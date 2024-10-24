import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { TextInput } from '../../../InputComponents';
import Button from '../../../../components/Button/Button';
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
      }
    } = useForm({
      mode: 'onChange',
    });

    const value = watch('stake', '');

    const onSubmit = async ({ stake }) => {
      try {
        const operations = getTokenStakeOperations(account);
        await operations.stake(stake);
      } catch (e) {
        setError('stake', {
          message: 'Something went wrong',
        });
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
          Stake your {stakingToken.name}
          <div className={styles.inputWrapper}>
            <TextInput
              register={register}
              name="stake"
              errorTitle="Stake"
              value={value}
              className={styles.input}
              onChange={(event) => setValue('stake', event.target.value)}
              validate={(value) => !value || /^-?\d*\.?\d+$/.test(value) ? undefined : 'Invalid stake'}
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
        <Button
          primary
          medium
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Loading...' : 'Stake tokens'}
        </Button>
      </form>
    );
}

StakeForm.propTypes = {
  account: PropTypes.string.isRequired,
  stakingToken: PropTypes.shape({
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
  })
};

export default StakeForm;