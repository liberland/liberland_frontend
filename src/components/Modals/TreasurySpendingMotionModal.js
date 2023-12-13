import React from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';
import { BN_ZERO, BN } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import Button from '../Button/Button';
import { TextInput } from '../InputComponents';
import { congressActions } from '../../redux/actions';
import { isValidSubstrateAddress } from '../../utils/bridge';
import { parseDollars } from '../../utils/walletHelpers';

import styles from './styles.module.scss';

function TreasurySpendingMotionModal({ closeModal, budget }) {
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: 'all',
  });

  const onSubmit = ({ transferToAddress, transferAmount }) => {
    dispatch(
      congressActions.congressSendTreasuryLld.call({
        transferToAddress,
        transferAmount: parseDollars(transferAmount),
      }),
    );
    closeModal();
  };

  const validateUnbondValue = (textUnbondValue) => {
    try {
      const unbondValue = parseDollars(textUnbondValue);
      if (unbondValue.gt(budget) || unbondValue.lte(BN_ZERO)) return 'Invalid amount';
      return true;
    } catch (e) {
      return 'Invalid amount';
    }
  };

  return (
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className={styles.h3}>Create new spending</h3>
      <span className={styles.description}>
        Here you can create a new motion for LLD spending.
      </span>

      <div className={styles.title}>Recipient Address</div>
      <TextInput
        register={register}
        name="transferToAddress"
        required
        errorTitle="Address not valid"
        validate={(v) => isValidSubstrateAddress(v) || 'Invalid length'}
      />
      {errors?.transferToAddress?.message && (
        <div className={styles.error}>{errors.transferToAddress.message}</div>
      )}
      <span className={styles.title}>Amount</span>
      <TextInput
        register={register}
        name="transferAmount"
        required
        errorTitle="Amount not valid"
        validate={validateUnbondValue}
      />
      {errors?.transferAmount?.message && (
        <div className={styles.error}>{errors.transferAmount.message}</div>
      )}

      <div className={styles.buttonWrapper}>
        <Button medium onClick={closeModal}>
          Cancel
        </Button>
        <Button primary medium type="submit">
          Create
        </Button>
      </div>
    </form>
  );
}

TreasurySpendingMotionModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  budget: PropTypes.instanceOf(BN).isRequired,
};

export default function TreasurySpendingMotionModalWrapper(props) {
  return (
    <ModalRoot>
      <TreasurySpendingMotionModal {...props} />
    </ModalRoot>
  );
}
