// LIBS
import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch } from 'react-redux';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';

// STYLES
import styles from './styles.module.scss';
import { parseMerits, isValidSubstrateAddress } from '../../utils/walletHelpers';
import Validator from '../../utils/validator';
import useCongressExecutionBlock from '../../hooks/useCongressExecutionBlock';

function SpendModal({
  closeModal, onSend, spendData, isCongress, balance,
}) {
  const dispatch = useDispatch();
  const {
    name, title = `Spend ${name}`,
    description = 'You are going to create spend token proposal',
    subtitle = 'Spend to address',
    submitButtonText = 'Make transfer',
  } = spendData;

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
    dispatch(onSend({
      transferToAddress: values.recipient,
      transferAmount: parseMerits(values.amount),
      remarkInfo: values.description || `${isCongress ? 'Congress' : 'Senate'} ${title}`,
      executionBlock,
    }));
    closeModal();
  };

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(transfer)}>
      <div className={styles.h3}>
        {title}
      </div>
      <div className={styles.description}>
        {description}
      </div>

      <div className={styles.title}>{subtitle}</div>
      <InputSearch
        errorTitle="Recipient"
        register={register}
        name="recipient"
        placeholder={subtitle}
        isRequired
        setValue={setValue}
        validate={(v) => {
          if (!isValidSubstrateAddress(v)) return 'Invalid Address';
          return true;
        }}
      />
      {errors?.recipient?.message
        && <div className={styles.error}>{errors.recipient.message}</div>}

      <div className={styles.title}>
        Amount
        {' '}
        {name}
      </div>
      <TextInput
        register={register}
        validate={(textValue) => Validator.validateMeritsValue(balance, textValue)}
        name="amount"
        errorTitle="Amount"
        placeholder={`Amount ${name}`}
        required
      />
      { errors?.amount?.message
        && <div className={styles.error}>{errors.amount.message}</div> }

      <div className={styles.title}>Spend description</div>
      <TextInput
        register={register}
        minLength={{ value: 3, message: 'Min description length is 3 chars' }}
        errorTitle="Description"
        maxLength={{ value: 256, message: 'Max description length is 256 chars' }}
        name="description"
        placeholder="Spend description"
        required
      />
      { errors?.description?.message
        && <div className={styles.error}>{errors.description.message}</div> }

      {isCongress && (
      <>
        <div className={styles.title}>
          {isCongress ? 'Congress' : 'Senate'}
          {' '}
          voting time in days
        </div>
        <div className={styles.description}>
          How long will it take
          {' '}
          {isCongress ? 'Congress' : 'Senate'}
          {' '}
          to close the motion?
        </div>
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
          {' '}
          {executionBlock}
          .
        </div>
        { errors?.votingDays?.message
        && <div className={styles.error}>{errors.votingDays.message}</div> }
      </>
      )}

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
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
}

SpendModal.defaultProps = {
  isCongress: true,
  spendData: {
    title: '',
    description: '',
    subtitle: '',
    submitButtonText: '',
  },
};

SpendModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  spendData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    subtitle: PropTypes.string,
    submitButtonText: PropTypes.string,
  }),
  isCongress: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  balance: PropTypes.object.isRequired,
};

function SpendModalWrapper(props) {
  return (
    <ModalRoot>
      <SpendModal {...props} />
    </ModalRoot>
  );
}

export default SpendModalWrapper;
