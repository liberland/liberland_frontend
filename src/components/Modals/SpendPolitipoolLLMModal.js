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
import { walletSelectors, congressSelectors } from '../../redux/selectors';
import Validator from '../../utils/validator';

function SpendPolitipoolLLMModal({
  closeModal,
}) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const minSpendDelayInDays = useSelector(congressSelectors.minSpendDelayInDays);
  const maxUnbond = valueToBN(balances?.liquidMerits?.amount ?? 0);

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm({
    mode: 'all',
    defaultValues: {
      spendDelay: minSpendDelayInDays,
    },
  });

  const transfer = (values) => {
    dispatch(congressActions.congressSendLlmToPolitipool.call({
      transferToAddress: values.recipient,
      transferAmount: parseMerits(values.amount),
      remarkInfo: values.description || 'Congress spend politipooled LLM',
      spendDelay: parseInt(values.spendDelay),
    }));
    closeModal();
  };

  return (
    <form className={styles.getCitizenshipModal} onSubmit={handleSubmit(transfer)}>
      <div className={styles.h3}>Spend politipooled LLM</div>
      <div className={styles.description}>
        You are going to create politipooled LLM spend proposal
      </div>

      <div className={styles.title}>Spend politipooled to address</div>
      <InputSearch
        errorTitle="Recipient"
        register={register}
        name="recipient"
        placeholder="Spend politipooled to address"
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
        validate={(textUnbondValue) => Validator.validateUnbondValue(maxUnbond, textUnbondValue)}
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
        maxLength={{ value: 256, message: 'Min description length is 256 chars' }}
        name="description"
        placeholder="Spend description"
        required
      />
      { errors?.description?.message
        && <div className={styles.error}>{errors.description.message}</div> }

      <div className={styles.title}>Spend delay in days</div>
      <TextInput
        register={register}
        name="spendDelay"
        placeholder="Spend delay"
        validate={((v) => {
          if (parseInt(v) < minSpendDelayInDays) {
            return `Minimum spend delay is ${minSpendDelayInDays} days`;
          }
          return true;
        })}
        required
      />
      { errors?.spendDelay?.message
        && <div className={styles.error}>{errors.spendDelay.message}</div> }

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
