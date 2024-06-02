// LIBS
import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch, useSelector } from 'react-redux';
import { BN_ZERO } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';

// STYLES
import styles from './styles.module.scss';
import { walletActions } from '../../redux/actions';
import { parseMerits, valueToBN, isValidSubstrateAddress } from '../../utils/walletHelpers';
import { walletSelectors } from '../../redux/selectors';

function SendLLMModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const maxUnbond = valueToBN(balances?.liquidMerits?.amount ?? 0);

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm({ mode: 'all' });

  const transfer = (values) => {
    dispatch(walletActions.sendTransferLLM.call({
      recipient: values.recipient,
      amount: parseMerits(values.amount),
    }));
    closeModal();
  };

  const validateUnbondValue = (textUnbondValue) => {
    try {
      const unbondValue = parseMerits(textUnbondValue);
      if (unbondValue.gt(maxUnbond) || unbondValue.lte(BN_ZERO)) return 'Invalid amount';
      return true;
    } catch (e) {
      return 'Invalid amount';
    }
  };

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(transfer)}>
      <div className={styles.h3}>Send LLM</div>
      <div className={styles.description}>
        You are going to send tokens from your wallet
      </div>

      <div className={styles.title}>Send to address</div>
      <InputSearch
        errorTitle="Recipient"
        register={register}
        name="recipient"
        placeholder="Send to address"
        isRequired
        setValue={setValue}
        validate={(v) => {
          if (!isValidSubstrateAddress(v)) return 'Invalid Address';
          return true;
        }}
      />
      {errors?.recipient?.message
        && <div className={styles.error}>{errors.recipient.message}</div>}

      <div className={styles.title}>Amount LLM</div>
      <TextInput
        register={register}
        validate={validateUnbondValue}
        name="amount"
        placeholder="Amount LLM"
        required
      />
      { errors?.amount?.message
        && <div className={styles.error}>{errors.amount.message}</div> }

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

SendLLMModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function SendLLMModalWrapper(props) {
  return (
    <ModalRoot>
      <SendLLMModal {...props} />
    </ModalRoot>
  );
}

export default SendLLMModalWrapper;
