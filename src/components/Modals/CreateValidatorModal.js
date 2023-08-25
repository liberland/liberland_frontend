import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import { BN, BN_ZERO, isHex } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import { CheckboxInput, SelectInput, TextInput } from '../InputComponents';
import Button from '../Button/Button';

import styles from './styles.module.scss';
import { validatorActions } from '../../redux/actions';
import { validatorSelectors, walletSelectors } from '../../redux/selectors';
import { dollarsToGrains, formatDollars, grainsInDollar } from '../../utils/walletHelpers';

function CreateValidatorModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const payee = useSelector(validatorSelectors.payee);
  const maxBond = BN.max(
    new BN(0),
    (new BN(balances?.liquidAmount?.amount ?? 0))
      .sub(dollarsToGrains(10)), // leave at least 10 liquid LLD...
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      bondValue: maxBond.div(grainsInDollar).toString(),
      commission: '10',
      allow_nominations: true,
      payee: payee ? payee.toString() : 'Staked',
    },
  });

  const onSubmit = (values) => {
    const bondValue = dollarsToGrains(values.bondValue);
    const commission = (new BN(values.commission)).mul(new BN(10000000));
    const blocked = !values.allow_nominations;
    dispatch(validatorActions.createValidator.call({
      bondValue, commission, blocked, keys: values.keys, payee: values.payee,
    }));
    closeModal();
  };

  const validateBondValue = (textBondValue) => {
    try {
      const bondValue = dollarsToGrains(textBondValue);
      if (bondValue.gt(maxBond) || bondValue.lte(BN_ZERO)) return 'Invalid amount';
      return true;
    } catch (e) {
      return 'Invalid amount';
    }
  };

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Create validator</div>
      <div className={styles.description}>
        You can stake up to
        {' '}
        {formatDollars(maxBond)}
        {' '}
        LLD
      </div>

      <div className={styles.title}>Amount to stake in your validator</div>
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

      <div className={styles.title}>Reward commission percentage</div>
      <div className={styles.description}>
        The commission is deducted from all rewards before the remainder is split with nominators.
      </div>
      <TextInput
        register={register}
        name="commission"
        required
        errorTitle="Commission"
      />
      { errors?.commission?.message
        && <div className={styles.error}>{errors.commission.message}</div> }

      <CheckboxInput
        register={register}
        name="allow_nominations"
        label="Allow new nominations"
      />

      <div className={styles.title}>Staking rewards destination</div>
      <SelectInput
        register={register}
        name="payee"
        options={[
          { value: 'Staked', display: 'Increase stake' },
          { value: 'Stash', display: 'Deposit in the account (without staking)' },
          { value: 'Controller', display: 'Controller (deprecated)' },
        ]}
      />

      <div className={styles.title}>Session keys</div>
      <TextInput
        register={register}
        name="keys"
        errorTitle="keys"
        validate={(v) => {
          if (!isHex(v)) return 'Must be a hex string starting with 0x';
          return v.length === 258 || 'Invalid length';
        }}
        required
      />
      { errors?.keys?.message
        && <div className={styles.error}>{errors.keys.message}</div>}

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
          Create validator
        </Button>
      </div>
    </form>
  );
}

CreateValidatorModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default function CreateValidatorModalWrapper(props) {
  return (
    <ModalRoot>
      <CreateValidatorModal {...props} />
    </ModalRoot>
  );
}
