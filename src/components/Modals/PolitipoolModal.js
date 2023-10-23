import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// COMPONENTS
import { useForm } from 'react-hook-form';
import ModalRoot from './ModalRoot';
import { TextInput } from '../InputComponents';
import Button from '../Button/Button';
import styles from './styles.module.scss';
import { walletActions } from '../../redux/actions';
import { parseMerits } from '../../utils/walletHelpers';

function PolitipoolModal({ closeModal }) {
  const dispatch = useDispatch();
  const { handleSubmit, register } = useForm({
    mode: 'all',
  });

  const handleSubmitStakeLiberland = ({ amount }) => {
    dispatch(walletActions.stakeToLiberland.call({
      amount: parseMerits(amount),
    }));
    closeModal();
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
