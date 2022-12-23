// LIBS
import React from 'react';
import { useForm } from 'react-hook-form';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';

// STYLES
import styles from './styles.module.scss';

function SendLLMModal({
  // eslint-disable-next-line react/prop-types
  onSubmit, closeModal, addressFrom, setSendAddress,
}) {
  const {
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      amount: '10',
      account_from: addressFrom,
      account_to: '',
    },
  });

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Send LLM</div>
      <div className={styles.description}>
        You are going to send tokens from your wallet
      </div>

      <div className={styles.title}>Send from account</div>
      <TextInput
        register={register}
        name="account_from"
        placeholder="Send from account"
        required
      />

      <div className={styles.title}>Send to address</div>
      <TextInput
        register={register}
        name="account_to"
        placeholder="Send to address"
        setSendAddress={setSendAddress}
        required
      />

      <div className={styles.title}>Amount LLM</div>
      <TextInput
        register={register}
        name="amount"
        placeholder="Amount picoLLM"
        required
      />

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
          Make transfer
        </Button>
      </div>
    </form>
  );
}

function SendLLMModalWrapper(props) {
  return (
    <ModalRoot>
      <SendLLMModal {...props} />
    </ModalRoot>
  );
}

export default SendLLMModalWrapper;
