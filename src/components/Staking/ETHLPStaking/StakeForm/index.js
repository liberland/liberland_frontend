import React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import ModalRoot from '../../../Modals/ModalRoot';
import { ethSelectors } from '../../../../redux/selectors';
import { TextInput } from '../../../InputComponents';
import Button from '../../../Button/Button';
import { formatCustom } from '../../../../utils/walletHelpers';
import { stakeTokens } from '../../../../api/ethereum';
import styles from './styles.module.scss';

function StakeForm({
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
  const connected = useSelector(ethSelectors.selectorConnected);
  const onSubmit = async ({ stake }) => {
    try {
      const signer = await connected.provider.getSigner(account);
      await stakeTokens(signer, stakingToken.address, stake);
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
      className={styles.form}
    >
      <label className={styles.wrapper}>
        Stake your ETH-LLD Uniswap v2 liquidity token
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
          Tokens staked successfully,
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
            Close
          </Button>
        </div>
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
            {isSubmitting ? 'Loading...' : 'Stake tokens'}
          </Button>
        </div>
      </div>
    </form>
  );
}

StakeForm.propTypes = {
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

function StakeFormModalWrapper(props) {
  const [show, setShow] = React.useState();
  return (
    <div className={styles.modal}>
      <Button primary medium onClick={() => setShow(true)}>
        Stake tokens
      </Button>
      {show && (
        <ModalRoot>
          <StakeForm {...props} onClose={() => setShow(false)} />
        </ModalRoot>
      )}
    </div>
  );
}

export default StakeFormModalWrapper;
