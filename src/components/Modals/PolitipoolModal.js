import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// COMPONENTS
import { useForm } from 'react-hook-form';
import { BN_ZERO } from '@polkadot/util';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { walletActions } from '../../redux/actions';
import { parseMerits, valueToBN } from '../../utils/walletHelpers';
import { walletSelectors } from '../../redux/selectors';

function PolitipoolModal({ closeModal }) {
  const dispatch = useDispatch();
  const balances = useSelector(walletSelectors.selectorBalances);
  const maxUnbond = valueToBN(balances?.liquidMerits?.amount ?? 0);

  const { handleSubmit, register, formState: { errors } } = useForm({
    mode: 'all',
  });

  const handleSubmitStakeLiberland = ({ amount }) => {
    dispatch(walletActions.stakeToLiberland.call({
      amount: parseMerits(amount),
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
    <form
      className={styles.getCitizenshipModal}
      onSubmit={handleSubmit(handleSubmitStakeLiberland)}
    >
      <div className={styles.h3}>PolitiPool</div>
      <div className={styles.title}>Amount LLM</div>
      <TextInput
        register={register}
        validate={validateUnbondValue}
        required
        name="amount"
        placeholder="Amount LLM"
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
          Stake
        </Button>
      </div>
    </form>
  );
}

PolitipoolModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

function PolitipoolModalWrapper(props) {
  return (
    <ModalRoot>
      <PolitipoolModal {...props} />
    </ModalRoot>
  );
}

export default PolitipoolModalWrapper;
