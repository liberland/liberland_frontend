// LIBS
import React from 'react';
import useForm from 'react-hook-form';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';

// STYLES
import styles from './styles.module.scss';

const SendLlmModal = ({
  // eslint-disable-next-line react/prop-types
  onSubmit, closeModal, addressFrom,
}) => {
  const {
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      amount: '10',
      account_from: addressFrom,
      // Default address to send is CHARLIE
      account_to: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
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
      />

      <div className={styles.title}>Send to address</div>
      <TextInput
        register={register}
        name="account_to"
        placeholder="Send to address"
      />

      <div className={styles.title}>Amount LLM</div>
      <TextInput
        register={register}
        name="amount"
        placeholder="Amount LLM"
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
};

const SendLlmModalWrapper = (props) => (
  <ModalRoot>
    <SendLlmModal {...props} />
  </ModalRoot>
);

export default SendLlmModalWrapper;
