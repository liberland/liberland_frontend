// LIBS
import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// COMPONENTS
import { useDispatch, useSelector } from 'react-redux';
import { BN_ZERO, BN } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import InputSearch from '../InputComponents/InputSearchAddressName';

// STYLES
import styles from './styles.module.scss';
import { parseDollars, isValidSubstrateAddress } from '../../utils/walletHelpers';
import { congressActions } from '../../redux/actions';
import { walletSelectors, congressSelectors } from '../../redux/selectors';
import Validator from '../../utils/validator';

function SpendLLDModal({ closeModal }) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const minSpendDelayInDays = useSelector(congressSelectors.minSpendDelayInDays);
  const maxUnbond = BN.max(
    BN_ZERO,
    new BN(balances?.liquidAmount?.amount ?? 0).sub(parseDollars('2')), // leave at least 2 liquid LLD...
  );

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
    dispatch(
      congressActions.congressSendLld.call({
        transferToAddress: values.recipient,
        transferAmount: parseDollars(values.amount),
        remarkInfo: values.description || 'Congress spend LLD',
        spendDelay: parseInt(values.spendDelay),
      }),
    );
    closeModal();
  };

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(transfer)}
    >
      <div className={styles.h3}>Spend LLD</div>
      <div className={styles.description}>
        You are going to create spend token proposal
      </div>

      <div className={styles.title}>Spend to address</div>
      <InputSearch
        errorTitle="Recipient"
        register={register}
        name="recipient"
        placeholder="Spend to address"
        isRequired
        setValue={setValue}
        validate={(v) => {
          if (!isValidSubstrateAddress(v)) return 'Invalid Address';
          return true;
        }}
      />
      {errors?.recipient?.message && (
        <div className={styles.error}>{errors.recipient.message}</div>
      )}

      <div className={styles.title}>Amount LLD</div>
      <TextInput
        errorTitle="Amount LLD"
        register={register}
        validate={(textUnbondValue) => Validator.validateUnbondValue(maxUnbond, textUnbondValue)}
        name="amount"
        placeholder="Amount LLD"
        required
      />
      {errors?.amount?.message && (
        <div className={styles.error}>{errors.amount.message}</div>
      )}

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
        <Button medium onClick={closeModal}>
          Cancel
        </Button>
        <Button primary medium type="submit">
          Make spend proposal
        </Button>
      </div>
    </form>
  );
}

SpendLLDModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function SpendLLDModalWrapper(props) {
  return (
    <ModalRoot>
      <SpendLLDModal {...props} />
    </ModalRoot>
  );
}

export default SpendLLDModalWrapper;
