import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';
import { BN, isHex } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import { CheckboxInput, TextInput } from '../InputComponents';
import Button from '../Button/Button';

import styles from './styles.module.scss';
import { validatorActions } from '../../redux/actions';

function StartValidatorModal({
  closeModal,
}) {
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: 'all',
    defaultValues: {
      commission: '10',
      allow_nominations: true,
    },
  });

  const onSubmit = (values) => {
    const commission = (new BN(values.commission)).mul(new BN(10000000));
    const blocked = !values.allow_nominations;
    dispatch(validatorActions.validate.call({ commission, blocked, keys: values.keys }));
    closeModal();
  };

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Start validator</div>

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
          Start validator
        </Button>
      </div>
    </form>
  );
}

StartValidatorModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default function StartValidatorModalWrapper(props) {
  return (
    <ModalRoot>
      <StartValidatorModal {...props} />
    </ModalRoot>
  );
}
