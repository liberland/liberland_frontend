import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import { BN, BN_ZERO } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';

import styles from './styles.module.scss';
import { validatorActions } from '../../redux/actions';
import { walletSelectors } from '../../redux/selectors';
import { parseDollars, formatDollars } from '../../utils/walletHelpers';

function StakeLLDModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);

  const maxBond = BN.max(
    BN_ZERO,
    (new BN(balances?.liquidAmount?.amount ?? 0))
      .sub(parseDollars("10")), // leave at least 10 liquid LLD...
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      bondValue: formatDollars(maxBond).replaceAll(",", ""),
    },
  });

  const onSubmit = (values) => {
    const bondValue = parseDollars(values.bondValue);
    dispatch(validatorActions.stakeLld.call({ bondValue }));
    closeModal();
  };

  const validateBondValue = (textBondValue) => {
    try {
      const bondValue = parseDollars(textBondValue);
      if (bondValue.gt(maxBond) || bondValue.lte(BN_ZERO)) return 'Invalid amount';
      return true;
    } catch (e) {
      return 'Invalid amount';
    }
  };

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Stake LLD</div>
      <div className={styles.description}>
        You can stake up to
        {' '}
        {formatDollars(maxBond)}
        {' '}
        LLD
      </div>

      <div className={styles.title}>Amount to stake</div>
      <TextInput
        register={register}
        name="bondValue"
        placeholder="Amount LLD"
        validate={validateBondValue}
        required
        errorTitle="Amount"
      />
      { errors?.bondValue?.message
        && <div className={styles.error}>{errors.bondValue.message}</div> }

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
          Stake
        </Button>
      </div>
    </form>
  );
}

StakeLLDModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default function StakeLLDModalWrapper(props) {
  return (
    <ModalRoot>
      <StakeLLDModal {...props} />
    </ModalRoot>
  );
}
