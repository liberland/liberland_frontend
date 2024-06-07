// LIBS
import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch, useSelector } from 'react-redux';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';

// STYLES
import styles from './styles.module.scss';
import { congressActions } from '../../redux/actions';
import { parseMerits, valueToBN, isValidSubstrateAddress } from '../../utils/walletHelpers';
import { congressSelectors } from '../../redux/selectors';
import Validator from '../../utils/validator';
import useCongressExecutionBlock from '../../hooks/useCongressExecutionBlock';

function SpendPolitipoolLLMModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const balances = useSelector(congressSelectors.balances);
  const balance = valueToBN(balances?.liquidMerits?.amount ?? 0);

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    watch,
  } = useForm({
    mode: 'all',
    defaultValues: {
      votingDays: '7',
    },
  });
  const votingDays = watch('votingDays');
  const executionBlock = useCongressExecutionBlock(votingDays);

  const transfer = (values) => {
    dispatch(congressActions.congressSendLlmToPolitipool.call({
      transferToAddress: values.recipient,
      transferAmount: parseMerits(values.amount),
      remarkInfo: values.description || 'Congress spend LLM to politipool',
      executionBlock,
    }));
    closeModal();
  };

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(transfer)}>
      <div className={styles.h3}>Spend LLM to politipool</div>
      <div className={styles.description}>
        You are going to create LLM spend proposal that will transfer LLM to recipients politipool
      </div>

      <div className={styles.title}>Spend LLM to address&apos;s politipool</div>
      <InputSearch
        errorTitle="Recipient"
        register={register}
        name="recipient"
        placeholder="Recipient's address"
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
        validate={(textValue) => Validator.validateMeritsValue(balance, textValue)}
        name="amount"
        placeholder="Amount LLM"
        required
      />
      { errors?.amount?.message
        && <div className={styles.error}>{errors.amount.message}</div> }

      <div className={styles.title}>Spend description</div>
      <TextInput
        register={register}
        minLength={{ value: 3, message: 'Min description length is 3 chars' }}
        maxLength={{ value: 256, message: 'Max description length is 256 chars' }}
        name="description"
        placeholder="Spend description"
        required
      />
      { errors?.description?.message
        && <div className={styles.error}>{errors.description.message}</div> }

      <div className={styles.title}>Congress voting time in days</div>
      <div className={styles.description}>How long will it take Congress to close the motion?</div>
      <TextInput
        register={register}
        name="votingDays"
        placeholder="Voting days"
        validate={((v) => {
          if (parseInt(v) < 1) {
            return 'Must be at least 1 day';
          }
          return true;
        })}
        required
      />
      <div>
        If motion passes in time, actual transfer will execute on block
        {executionBlock}
        .
      </div>
      { errors?.votingDays?.message
        && <div className={styles.error}>{errors.votingDays.message}</div> }

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

SpendPolitipoolLLMModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function SpendPolitipoolLLMModalWrapper(props) {
  return (
    <ModalRoot>
      <SpendPolitipoolLLMModal {...props} />
    </ModalRoot>
  );
}

export default SpendPolitipoolLLMModalWrapper;
