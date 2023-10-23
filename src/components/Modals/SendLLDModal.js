// LIBS
import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch } from 'react-redux';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';

// STYLES
import styles from './styles.module.scss';
import { isValidSubstrateAddress } from '../../utils/bridge';
import { parseDollars } from '../../utils/walletHelpers';
import { walletActions } from '../../redux/actions';

function SendLLDModal({ closeModal }) {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    mode: 'all',
  });

  const transfer = (values) => {
    dispatch(walletActions.sendTransfer.call({
      recipient: values.recipient,
      amount: parseDollars(values.amount),
    }));
    closeModal();
  };

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(transfer)}>
      <div className={styles.h3}>Send LLD</div>
      <div className={styles.description}>
        You are going to send tokens from your wallet
      </div>

      <div className={styles.title}>Send to address</div>
      <TextInput
        register={register}
        name="recipient"
        placeholder="Send to address"
        required
        validate={(v) => isValidSubstrateAddress(v) || 'Invalid Address'}
      />
      {errors?.recipient?.message
        && <div className={styles.error}>{errors.recipient.message}</div>}

      <div className={styles.title}>Amount LLD</div>
      <TextInput
        register={register}
        name="amount"
        placeholder="Amount LLD"
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

SendLLDModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function SendLLDModalWrapper(props) {
  return (
    <ModalRoot>
      <SendLLDModal {...props} />
    </ModalRoot>
  );
}

export default SendLLDModalWrapper;
