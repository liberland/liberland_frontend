// LIBS
import React from 'react';
import { useForm } from 'react-hook-form';

// COMPONENTS
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';

// STYLES
import styles from './styles.module.scss';

const GetCitizenshipModal = ({
  onSubmit, closeModal,
}) => {
  const {
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      amount: '5000',
    },
  });

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.h3}>Get a Liberland Citizenship</div>
      <div className={styles.description}>
        You just need to stake 5.000 LLM
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

const GetCitizenshipModalWrapper = (props) => (
  <ModalRoot>
    <GetCitizenshipModal {...props} />
  </ModalRoot>
);

export default GetCitizenshipModalWrapper;
