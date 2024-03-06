import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import { BN_ZERO } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import { eraToDays } from '../../utils/staking';

import styles from './styles.module.scss';
import { validatorActions } from '../../redux/actions';
import { validatorSelectors, walletSelectors } from '../../redux/selectors';
import {
  parseDollars, formatDollars, valueToBN,
} from '../../utils/walletHelpers';

function UnbondModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const bondingDuration = useSelector(validatorSelectors.bondingDuration);
  const maxUnbond = valueToBN(balances?.polkastake?.amount ?? 0);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      unbondValue: formatDollars(maxUnbond),
    },
  });

  useEffect(() => {
    dispatch(validatorActions.getBondingDuration.call());
  }, [dispatch]);

  const onSubmit = (values) => {
    const unbondValue = parseDollars(values.unbondValue);
    dispatch(validatorActions.unbond.call({ unbondValue }));
    closeModal();
  };

  const validateUnbondValue = (textUnbondValue) => {
    try {
      const unbondValue = parseDollars(textUnbondValue);
      if (unbondValue.gt(maxUnbond) || unbondValue.lte(BN_ZERO)) return 'Invalid amount';
      return true;
    } catch (e) {
      return 'Invalid amount';
    }
  };

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Unstake LLD</div>
      <div className={styles.description}>
        You can unstake up to
        {' '}
        {formatDollars(maxUnbond)}
        {' '}
        LLD. Note that unstaking takes
        {' '}
        {eraToDays(bondingDuration)}
        {' '}
        days.
      </div>

      <div className={styles.title}>Amount to unstake</div>
      <TextInput
        register={register}
        name="unbondValue"
        placeholder="Amount LLD"
        validate={validateUnbondValue}
        required
        errorTitle="Amount"
      />
      { errors?.unbondValue?.message
        && <div className={styles.error}>{errors.unbondValue.message}</div> }

      <div className={styles.buttonWrapper}>
        <Button
          medium
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          primary
          medium
          type="submit"
        >
          Schedule unstake
        </Button>
      </div>
    </form>
  );
}

UnbondModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default function UnbondModalWrapper(props) {
  return (
    <ModalRoot>
      <UnbondModal {...props} />
    </ModalRoot>
  );
}
