import React from 'react';
import { useForm } from 'react-hook-form';
import { isHex } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';

import styles from './styles.module.scss';

function SetSessionKeysModal({
  // eslint-disable-next-line react/prop-types
  onSubmit, closeModal,
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: 'all' });

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Change session keys</div>

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
          Change session keys
        </Button>
      </div>
    </form>
  );
}

export default function SetSessionKeysModalWrapper(props) {
  return (
    <ModalRoot>
      <SetSessionKeysModal {...props} />
    </ModalRoot>
  );
}
